import { z } from "zod";
import {
  LLMMessage,
  LLMProvider,
  LLMProviderOptions,
  LLMResponse,
  LLMStructuredOutputResult,
  LLMToolDefinition,
} from "./types";

/**
 * MockLLMProvider is a deterministic, offline testing provider.
 * It is clearly labeled as a MOCK and should not be used as a production LLM.
 * Useful for development, end-to-end tests, and sandboxed validation.
 */
export class MockLLMProvider implements LLMProvider {
  public readonly providerId = "mock";
  public readonly defaultModel = "mock-seo-gpt4";

  public async generateResponse(
    messages: LLMMessage[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    const userPrompt = messages.find((m) => m.role === "user")?.content || "";
    const systemPrompt = messages.find((m) => m.role === "system")?.content || "";

    const text = `[MOCK LLM RESPONSE] Processed prompt (${userPrompt.length} chars) using mock intelligence. System context: ${systemPrompt.slice(
      0,
      60
    )}...`;

    return {
      text,
      model: options?.model || this.defaultModel,
      provider: this.providerId,
      finishReason: "stop",
      usage: {
        promptTokens: Math.ceil((userPrompt.length + systemPrompt.length) / 4),
        completionTokens: Math.ceil(text.length / 4),
        totalTokens:
          Math.ceil((userPrompt.length + systemPrompt.length) / 4) +
          Math.ceil(text.length / 4),
        estimatedCostUsd: 0.0,
      },
    };
  }

  public async generateStructuredOutput<T>(
    messages: LLMMessage[],
    schema: z.ZodType<T>,
    schemaName?: string,
    options?: LLMProviderOptions
  ): Promise<LLMStructuredOutputResult<T>> {
    const conversation = messages.map((m) => m.content).join(" ");
    const name = schemaName || "";

    let mockData: unknown = {};

    // 1. Technical SEO Agent or audit output
    if (
      name.includes("technical-seo-agent") ||
      conversation.includes("Technical SEO") ||
      conversation.includes("crawledPages")
    ) {
      mockData = {
        findings: [
          {
            category: "TECHNICAL",
            title: "Missing Canonical Tag on Primary Landing Pages",
            description:
              "Multiple pages lack explicit rel=canonical link elements, posing duplicate content risk across protocol variants.",
            evidence: {
              affectedUrls: ["https://example.com/about", "https://example.com/services"],
              details: "Missing <link rel='canonical'> in DOM head.",
            },
            severity: "HIGH",
            confidence: 0.98,
            recommendedFix:
              "Insert absolute rel=canonical link pointing to self-referential canonical URL in head template.",
          },
          {
            category: "ON_PAGE",
            title: "Suboptimal Meta Description Length",
            description:
              "Meta description is either missing or exceeds 160 characters, risking truncation in Google SERP snippets.",
            evidence: {
              affectedUrls: ["https://example.com/"],
              details: "Length: 210 characters (exceeds recommended 155 chars)",
            },
            severity: "MEDIUM",
            confidence: 0.95,
            recommendedFix:
              "Rewrite meta description to concise, high-converting 145-155 character copy with primary target keywords.",
          },
          {
            category: "STRUCTURED_DATA",
            title: "Missing Organization Schema Markup",
            description:
              "No JSON-LD schema found describing the corporate entity, logo, and social profiles.",
            evidence: {
              affectedUrls: ["https://example.com/"],
              details: "No schema.org/Organization script detected",
            },
            severity: "MEDIUM",
            confidence: 0.99,
            recommendedFix:
              "Embed schema.org/Organization JSON-LD block in layout head.",
          },
        ],
        summary:
          "Technical SEO analysis identified 3 priority issues across canonicalization, metadata, and structured data.",
      };
    } else if (
      name.includes("roadmap-planning-agent") ||
      conversation.includes("roadmap") ||
      conversation.includes("findings")
    ) {
      mockData = {
        tasks: [
          {
            title: "Add Self-Referential Canonical Link to Root Head Template",
            description:
              "Implement canonical URL tag in the primary head template to consolidate indexation equity.",
            assignedAgent: "code-implementation-agent",
            priority: "HIGH",
            affectedUrls: ["https://example.com/about", "https://example.com/services"],
            evidence: "Missing canonical tag identified during technical audit",
            acceptanceCriteria:
              "Verify every page renders <link rel='canonical' href='https://...'> in HTML head with 200 OK status.",
            executionStrategy: "CODE_PATCH",
            riskLevel: "LOW",
            requiresApproval: true,
            phase: 1,
          },
          {
            title: "Implement Organization JSON-LD Schema",
            description:
              "Inject valid JSON-LD entity graph with Organization, name, url, and logo attributes.",
            assignedAgent: "structured-data-agent",
            priority: "MEDIUM",
            affectedUrls: ["https://example.com/"],
            evidence: "Zero schema entities found on homepage",
            acceptanceCriteria:
              "Page contains valid JSON-LD script parseable by schema validators with @type Organization.",
            executionStrategy: "CODE_PATCH",
            riskLevel: "LOW",
            requiresApproval: true,
            phase: 1,
          },
        ],
        reasoning:
          "Prioritized high-confidence technical fixes with low risk before embarking on content expansions.",
      };
    } else if (
      name.includes("code-implementation") ||
      conversation.includes("patch") ||
      conversation.includes("layout")
    ) {
      mockData = {
        diff: `--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -5,6 +5,8 @@
 export const metadata = {
   title: "Site Title",
   description: "Targeted SEO description under 160 characters.",
+  alternates: {
+    canonical: "/",
+  },
 };`,
        branchName: "seo-autopilot-fix",
        status: "STAGED",
      };
    } else if (
      name.includes("autonomous-ceo-agent") ||
      conversation.includes("Autonomous CEO") ||
      conversation.includes("strategicDirectives")
    ) {
      mockData = {
        strategicDirectives: [
          "Establish foundational technical crawl equity and fix indexation blockers",
          "Inject structured data entities (Organization & WebSite) to secure rich snippets",
          "Consolidate domain authority and eliminate internal duplicate URL canonical splits",
          "Optimize Core Web Vitals to maintain sub-2.5s Largest Contentful Paint across key templates",
        ],
        primaryObjectives: [
          "Attain 95%+ Technical SEO Health Score",
          "Zero critical canonical or structured data validation errors",
          "100% post-execution QA verification pass rate",
        ],
        targetHealthScore: 98,
        ceoVision:
          "Autonomous self-executing enterprise SEO operation maximizing organic traffic capture and search engine trust with zero human latency.",
      };
    } else if (
      name.includes("project-manager-agent") ||
      conversation.includes("Project Manager") ||
      conversation.includes("delegatedTasks")
    ) {
      mockData = {
        delegatedTasks: [
          {
            title: "Inject Root Organization JSON-LD Entity Graph",
            assignedAgent: "structured-data-agent",
            priority: "HIGH",
            executionStrategy: "CODE_PATCH",
            phase: 1,
          },
          {
            title: "Patch Absolute Self-Referential Canonical Tag in Root Head",
            assignedAgent: "code-implementation-agent",
            priority: "HIGH",
            executionStrategy: "CODE_PATCH",
            phase: 1,
          },
          {
            title: "Align Meta Description within 155-Character Snippet Limit",
            assignedAgent: "content-creation-agent",
            priority: "MEDIUM",
            executionStrategy: "CODE_PATCH",
            phase: 2,
          },
          {
            title: "Optimize Image Dimensions & Alt Tags for Cumulative Layout Shift",
            assignedAgent: "performance-agent",
            priority: "MEDIUM",
            executionStrategy: "CODE_PATCH",
            phase: 2,
          },
        ],
        operationalSummary:
          "Deconstructed CEO directives into 4 phased, dependency-sequenced engineering work orders assigned to specialist agents for autonomous execution.",
      };
    } else if (
      name.includes("quality-assurance") ||
      conversation.includes("acceptanceCriteria")
    ) {
      mockData = {
        passed: true,
        evidence: "HTTP 200 OK confirmed, canonical tag rendered correctly.",
        details: "Acceptance criteria verified with 100% compliance.",
      };
    }

    // Parse against schema
    const parsed = schema.safeParse(mockData);
    const resultData = parsed.success ? parsed.data : (mockData as T);

    const jsonString = JSON.stringify(resultData, null, 2);

    return {
      data: resultData,
      rawText: jsonString,
      model: options?.model || this.defaultModel,
      provider: this.providerId,
      usage: {
        promptTokens: 120,
        completionTokens: 250,
        totalTokens: 370,
        estimatedCostUsd: 0.0,
      },
    };
  }

  public async requestToolCall(
    messages: LLMMessage[],
    tools: LLMToolDefinition[],
    options?: LLMProviderOptions
  ): Promise<LLMResponse> {
    // If the LLM just received a tool result, produce final thought
    if (messages.some((m) => m.role === "tool")) {
      return {
        text: `Based on the executed tool results, the task has been analyzed and completed satisfactorily.`,
        model: options?.model || this.defaultModel,
        provider: this.providerId,
        finishReason: "stop",
        usage: {
          promptTokens: 200,
          completionTokens: 80,
          totalTokens: 280,
          estimatedCostUsd: 0.0,
        },
      };
    }

    // If tools are available, call the first read-only tool or produce completion
    const targetTool = tools[0];
    if (targetTool) {
      return {
        text: `Analyzing using ${targetTool.name}.`,
        toolCalls: [
          {
            id: `call_mock_${Date.now()}`,
            name: targetTool.name,
            arguments: {
              url: "https://example.com",
            },
          },
        ],
        model: options?.model || this.defaultModel,
        provider: this.providerId,
        finishReason: "tool_calls",
        usage: {
          promptTokens: 150,
          completionTokens: 45,
          totalTokens: 195,
          estimatedCostUsd: 0.0,
        },
      };
    }

    return this.generateResponse(messages, options);
  }
}
