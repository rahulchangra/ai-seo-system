import { AnthropicProvider } from "./anthropic-provider";
import { GeminiProvider } from "./gemini-provider";
import { MockLLMProvider } from "./mock-provider";
import { OpenAIProvider } from "./openai-provider";
import { LLMProvider } from "./types";

export * from "./types";
export * from "./mock-provider";
export * from "./openai-provider";
export * from "./anthropic-provider";
export * from "./gemini-provider";

export function getLLMProvider(requestedProvider?: string): LLMProvider {
  const provider =
    requestedProvider || process.env.LLM_PROVIDER || "mock";

  switch (provider.toLowerCase()) {
    case "openai":
      if (process.env.OPENAI_API_KEY) {
        return new OpenAIProvider();
      }
      console.warn("OPENAI_API_KEY not found; falling back to MockLLMProvider");
      return new MockLLMProvider();

    case "anthropic":
      if (process.env.ANTHROPIC_API_KEY) {
        return new AnthropicProvider();
      }
      console.warn("ANTHROPIC_API_KEY not found; falling back to MockLLMProvider");
      return new MockLLMProvider();

    case "gemini":
      if (process.env.GEMINI_API_KEY) {
        return new GeminiProvider();
      }
      console.warn("GEMINI_API_KEY not found; falling back to MockLLMProvider");
      return new MockLLMProvider();

    case "mock":
    default:
      return new MockLLMProvider();
  }
}
