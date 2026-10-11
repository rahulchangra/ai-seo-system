import { z } from "zod";

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface LLMToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
}

export interface LLMToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface LLMResponse {
  text: string;
  toolCalls?: LLMToolCall[];
  usage: LLMUsage;
  model: string;
  provider: string;
  finishReason: "stop" | "tool_calls" | "length" | "error";
}

export interface LLMStructuredOutputResult<T> {
  data: T;
  rawText: string;
  usage: LLMUsage;
  model: string;
  provider: string;
}

export interface LLMProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface LLMProvider {
  readonly providerId: string;
  readonly defaultModel: string;

  generateResponse(
    messages: LLMMessage[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse>;

  generateStructuredOutput<T>(
    messages: LLMMessage[],
    schema: z.ZodType<T>,
    schemaName?: string,
    options?: LLMProviderOptions
  ): Promise<LLMStructuredOutputResult<T>>;

  requestToolCall(
    messages: LLMMessage[],
    tools: LLMToolDefinition[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse>;
}
