import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

// In-memory runtime settings cache (or env overlay)
let runtimeSettings = {
  llmProvider: process.env.LLM_PROVIDER || "mock",
  modelName: process.env.LLM_MODEL || "mock-seo-gpt4",
  openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  groqConfigured: Boolean(process.env.GROQ_API_KEY),
};

const updateSettingsSchema = z.object({
  llmProvider: z.enum(["mock", "openai", "anthropic", "gemini", "groq"]),
  modelName: z.string().optional(),
  apiKey: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: {
      ...runtimeSettings,
      activeProvider: process.env.LLM_PROVIDER || runtimeSettings.llmProvider,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = updateSettingsSchema.parse(body);

    runtimeSettings.llmProvider = validated.llmProvider;
    process.env.LLM_PROVIDER = validated.llmProvider;

    if (validated.modelName) {
      runtimeSettings.modelName = validated.modelName;
    }

    if (validated.apiKey) {
      if (validated.llmProvider === "openai") process.env.OPENAI_API_KEY = validated.apiKey;
      if (validated.llmProvider === "anthropic") process.env.ANTHROPIC_API_KEY = validated.apiKey;
      if (validated.llmProvider === "gemini") process.env.GEMINI_API_KEY = validated.apiKey;
      if (validated.llmProvider === "groq") process.env.GROQ_API_KEY = validated.apiKey;
    }

    return NextResponse.json({
      success: true,
      settings: runtimeSettings,
      message: `Configured active LLM Provider to '${validated.llmProvider}'`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
