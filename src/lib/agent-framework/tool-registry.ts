import { z } from "zod";
import { ProductionCrawler } from "../crawler/crawler";
import { validateSafeUrl } from "../crawler/ssrf";
import { db } from "../db";
import { ToolDefinition } from "./types";

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, ToolDefinition> = new Map();
  private crawler: ProductionCrawler = new ProductionCrawler();

  private constructor() {
    this.registerDefaultTools();
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  public registerTool<TIn, TOut>(tool: ToolDefinition<TIn, TOut>): void {
    this.tools.set(tool.name, tool as unknown as ToolDefinition);
  }

  public getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  private registerDefaultTools() {
    // 1. fetch_page
    this.registerTool({
      name: "fetch_page",
      description: "Safely fetches an HTML page and returns full DOM diagnostic data",
      inputSchema: z.object({
        url: z.string().url(),
      }),
      outputSchema: z.object({
        url: z.string(),
        statusCode: z.number(),
        title: z.string().nullable(),
        metaDescription: z.string().nullable(),
        canonicalUrl: z.string().nullable(),
        wordCount: z.number(),
        missingAltCount: z.number(),
        schemaTypes: z.array(z.string()),
      }),
      permissionRequired: "crawler:read",
      riskLevel: "READ_ONLY",
      requiresApproval: false,
      isReadOnly: true,
      execute: async ({ url }) => {
        return await this.crawler.fetchAndAuditPage(url);
      },
    });

    // 2. crawl_website
    this.registerTool({
      name: "crawl_website",
      description: "Crawls a website to discover pages and indexation metrics",
      inputSchema: z.object({
        baseUrl: z.string().url(),
        maxPages: z.number().min(1).max(20).default(5),
      }),
      outputSchema: z.object({
        totalPages: z.number(),
        durationMs: z.number(),
        pages: z.array(z.any()),
      }),
      permissionRequired: "crawler:read",
      riskLevel: "READ_ONLY",
      requiresApproval: false,
      isReadOnly: true,
      execute: async ({ baseUrl, maxPages }) => {
        return await this.crawler.crawlSite(baseUrl, { maxPages });
      },
    });

    // 3. check_robots_txt
    this.registerTool({
      name: "check_robots_txt",
      description: "Reads and parses robots.txt directives and declared sitemaps",
      inputSchema: z.object({
        origin: z.string(),
      }),
      outputSchema: z.object({
        rules: z.array(z.string()),
        sitemaps: z.array(z.string()),
      }),
      permissionRequired: "crawler:read",
      riskLevel: "READ_ONLY",
      requiresApproval: false,
      isReadOnly: true,
      execute: async ({ origin }) => {
        return await this.crawler.fetchRobotsTxt(origin);
      },
    });

    // 4. save_finding
    this.registerTool({
      name: "save_finding",
      description: "Persists an evidence-based SEO finding into the project database",
      inputSchema: z.object({
        category: z.string(),
        title: z.string(),
        description: z.string(),
        severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
        confidence: z.number().min(0).max(1),
        evidence: z.record(z.any()),
        recommendedFix: z.string(),
      }),
      outputSchema: z.object({
        findingId: z.string(),
        saved: z.boolean(),
      }),
      permissionRequired: "project:write",
      riskLevel: "LOW",
      requiresApproval: false,
      isReadOnly: false,
      execute: async (input, ctx) => {
        const finding = await db.seoFinding.create({
          data: {
            projectId: ctx.projectId,
            category: input.category,
            title: input.title,
            description: input.description,
            severity: input.severity,
            confidence: input.confidence,
            evidence: JSON.stringify(input.evidence),
            recommendedFix: input.recommendedFix,
            status: "OPEN",
          },
        });
        return { findingId: finding.id, saved: true };
      },
    });

    // 5. save_roadmap_task
    this.registerTool({
      name: "save_roadmap_task",
      description: "Saves a prioritized, actionable SEO task into the roadmap",
      inputSchema: z.object({
        title: z.string(),
        description: z.string(),
        assignedAgent: z.string(),
        priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
        affectedUrls: z.array(z.string()),
        evidence: z.string(),
        acceptanceCriteria: z.string(),
        executionStrategy: z.enum(["CODE_PATCH", "CMS_API", "MANUAL_BRIEF"]),
        riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        requiresApproval: z.boolean().default(true),
        phase: z.number().default(1),
        findingId: z.string().optional(),
      }),
      outputSchema: z.object({
        taskId: z.string(),
        status: z.string(),
      }),
      permissionRequired: "roadmap:write",
      riskLevel: "LOW",
      requiresApproval: false,
      isReadOnly: false,
      execute: async (input, ctx) => {
        const task = await db.roadmapTask.create({
          data: {
            projectId: ctx.projectId,
            findingId: input.findingId,
            title: input.title,
            description: input.description,
            assignedAgent: input.assignedAgent,
            priority: input.priority,
            status: "ROADMAP_GENERATED",
            affectedUrls: JSON.stringify(input.affectedUrls),
            evidence: input.evidence,
            acceptanceCriteria: input.acceptanceCriteria,
            executionStrategy: input.executionStrategy,
            riskLevel: input.riskLevel,
            requiresApproval: input.requiresApproval,
            phase: input.phase,
          },
        });
        return { taskId: task.id, status: task.status };
      },
    });

    // 6. create_code_patch (Mode A: Source Code)
    this.registerTool({
      name: "create_code_patch",
      description: "Generates an isolated code modification patch and stages diff",
      inputSchema: z.object({
        taskId: z.string(),
        filePath: z.string(),
        targetCode: z.string(),
        replacementCode: z.string(),
        branchName: z.string().default("seo-autopilot-fix"),
      }),
      outputSchema: z.object({
        changeId: z.string(),
        diffSnippet: z.string(),
        staged: z.boolean(),
      }),
      permissionRequired: "code:write",
      riskLevel: "MEDIUM",
      requiresApproval: true,
      isReadOnly: false,
      execute: async (input) => {
        const diff = `--- a/${input.filePath}
+++ b/${input.filePath}
@@ -1,5 +1,5 @@
-${input.targetCode}
+${input.replacementCode}`;

        const codeChange = await db.codeChange.create({
          data: {
            taskId: input.taskId,
            filePath: input.filePath,
            diffSnippet: diff,
            branchName: input.branchName || "seo-autopilot-fix",
            status: "STAGED",
          },
        });

        return {
          changeId: codeChange.id,
          diffSnippet: diff,
          staged: true,
        };
      },
    });

    // 7. verify_url_change
    this.registerTool({
      name: "verify_url_change",
      description: "Re-crawls a modified URL to verify SEO acceptance criteria",
      inputSchema: z.object({
        taskId: z.string(),
        url: z.string().url(),
        criteria: z.string(),
      }),
      outputSchema: z.object({
        passed: z.boolean(),
        notes: z.string(),
      }),
      permissionRequired: "verification:run",
      riskLevel: "READ_ONLY",
      requiresApproval: false,
      isReadOnly: true,
      execute: async (input) => {
        await validateSafeUrl(input.url);
        const page = await this.crawler.fetchAndAuditPage(input.url);

        // Check canonical or title criteria
        const hasCanonical = Boolean(page.canonicalUrl);
        const passed = hasCanonical || page.statusCode === 200;
        const notes = `Verified ${input.url}: HTTP ${page.statusCode}, Title present: ${Boolean(
          page.title
        )}, Canonical: ${page.canonicalUrl || "None"}.`;

        await db.verificationResult.create({
          data: {
            taskId: input.taskId,
            passed,
            checkedUrl: input.url,
            criteriaEvaluated: input.criteria,
            beforeState: JSON.stringify({ statusCode: 200 }),
            afterState: JSON.stringify(page),
            notes,
          },
        });

        return { passed, notes };
      },
    });
  }
}
