import { db } from "../db";
import { LLMMessage, LLMProvider, LLMUsage } from "../llm/types";
import { ToolRegistry } from "./tool-registry";
import {
  AgentDefinition,
  AgentExecutionContext,
  AgentExecutionResult,
} from "./types";

export class AgentRuntime {
  private toolRegistry: ToolRegistry;
  private llmProvider: LLMProvider;

  constructor(llmProvider: LLMProvider) {
    this.toolRegistry = ToolRegistry.getInstance();
    this.llmProvider = llmProvider;
  }

  /**
   * Executes an agent through a bounded tool-calling loop.
   */
  public async execute<TInput, TOutput>(
    agent: AgentDefinition<TInput, TOutput>,
    input: TInput,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult<TOutput>> {
    const startTime = Date.now();
    const parsedInput = agent.inputSchema.safeParse(input);
    const validatedInput = parsedInput.success ? parsedInput.data : (input as any);

    // 1. Record agent run in Database
    let runRecordId: string | null = null;
    try {
      const run = await db.agentRun.create({
        data: {
          projectId: context.projectId,
          agentId: agent.id,
          status: "RUNNING",
          prompt: JSON.stringify(validatedInput).slice(0, 500),
          inputContext: JSON.stringify(validatedInput),
        },
      });
      runRecordId = run.id;
    } catch {
      // Non-blocking if database is initializing
    }

    const messages: LLMMessage[] = [
      {
        role: "system",
        content: `${agent.systemPrompt}\n\nAllowed Tools: ${agent.allowedTools.join(", ")}`,
      },
      {
        role: "user",
        content: `Target Input:\n${JSON.stringify(validatedInput, null, 2)}`,
      },
    ];

    const usageAccumulator: LLMUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCostUsd: 0.0,
    };

    const executedTools: Array<{
      toolName: string;
      input: unknown;
      output: unknown;
      status: "SUCCESS" | "FAILED" | "BLOCKED";
    }> = [];

    const availableTools = agent.allowedTools
      .map((name) => this.toolRegistry.getTool(name))
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((t) => ({
        name: t.name,
        description: t.description,
        parameters: {}, // JSON schema representation
      }));

    let iteration = 0;
    const maxIterations = agent.executionLimits.maxIterations;
    const timeoutMs = agent.executionLimits.timeoutMs;

    try {
      while (iteration < maxIterations) {
        if (Date.now() - startTime > timeoutMs) {
          throw new Error(`Execution exceeded timeout limit of ${timeoutMs}ms`);
        }

        iteration++;

        // Call the LLM provider requesting tool call or answer
        const response = await this.llmProvider.requestToolCall(
          messages,
          availableTools,
          {
            model: agent.modelConfig.preferredModel,
            temperature: agent.modelConfig.temperature,
          }
        );

        // Accumulate token usage
        usageAccumulator.promptTokens += response.usage.promptTokens;
        usageAccumulator.completionTokens += response.usage.completionTokens;
        usageAccumulator.totalTokens += response.usage.totalTokens;
        usageAccumulator.estimatedCostUsd += response.usage.estimatedCostUsd;

        // If no tool call was requested, finish and produce structured output
        if (!response.toolCalls || response.toolCalls.length === 0) {
          messages.push({
            role: "assistant",
            content: response.text,
          });

          // Produce structured result parsed by Zod schema
          const structuredResult = await this.llmProvider.generateStructuredOutput(
            messages,
            agent.outputSchema,
            `${agent.id}_output`
          );

          usageAccumulator.totalTokens += structuredResult.usage.totalTokens;

          const durationMs = Date.now() - startTime;

          // Update database record
          if (runRecordId) {
            await db.agentRun.update({
              where: { id: runRecordId },
              data: {
                status: "COMPLETED",
                outputSummary: JSON.stringify(structuredResult.data).slice(0, 1000),
                tokensUsed: usageAccumulator.totalTokens,
                executionCost: usageAccumulator.estimatedCostUsd,
                durationMs,
              },
            });
          }

          return {
            agentId: agent.id,
            status: "SUCCESS",
            data: structuredResult.data,
            durationMs,
            usage: usageAccumulator,
            toolCallsExecuted: executedTools,
            messages,
          };
        }

        // Handle tool calls strictly verified against agent permissions
        for (const toolCall of response.toolCalls) {
          const toolName = toolCall.name;

          // Permission check: Is tool declared in agent.allowedTools?
          if (!agent.allowedTools.includes(toolName)) {
            const blockedMsg = `Security violation: Agent '${agent.id}' is not authorized to invoke tool '${toolName}'.`;
            executedTools.push({
              toolName,
              input: toolCall.arguments,
              output: { error: blockedMsg },
              status: "BLOCKED",
            });
            messages.push({
              role: "tool",
              name: toolName,
              toolCallId: toolCall.id,
              content: JSON.stringify({ error: blockedMsg }),
            });
            continue;
          }

          const tool = this.toolRegistry.getTool(toolName);
          if (!tool) {
            messages.push({
              role: "tool",
              name: toolName,
              toolCallId: toolCall.id,
              content: JSON.stringify({ error: `Tool '${toolName}' not found.` }),
            });
            continue;
          }

          // If tool requires human approval and action is not read-only
          if (tool.requiresApproval && !tool.isReadOnly) {
            // Check if approval required before proceeding
            // For now, record and safely execute or gate
          }

          try {
            // Validate tool input schema
            const validatedToolInput = tool.inputSchema.parse(toolCall.arguments);
            const toolStartTime = Date.now();
            const toolOutput = await tool.execute(validatedToolInput, context);
            const toolDuration = Date.now() - toolStartTime;

            executedTools.push({
              toolName,
              input: validatedToolInput,
              output: toolOutput,
              status: "SUCCESS",
            });

            if (runRecordId) {
              await db.toolExecution.create({
                data: {
                  agentRunId: runRecordId,
                  toolName,
                  inputPayload: JSON.stringify(validatedToolInput),
                  outputPayload: JSON.stringify(toolOutput),
                  status: "SUCCESS",
                  durationMs: toolDuration,
                },
              });
            }

            messages.push({
              role: "tool",
              name: toolName,
              toolCallId: toolCall.id,
              content: JSON.stringify(toolOutput),
            });
          } catch (toolErr: unknown) {
            const errMsg = (toolErr as Error).message;
            executedTools.push({
              toolName,
              input: toolCall.arguments,
              output: { error: errMsg },
              status: "FAILED",
            });

            if (runRecordId) {
              await db.toolExecution.create({
                data: {
                  agentRunId: runRecordId,
                  toolName,
                  inputPayload: JSON.stringify(toolCall.arguments),
                  outputPayload: JSON.stringify({ error: errMsg }),
                  status: "FAILED",
                  durationMs: 0,
                },
              });
            }

            messages.push({
              role: "tool",
              name: toolName,
              toolCallId: toolCall.id,
              content: JSON.stringify({ error: errMsg }),
            });
          }
        }
      }

      throw new Error(`Agent exceeded maximum execution iterations (${maxIterations})`);
    } catch (err: unknown) {
      const errorStr = (err as Error).message;
      const durationMs = Date.now() - startTime;

      if (runRecordId) {
        await db.agentRun.update({
          where: { id: runRecordId },
          data: {
            status: "FAILED",
            errorMessage: errorStr,
            durationMs,
          },
        });
      }

      return {
        agentId: agent.id,
        status: "FAILED",
        error: errorStr,
        durationMs,
        usage: usageAccumulator,
        toolCallsExecuted: executedTools,
        messages,
      };
    }
  }
}
