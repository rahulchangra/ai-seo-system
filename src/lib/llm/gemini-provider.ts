import { z } from "zod";
import {
  LLMMessage,
  LLMProvider,
  LLMProviderOptions,
  LLMResponse,
  LLMStructuredOutputResult,
  LLMToolDefinition,
} from "./types";

export class GeminiProvider implements LLMProvider {
  public readonly providerId = "gemini";
  public readonly defaultModel: string;
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey?: string, model = "gemini-1.5-pro") {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.defaultModel = model;
  }

  public async generateResponse(
    messages: LLMMessage[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Gemini API key is missing. Set GEMINI_API_KEY in environment.");
    }

    const model = options?.model || this.defaultModel;
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === "system")?.content;

    const res = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            temperature: options?.temperature ?? 0.2,
            maxOutputTokens: options?.maxTokens ?? 2048,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text =
      candidate?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";

    const usageMeta = data.usageMetadata || {};
    const promptTokens = usageMeta.promptTokenCount || 0;
    const completionTokens = usageMeta.candidatesTokenCount || 0;

    return {
      text,
      model,
      provider: this.providerId,
      finishReason: "stop",
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUsd: (promptTokens * 0.00125 + completionTokens * 0.005) / 1000,
      },
    };
  }

  public async generateStructuredOutput<T>(
    messages: LLMMessage[],
    schema: z.ZodType<T>,
    schemaName = "structured_response",
    options?: LLMProviderOptions
  ): Promise<LLMStructuredOutputResult<T>> {
    const promptPrefix = {
      role: "system" as const,
      content: `Respond with strictly valid JSON for schema '${schemaName}'. Output only pure JSON without markdown code fences.`,
    };

    const res = await this.generateResponse([promptPrefix, ...messages], options);
    let parsed: unknown;
    try {
      const cleaned = res.text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse Gemini output as JSON: ${res.text}`);
    }

    const validated = schema.safeParse(parsed);
    if (!validated.success) {
      throw new Error(
        `Gemini output failed schema validation: ${JSON.stringify(validated.error.format())}`
      );
    }

    return {
      data: validated.data,
      rawText: res.text,
      usage: res.usage,
      model: res.model,
      provider: this.providerId,
    };
  }

  public async requestToolCall(
    messages: LLMMessage[],
    _tools: LLMToolDefinition[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    // Basic fallback to standard generateResponse
    return this.generateResponse(messages, options);
  }
}
