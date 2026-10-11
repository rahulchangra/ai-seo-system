import { z } from "zod";
import {
  LLMMessage,
  LLMProvider,
  LLMProviderOptions,
  LLMResponse,
  LLMStructuredOutputResult,
  LLMToolDefinition,
} from "./types";

export class OpenAIProvider implements LLMProvider {
  public readonly providerId = "openai";
  public readonly defaultModel: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, model = "gpt-4o") {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
    this.defaultModel = model;
    this.baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  }

  public async generateResponse(
    messages: LLMMessage[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY in environment.");
    }

    const model = options?.model || this.defaultModel;
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          name: m.name,
        })),
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens ?? 2048,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const choice = data.choices[0];
    const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    // Standard OpenAI pricing estimate ($5/M prompt, $15/M completion)
    const cost =
      (usage.prompt_tokens * 0.005 + usage.completion_tokens * 0.015) / 1000;

    return {
      text: choice.message.content || "",
      model: data.model || model,
      provider: this.providerId,
      finishReason: choice.finish_reason === "tool_calls" ? "tool_calls" : "stop",
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
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
      content: `You must respond with valid JSON adhering strictly to the schema '${schemaName}'. Do not include markdown codeblocks or explanation. Only return raw JSON.`,
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
      throw new Error(`Failed to parse LLM structured output as JSON: ${response.text}`);
    }

    const validated = schema.safeParse(parsedJson);
    if (!validated.success) {
      throw new Error(
        `LLM output failed schema validation: ${JSON.stringify(validated.error.format())}`
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
      throw new Error("OpenAI API key missing. Set OPENAI_API_KEY in environment.");
    }

    const model = options?.model || this.defaultModel;
    const formattedTools = tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        tools: formattedTools,
        tool_choice: "auto",
        temperature: options?.temperature ?? 0.1,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI tool call error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const choice = data.choices[0];
    const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const toolCalls = choice.message.tool_calls?.map((tc: { id: string; function: { name: string; arguments: string } }) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: JSON.parse(tc.function.arguments || "{}"),
    }));

    return {
      text: choice.message.content || "",
      toolCalls,
      model: data.model || model,
      provider: this.providerId,
      finishReason: choice.finish_reason === "tool_calls" ? "tool_calls" : "stop",
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        estimatedCostUsd: 0.0,
      },
    };
  }
}
