import { z } from "zod";
import { LLMMessage, LLMUsage } from "../llm/types";

export type RiskLevel = "READ_ONLY" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  permissionRequired: string;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  isReadOnly: boolean;
  timeoutMs?: number;
  execute: (input: TInput, context: AgentExecutionContext) => Promise<TOutput>;
}

export interface AgentDefinition<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  purpose: string;
  systemPrompt: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  allowedTools: string[]; // List of tool names
  riskLevel: RiskLevel;
  modelConfig: {
    preferredModel?: string;
    temperature?: number;
    maxTokens?: number;
  };
  executionLimits: {
    maxIterations: number;
    timeoutMs: number;
    maxRetries: number;
    maxTokensBudget: number;
  };
  requiresApprovalForActions: boolean;
  verificationRules?: {
    requiresPostExecutionCheck: boolean;
    verificationType?: "HTTP_CRAWL" | "DOM_CHECK" | "CODE_SYNTAX";
  };
}

export interface AgentExecutionContext {
  projectId: string;
  organizationId: string;
  operatingMode: "MODE_A" | "MODE_B";
  repoDetails?: {
    repoUrl: string;
    branch: string;
  };
  cmsDetails?: {
    platform: string;
    endpoint?: string;
  };
  auditTrail: Array<{
    timestamp: string;
    event: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface AgentExecutionResult<TOutput = unknown> {
  agentId: string;
  status: "SUCCESS" | "FAILED" | "CANCELLED" | "APPROVAL_REQUIRED";
  data?: TOutput;
  error?: string;
  durationMs: number;
  usage: LLMUsage;
  toolCallsExecuted: Array<{
    toolName: string;
    input: unknown;
    output: unknown;
    status: "SUCCESS" | "FAILED" | "BLOCKED";
  }>;
  messages: LLMMessage[];
}
