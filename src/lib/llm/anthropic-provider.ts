import { z } from "zod";
import {
  LLMMessage,
  LLMProvider,
  LLMProviderOptions,
  LLMResponse,
  LLMStructuredOutputResult,
  LLMToolDefinition,
} from "./types";

export class AnthropicProvider implements LLMProvider {
  public readonly providerId = "anthropic";
  public readonly defaultModel: string;
  private apiKey: string;
  private baseUrl = "https://api.anthropic.com/v1";

  constructor(apiKey?: string, model = "claude-3-5-sonnet-20241022") {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
    this.defaultModel = model;
  }

  public async generateResponse(
    messages: LLMMessage[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Anthropic API key is missing. Set ANTHROPIC_API_KEY in environment.");
    }

    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const conversation = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options?.model || this.defaultModel,
        system: systemMsg,
        messages: conversation,
        max_tokens: options?.maxTokens ?? 2048,
        temperature: options?.temperature ?? 0.2,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const textContent =
      data.content?.filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n") || "";

    const usage = data.usage || { input_tokens: 0, output_tokens: 0 };
    const cost =
      (usage.input_tokens * 0.003 + usage.output_tokens * 0.015) / 1000;

    return {
      text: textContent,
      model: data.model || this.defaultModel,
      provider: this.providerId,
      finishReason: data.stop_reason === "tool_use" ? "tool_calls" : "stop",
      usage: {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
        estimatedCostUsd: cost,
      },
    };
  }

  public async generateStructuredOutput<T>(
    messages: LLMMessage[],
    schema: z.ZodType<T>,
    schemaName = "structured_response",
    options?: LLMProviderOptions
  ): Promise<LLMStructuredOutputResult<T>> {
    const systemPromptWithSchema = {
      role: "system" as const,
      content: `You must return strictly valid JSON corresponding to schema '${schemaName}'. Do not wrap in markdown or include extraneous commentary. Output pure JSON.`,
    };

    const response = await this.generateResponse(
      [systemPromptWithSchema, ...messages],
      options
    );

    let parsedJson: unknown;
    try {
      const cleaned = response.text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      parsedJson = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse Anthropic structured output as JSON: ${response.text}`);
    }

    const validated = schema.safeParse(parsedJson);
    if (!validated.success) {
      throw new Error(
        `Anthropic structured output failed schema validation: ${JSON.stringify(
          validated.error.format()
        )}`
      );
    }

    return {
      data: validated.data,
      rawText: response.text,
      usage: response.usage,
      model: response.model,
      provider: this.providerId,
    };
  }

  public async requestToolCall(
    messages: LLMMessage[],
    tools: LLMToolDefinition[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Anthropic API key is missing. Set ANTHROPIC_API_KEY.");
    }

    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const conversation = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const formattedTools = tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    }));

    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options?.model || this.defaultModel,
        system: systemMsg,
        messages: conversation,
        tools: formattedTools,
        max_tokens: options?.maxTokens ?? 2048,
        temperature: options?.temperature ?? 0.1,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic tool call error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const toolUseBlocks = data.content?.filter((c: { type: string }) => c.type === "tool_use") || [];
    const textBlocks = data.content?.filter((c: { type: string }) => c.type === "text") || [];

    const toolCalls = toolUseBlocks.map((t: { id: string; name: string; input: Record<string, unknown> }) => ({
      id: t.id,
      name: t.name,
      arguments: t.input,
    }));

    return {
      text: textBlocks.map((t: { text: string }) => t.text).join("\n"),
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      model: data.model || this.defaultModel,
      provider: this.providerId,
      finishReason: data.stop_reason === "tool_use" ? "tool_calls" : "stop",
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        estimatedCostUsd: 0.0,
      },
    };
  }
}
