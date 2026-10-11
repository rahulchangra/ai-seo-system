import { z } from "zod";
import { AgentDefinition } from "./types";

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentDefinition> = new Map();

  private constructor() {
    this.registerAllSpecialistAgents();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public getAgent(id: string): AgentDefinition | undefined {
    return this.agents.get(id);
  }

  public getAllAgents(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }

  private registerAllSpecialistAgents() {
    // 1. Website Discovery Agent
    this.agents.set("website-discovery-agent", {
      id: "website-discovery-agent",
      name: "Website Discovery Agent",
      purpose: "Discovers accessible URLs through sitemaps, internal links, and page structures.",
      systemPrompt:
        "You are the Website Discovery Agent. Your duty is to discover and inventory accessible website pages, map hierarchy, and identify crawl limitations.",
      inputSchema: z.object({
        targetUrl: z.string().url(),
        maxPages: z.number().default(10),
      }),
      outputSchema: z.object({
        discoveredUrls: z.array(z.string()),
        sitemaps: z.array(z.string()),
        hasRobotsTxt: z.boolean(),
      }),
      allowedTools: ["fetch_page", "crawl_website", "check_robots_txt"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.1 },
      executionLimits: {
        maxIterations: 5,
        timeoutMs: 60000,
        maxRetries: 2,
        maxTokensBudget: 4000,
      },
      requiresApprovalForActions: false,
    });

    // 2. Technical SEO Agent
    this.agents.set("technical-seo-agent", {
      id: "technical-seo-agent",
      name: "Technical SEO Agent",
      purpose: "Analyzes status codes, redirect chains, canonicals, robots directives, metadata, and indexability.",
      systemPrompt:
        "You are the Technical SEO Agent. Analyze crawled pages for critical technical flaws (canonicals, indexability, 4xx/5xx status codes, missing tags). Every finding must have concrete evidence and affected URLs.",
      inputSchema: z.object({
        crawledPages: z.array(z.any()),
        targetDomain: z.string(),
      }),
      outputSchema: z.object({
        findings: z.array(
          z.object({
            category: z.string(),
            title: z.string(),
            description: z.string(),
            severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
            confidence: z.number(),
            evidence: z.any(),
            recommendedFix: z.string(),
          })
        ),
        summary: z.string(),
      }),
      allowedTools: ["fetch_page", "check_robots_txt", "save_finding"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.1 },
      executionLimits: {
        maxIterations: 6,
        timeoutMs: 90000,
        maxRetries: 2,
        maxTokensBudget: 8000,
      },
      requiresApprovalForActions: false,
    });

    // 3. Keyword Research Agent
    this.agents.set("keyword-research-agent", {
      id: "keyword-research-agent",
      name: "Keyword Research Agent",
      purpose: "Discovers keyword opportunities, groups search intent, maps keywords to URLs, and detects cannibalization.",
      systemPrompt: "You are the Keyword Research Agent. Never invent fabricated volume estimates.",
      inputSchema: z.object({ seedKeywords: z.array(z.string()), existingUrls: z.array(z.string()) }),
      outputSchema: z.object({ clusters: z.array(z.any()) }),
      allowedTools: ["save_finding"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.3 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 5000 },
      requiresApprovalForActions: false,
    });

    // 4. Competitor Analysis Agent
    this.agents.set("competitor-analysis-agent", {
      id: "competitor-analysis-agent",
      name: "Competitor Analysis Agent",
      purpose: "Analyzes competitors to identify content gaps, page-type differences, and keyword overlap.",
      systemPrompt: "You are the Competitor Analysis Agent. Use only public information.",
      inputSchema: z.object({ competitorUrls: z.array(z.string()) }),
      outputSchema: z.object({ contentGaps: z.array(z.string()) }),
      allowedTools: ["fetch_page", "save_finding"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 5, timeoutMs: 60000, maxRetries: 2, maxTokensBudget: 6000 },
      requiresApprovalForActions: false,
    });

    // 5. Content Strategy Agent
    this.agents.set("content-strategy-agent", {
      id: "content-strategy-agent",
      name: "Content Strategy Agent",
      purpose: "Builds topic clusters, identifies missing or outdated content, and creates an evidence-based editorial plan.",
      systemPrompt: "You are the Content Strategy Agent.",
      inputSchema: z.object({ topic: z.string(), currentContent: z.array(z.string()) }),
      outputSchema: z.object({ topicClusters: z.array(z.any()) }),
      allowedTools: ["save_roadmap_task"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.3 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 6000 },
      requiresApprovalForActions: false,
    });

    // 6. Content Creation Agent
    this.agents.set("content-creation-agent", {
      id: "content-creation-agent",
      name: "Content Creation Agent",
      purpose: "Creates content from approved briefs following brand guidelines and search intent.",
      systemPrompt: "You are the Content Creation Agent. Avoid low-value mass-generated copy.",
      inputSchema: z.object({ brief: z.string(), targetWordCount: z.number().default(1200) }),
      outputSchema: z.object({ articleMarkdown: z.string(), suggestedMetaTitle: z.string(), suggestedMetaDescription: z.string() }),
      allowedTools: [],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.4 },
      executionLimits: { maxIterations: 3, timeoutMs: 60000, maxRetries: 2, maxTokensBudget: 8000 },
      requiresApprovalForActions: false,
    });

    // 7. On-Page SEO Agent
    this.agents.set("on-page-seo-agent", {
      id: "on-page-seo-agent",
      name: "On-Page SEO Agent",
      purpose: "Recommends and implements changes to metadata, headings, internal links, and image alt text.",
      systemPrompt: "You are the On-Page SEO Agent. Optimize titles (50-60 chars), descriptions (140-160 chars), and heading order.",
      inputSchema: z.object({ pageUrl: z.string(), currentTitle: z.string().nullable(), currentDescription: z.string().nullable() }),
      outputSchema: z.object({ optimizedTitle: z.string(), optimizedDescription: z.string(), recommendations: z.array(z.string()) }),
      allowedTools: ["fetch_page", "save_roadmap_task"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 5000 },
      requiresApprovalForActions: false,
    });

    // 8. Structured Data Agent
    this.agents.set("structured-data-agent", {
      id: "structured-data-agent",
      name: "Structured Data Agent",
      purpose: "Generates and validates appropriate JSON-LD markup without inventing facts.",
      systemPrompt: "You are the Structured Data Agent. Generate valid JSON-LD schemas adhering to schema.org standards.",
      inputSchema: z.object({ pageUrl: z.string(), organizationName: z.string(), schemaType: z.string() }),
      outputSchema: z.object({ jsonLdString: z.string(), isValid: z.boolean() }),
      allowedTools: ["fetch_page", "create_code_patch"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.1 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 5000 },
      requiresApprovalForActions: true,
    });

    // 9. Code Implementation Agent (Mode A)
    this.agents.set("code-implementation-agent", {
      id: "code-implementation-agent",
      name: "Code Implementation Agent",
      purpose: "Reads repository files, creates small scoped patches, and generates branch diffs.",
      systemPrompt: "You are the Code Implementation Agent. Make surgical, minimal patches. Never push directly to main.",
      inputSchema: z.object({ taskId: z.string(), targetFile: z.string(), changeRequirement: z.string() }),
      outputSchema: z.object({ diff: z.string(), branchName: z.string(), status: z.string() }),
      allowedTools: ["create_code_patch"],
      riskLevel: "MEDIUM",
      modelConfig: { temperature: 0.1 },
      executionLimits: { maxIterations: 5, timeoutMs: 60000, maxRetries: 2, maxTokensBudget: 6000 },
      requiresApprovalForActions: true,
      verificationRules: { requiresPostExecutionCheck: true, verificationType: "CODE_SYNTAX" },
    });

    // 10. CMS Execution Agent (Mode B)
    this.agents.set("cms-execution-agent", {
      id: "cms-execution-agent",
      name: "CMS Execution Agent",
      purpose: "Uses authorized CMS APIs to implement supported changes with permission safeguards.",
      systemPrompt: "You are the CMS Execution Agent. Verify API permissions before executing any write operations.",
      inputSchema: z.object({ targetPageId: z.string(), newTitle: z.string().optional(), newMetaDescription: z.string().optional() }),
      outputSchema: z.object({ success: z.boolean(), updatedResource: z.string() }),
      allowedTools: [],
      riskLevel: "MEDIUM",
      modelConfig: { temperature: 0.1 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: true,
    });

    // 11. Performance Agent
    this.agents.set("performance-agent", {
      id: "performance-agent",
      name: "Performance Agent",
      purpose: "Analyzes Core Web Vitals, page weights, script bloat, and TTFB.",
      systemPrompt: "You are the Performance Agent. Identify render-blocking resources, unoptimized images, and caching gaps.",
      inputSchema: z.object({ targetUrl: z.string() }),
      outputSchema: z.object({ opportunities: z.array(z.string()), estimatedImpact: z.string() }),
      allowedTools: ["fetch_page", "save_finding"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.1 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 12. Local SEO Agent
    this.agents.set("local-seo-agent", {
      id: "local-seo-agent",
      name: "Local SEO Agent",
      purpose: "Analyzes location pages, NAP consistency, and local business schemas.",
      systemPrompt: "You are the Local SEO Agent. Ensure Name, Address, and Phone consistency.",
      inputSchema: z.object({ businessName: z.string(), address: z.string() }),
      outputSchema: z.object({ napScore: z.number(), localRecommendations: z.array(z.string()) }),
      allowedTools: ["fetch_page", "save_finding"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 3, timeoutMs: 30000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 13. Off-Page SEO Agent
    this.agents.set("off-page-seo-agent", {
      id: "off-page-seo-agent",
      name: "Off-Page SEO Agent",
      purpose: "Analyzes legitimate backlink opportunities. Never creates spam or artificial links.",
      systemPrompt: "You are the Off-Page SEO Agent. Focus strictly on organic editorial outreach.",
      inputSchema: z.object({ targetDomain: z.string() }),
      outputSchema: z.object({ outreachProspects: z.array(z.string()) }),
      allowedTools: ["save_finding"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 3, timeoutMs: 30000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 14. Quality Assurance Agent
    this.agents.set("quality-assurance-agent", {
      id: "quality-assurance-agent",
      name: "Quality Assurance Agent",
      purpose: "Re-crawls changed pages, validates acceptance criteria, and flags regressions.",
      systemPrompt: "You are the Quality Assurance Agent. Verify live pages against acceptance criteria with zero assumptions.",
      inputSchema: z.object({ taskId: z.string(), targetUrl: z.string(), acceptanceCriteria: z.string() }),
      outputSchema: z.object({ passed: z.boolean(), evidence: z.string(), details: z.string() }),
      allowedTools: ["fetch_page", "verify_url_change"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.1 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 15. Analytics Agent
    this.agents.set("analytics-agent", {
      id: "analytics-agent",
      name: "Analytics Agent",
      purpose: "Reads authorized Search Console and GA4 metrics and reports search trends.",
      systemPrompt: "You are the Analytics Agent. Distinguish measured facts from hypothetical estimates.",
      inputSchema: z.object({ propertyId: z.string() }),
      outputSchema: z.object({ impressionsTrend: z.string(), clicksTrend: z.string(), recommendations: z.array(z.string()) }),
      allowedTools: ["save_finding"],
      riskLevel: "READ_ONLY",
      modelConfig: { temperature: 0.1 },
      executionLimits: { maxIterations: 3, timeoutMs: 30000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 16. Roadmap Planning Agent
    this.agents.set("roadmap-planning-agent", {
      id: "roadmap-planning-agent",
      name: "Roadmap Planning Agent",
      purpose: "Converts audit findings into a prioritized, dependency-aware execution roadmap.",
      systemPrompt:
        "You are the Roadmap Planning Agent. Convert findings into clear, actionable tasks with assigned specialist agents, priorities, acceptance criteria, and risk levels.",
      inputSchema: z.object({
        projectId: z.string(),
        findings: z.array(z.any()),
        operatingMode: z.enum(["MODE_A", "MODE_B"]),
      }),
      outputSchema: z.object({
        tasks: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            assignedAgent: z.string(),
            priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
            affectedUrls: z.array(z.string()),
            evidence: z.string(),
            acceptanceCriteria: z.string(),
            executionStrategy: z.enum(["CODE_PATCH", "CMS_API", "MANUAL_BRIEF"]),
            riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
            requiresApproval: z.boolean(),
            phase: z.number(),
          })
        ),
        reasoning: z.string(),
      }),
      allowedTools: ["save_roadmap_task"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 6, timeoutMs: 90000, maxRetries: 2, maxTokensBudget: 8000 },
      requiresApprovalForActions: false,
    });

    // 17. Continuous Improvement Agent
    this.agents.set("continuous-improvement-agent", {
      id: "continuous-improvement-agent",
      name: "Continuous Improvement Agent",
      purpose: "Reviews new crawl data, detects meaningful changes, and recommends roadmap updates.",
      systemPrompt: "You are the Continuous Improvement Agent.",
      inputSchema: z.object({ previousScore: z.number(), currentCrawlData: z.any() }),
      outputSchema: z.object({ deltas: z.array(z.string()), nextRecommendedActions: z.array(z.string()) }),
      allowedTools: ["save_roadmap_task"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 18. Autonomous CEO Strategic Agent
    this.agents.set("autonomous-ceo-agent", {
      id: "autonomous-ceo-agent",
      name: "Autonomous CEO Agent",
      purpose: "Acts as Chief Executive Officer. Directs overall SEO business objectives, formulates executive directives, and oversees end-to-end execution.",
      systemPrompt:
        "You are the Autonomous CEO Agent. You analyze the target website, market opportunity, and audit findings to establish strategic high-level directives for the Project Manager and ensure full completion.",
      inputSchema: z.object({
        targetUrl: z.string(),
        crawledPagesCount: z.number(),
        findingsCount: z.number(),
      }),
      outputSchema: z.object({
        strategicDirectives: z.array(z.string()),
        primaryObjectives: z.array(z.string()),
        targetHealthScore: z.number(),
        ceoVision: z.string(),
      }),
      allowedTools: ["save_roadmap_task"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 4, timeoutMs: 45000, maxRetries: 2, maxTokensBudget: 4000 },
      requiresApprovalForActions: false,
    });

    // 19. Project Manager Agent
    this.agents.set("project-manager-agent", {
      id: "project-manager-agent",
      name: "Project Manager Agent",
      purpose: "Translates CEO strategic directives into operational task assignments for specialist agents, enforces step-by-step sequencing, and verifies completion.",
      systemPrompt:
        "You are the Project Manager Agent. You receive the CEO's strategic directives and audit findings, allocate work packages to specialist agents, monitor execution, and report final completion back to the CEO.",
      inputSchema: z.object({
        ceoDirectives: z.array(z.string()).default([
          "Establish foundational technical crawl equity and fix indexation blockers",
          "Inject structured data entities (Organization & WebSite) to secure rich snippets",
          "Consolidate domain authority and eliminate internal duplicate URL canonical splits",
        ]),
        findings: z.array(z.any()).default([]),
        operatingMode: z.enum(["MODE_A", "MODE_B"]).default("MODE_B"),
      }),
      outputSchema: z.object({
        delegatedTasks: z.array(
          z.object({
            title: z.string(),
            assignedAgent: z.string(),
            priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
            executionStrategy: z.enum(["CODE_PATCH", "CMS_API", "MANUAL_BRIEF"]),
            phase: z.number(),
          })
        ),
        operationalSummary: z.string(),
      }),
      allowedTools: ["save_roadmap_task"],
      riskLevel: "LOW",
      modelConfig: { temperature: 0.2 },
      executionLimits: { maxIterations: 5, timeoutMs: 60000, maxRetries: 2, maxTokensBudget: 6000 },
      requiresApprovalForActions: false,
    });
  }
}
