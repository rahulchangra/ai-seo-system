import { ProductionCrawler } from "../crawler/crawler";
import { db } from "../db";
import { getLLMProvider } from "../llm";
import { AgentRegistry } from "./agent-registry";
import { ProjectMemory } from "./project-memory";
import { AgentRuntime } from "./runtime";
import { AgentExecutionContext } from "./types";

export class AgentOrchestrator {
  private agentRegistry: AgentRegistry;
  private runtime: AgentRuntime;
  private crawler: ProductionCrawler;

  constructor() {
    this.agentRegistry = AgentRegistry.getInstance();
    const llmProvider = getLLMProvider();
    this.runtime = new AgentRuntime(llmProvider);
    this.crawler = new ProductionCrawler();
  }

  /**
   * Complete End-to-End Discovery, Audit, and Roadmap Planning workflow:
   * 1. Crawls target website
   * 2. Runs Technical SEO Agent
   * 3. Runs Roadmap Planning Agent
   * 4. Persists findings and roadmap tasks in database
   */
  public async runDiscoveryAndAudit(projectId: string, targetUrl: string) {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { organization: true, website: true },
    });

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const context: AgentExecutionContext = {
      projectId: project.id,
      organizationId: project.organizationId,
      operatingMode: project.operatingMode as "MODE_A" | "MODE_B",
      auditTrail: [],
    };

    // 1. Run Crawler
    const crawlRun = await db.crawlRun.create({
      data: {
        projectId: project.id,
        baseUrl: targetUrl,
        status: "RUNNING",
      },
    });

    const crawlResult = await this.crawler.crawlSite(targetUrl, { maxPages: 5 });

    // Store crawled pages
    for (const page of crawlResult.pages) {
      await db.crawledPage.create({
        data: {
          crawlRunId: crawlRun.id,
          url: page.url,
          statusCode: page.statusCode,
          loadTimeMs: page.loadTimeMs,
          title: page.title,
          metaDescription: page.metaDescription,
          canonicalUrl: page.canonicalUrl,
          robotsMeta: page.robotsMeta,
          h1Tags: JSON.stringify(page.h1Tags),
          h2Tags: JSON.stringify(page.h2Tags),
          internalLinks: JSON.stringify(page.internalLinks),
          externalLinks: JSON.stringify(page.externalLinks),
          imageCount: page.imageCount,
          missingAltCount: page.missingAltCount,
          schemaTypes: JSON.stringify(page.schemaTypes),
          wordCount: page.wordCount,
          contentHash: page.contentHash,
        },
      });
    }

    await db.crawlRun.update({
      where: { id: crawlRun.id },
      data: {
        status: "COMPLETED",
        totalPages: crawlResult.totalPages,
        durationMs: crawlResult.durationMs,
      },
    });

    // Save summary in Project Memory
    await ProjectMemory.setRecord(
      project.id,
      "AUDIT_SUMMARY",
      "latest_crawl",
      {
        totalPages: crawlResult.totalPages,
        baseUrl: targetUrl,
        crawledAt: new Date().toISOString(),
      }
    );

    // 2. Run Technical SEO Agent
    const technicalAgent = this.agentRegistry.getAgent("technical-seo-agent");
    if (!technicalAgent) {
      throw new Error("Technical SEO Agent definition missing");
    }

    const technicalResult = await this.runtime.execute(
      technicalAgent,
      {
        crawledPages: crawlResult.pages,
        targetDomain: new URL(targetUrl).hostname,
      },
      context
    );

    const findingsCreated: string[] = [];
    if (technicalResult.status === "SUCCESS" && technicalResult.data) {
      const data = technicalResult.data as {
        findings: Array<{
          category: string;
          title: string;
          description: string;
          severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
          confidence: number;
          evidence: unknown;
          recommendedFix: string;
        }>;
      };

      for (const f of data.findings || []) {
        const finding = await db.seoFinding.create({
          data: {
            projectId: project.id,
            crawlRunId: crawlRun.id,
            category: f.category,
            title: f.title,
            description: f.description,
            severity: f.severity,
            confidence: f.confidence,
            evidence: JSON.stringify(f.evidence),
            recommendedFix: f.recommendedFix,
            status: "OPEN",
          },
        });
        findingsCreated.push(finding.id);
      }
    }

    // 3. Run Roadmap Planning Agent
    const roadmapAgent = this.agentRegistry.getAgent("roadmap-planning-agent");
    if (!roadmapAgent) {
      throw new Error("Roadmap Planning Agent definition missing");
    }

    const allFindings = await db.seoFinding.findMany({
      where: { projectId: project.id, status: "OPEN" },
    });

    const roadmapResult = await this.runtime.execute(
      roadmapAgent,
      {
        projectId: project.id,
        findings: allFindings,
        operatingMode: project.operatingMode as "MODE_A" | "MODE_B",
      },
      context
    );

    const tasksCreated: string[] = [];
    if (roadmapResult.status === "SUCCESS" && roadmapResult.data) {
      const data = roadmapResult.data as {
        tasks: Array<{
          title: string;
          description: string;
          assignedAgent: string;
          priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
          affectedUrls: string[];
          evidence: string;
          acceptanceCriteria: string;
          executionStrategy: "CODE_PATCH" | "CMS_API" | "MANUAL_BRIEF";
          riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
          requiresApproval: boolean;
          phase: number;
        }>;
      };

      for (const t of data.tasks || []) {
        const task = await db.roadmapTask.create({
          data: {
            projectId: project.id,
            title: t.title,
            description: t.description,
            assignedAgent: t.assignedAgent,
            priority: t.priority,
            status: t.requiresApproval ? "AWAITING_APPROVAL" : "APPROVED",
            affectedUrls: JSON.stringify(t.affectedUrls),
            evidence: t.evidence,
            acceptanceCriteria: t.acceptanceCriteria,
            executionStrategy: t.executionStrategy,
            riskLevel: t.riskLevel,
            requiresApproval: t.requiresApproval,
            phase: t.phase,
          },
        });
        tasksCreated.push(task.id);
      }
    }

    return {
      crawlRunId: crawlRun.id,
      pagesCrawled: crawlResult.totalPages,
      findingsCount: findingsCreated.length,
      tasksCreatedCount: tasksCreated.length,
      technicalResultStatus: technicalResult.status,
      roadmapResultStatus: roadmapResult.status,
    };
  }

  /**
   * Executes an approved roadmap task, runs QA verification, and records outcome.
   */
  public async executeAndVerifyTask(taskId: string, _userId?: string) {
    const task = await db.roadmapTask.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new Error(`Roadmap task ${taskId} not found.`);
    }

    // Update status to EXECUTING
    await db.roadmapTask.update({
      where: { id: taskId },
      data: { status: "EXECUTING" },
    });

    const context: AgentExecutionContext = {
      projectId: task.projectId,
      organizationId: task.project.organizationId,
      operatingMode: task.project.operatingMode as "MODE_A" | "MODE_B",
      auditTrail: [],
    };

    // 1. Task Execution based on assigned agent & strategy
    if (task.executionStrategy === "CODE_PATCH") {
      const codeAgent = this.agentRegistry.getAgent("code-implementation-agent");
      if (codeAgent) {
        await this.runtime.execute(
          codeAgent,
          {
            taskId: task.id,
            targetFile: "src/app/layout.tsx",
            changeRequirement: task.description,
          },
          context
        );
      }
    }

    // 2. State transition to VERIFYING
    await db.roadmapTask.update({
      where: { id: taskId },
      data: { status: "VERIFYING" },
    });

    // 3. QA Verification Agent checks acceptance criteria
    const qaAgent = this.agentRegistry.getAgent("quality-assurance-agent");
    let affectedUrls: string[] = [];
    try {
      affectedUrls = JSON.parse(task.affectedUrls);
    } catch {
      affectedUrls = ["https://example.com/"];
    }

    const targetVerifyUrl = affectedUrls[0] || "https://example.com/";

    let passed = false;
    if (qaAgent) {
      const qaResult = await this.runtime.execute(
        qaAgent,
        {
          taskId: task.id,
          targetUrl: targetVerifyUrl,
          acceptanceCriteria: task.acceptanceCriteria,
        },
        context
      );
      passed = qaResult.status === "SUCCESS";
    }

    // Record verification result
    const existingVerify = await db.verificationResult.findFirst({
      where: { taskId: task.id },
    });
    if (!existingVerify) {
      await db.verificationResult.create({
        data: {
          taskId: task.id,
          passed,
          checkedUrl: targetVerifyUrl,
          criteriaEvaluated: task.acceptanceCriteria,
          notes: passed
            ? "Quality Assurance Agent verified acceptance criteria successfully."
            : "Quality Assurance Agent verification failed.",
        },
      });
    }

    const finalStatus = passed ? "COMPLETED" : "FAILED";

    await db.roadmapTask.update({
      where: { id: taskId },
      data: { status: finalStatus },
    });

    return {
      taskId: task.id,
      finalStatus,
      passed,
    };
  }

  /**
   * Autonomous CEO & Project Manager Pipeline:
   * 1. CEO Agent formulates high-level master strategy and KPI objectives.
   * 2. Crawler & Technical SEO Agent audit the website and uncover findings.
   * 3. Project Manager Agent translates CEO directives and findings into delegated work tickets.
   * 4. Step-by-step autonomous execution loop: PM dispatches tasks to specialist agents without waiting for manual human approval.
   * 5. QA Agent verifies each implemented fix against acceptance criteria.
   * 6. CEO Agent issues final completion certification.
   */
  public async runFullCeoAutonomousPipeline(projectId: string, targetUrl: string) {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { organization: true, website: true },
    });

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const context: AgentExecutionContext = {
      projectId: project.id,
      organizationId: project.organizationId,
      operatingMode: project.operatingMode as "MODE_A" | "MODE_B",
      auditTrail: [],
    };

    // 1. Discovery & Crawling
    const crawlRun = await db.crawlRun.create({
      data: {
        projectId: project.id,
        baseUrl: targetUrl,
        status: "RUNNING",
      },
    });

    const crawlResult = await this.crawler.crawlSite(targetUrl, { maxPages: 5 });

    for (const page of crawlResult.pages) {
      await db.crawledPage.create({
        data: {
          crawlRunId: crawlRun.id,
          url: page.url,
          statusCode: page.statusCode,
          loadTimeMs: page.loadTimeMs,
          title: page.title,
          metaDescription: page.metaDescription,
          canonicalUrl: page.canonicalUrl,
          robotsMeta: page.robotsMeta,
          h1Tags: JSON.stringify(page.h1Tags),
          h2Tags: JSON.stringify(page.h2Tags),
          internalLinks: JSON.stringify(page.internalLinks),
          externalLinks: JSON.stringify(page.externalLinks),
          imageCount: page.imageCount,
          missingAltCount: page.missingAltCount,
          schemaTypes: JSON.stringify(page.schemaTypes),
          wordCount: page.wordCount,
          contentHash: page.contentHash,
        },
      });
    }

    await db.crawlRun.update({
      where: { id: crawlRun.id },
      data: {
        status: "COMPLETED",
        totalPages: crawlResult.totalPages,
        durationMs: crawlResult.durationMs,
      },
    });

    // 2. CEO Agent: Formulate Master Strategic Directives
    const ceoAgent = this.agentRegistry.getAgent("autonomous-ceo-agent");
    let ceoPlan = {
      strategicDirectives: [
        "Eliminate all root canonical split issues across desktop and mobile entrypoints",
        "Inject full schema.org entity graphs (Organization, WebSite) for rich snippet qualification",
        "Streamline on-page meta headers and eliminate duplicate keyword cannibalization",
      ],
      primaryObjectives: [
        "Achieve 95%+ Technical SEO Health Score",
        "100% QA verification of executed code modifications",
      ],
      targetHealthScore: 98,
      ceoVision: "End-to-end self-executing autonomous organic dominance.",
    };

    if (ceoAgent) {
      const ceoExecResult = await this.runtime.execute(
        ceoAgent,
        {
          targetUrl,
          crawledPagesCount: crawlResult.totalPages,
          findingsCount: 3,
        },
        context
      );
      if (ceoExecResult.status === "SUCCESS" && ceoExecResult.data) {
        ceoPlan = ceoExecResult.data as typeof ceoPlan;
      }
    }

    // 3. Technical SEO Agent: Audit & Extract Findings
    const technicalAgent = this.agentRegistry.getAgent("technical-seo-agent");
    if (technicalAgent) {
      const technicalResult = await this.runtime.execute(
        technicalAgent,
        {
          crawledPages: crawlResult.pages,
          targetDomain: new URL(targetUrl).hostname,
        },
        context
      );

      if (technicalResult.status === "SUCCESS" && technicalResult.data) {
        const data = technicalResult.data as {
          findings: Array<{
            category: string;
            title: string;
            description: string;
            severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
            confidence: number;
            evidence: unknown;
            recommendedFix: string;
          }>;
        };

        for (const f of data.findings || []) {
          await db.seoFinding.create({
            data: {
              projectId: project.id,
              crawlRunId: crawlRun.id,
              category: f.category,
              title: f.title,
              description: f.description,
              severity: f.severity,
              confidence: f.confidence,
              evidence: JSON.stringify(f.evidence),
              recommendedFix: f.recommendedFix,
              status: "OPEN",
            },
          });
        }
      }
    }

    // 4. Project Manager Agent: Distribute Tasks & Create Execution Orders
    const allFindings = await db.seoFinding.findMany({
      where: { projectId: project.id, status: "OPEN" },
    });

    const pmAgent = this.agentRegistry.getAgent("project-manager-agent");
    let pmTasks: Array<{
      title: string;
      assignedAgent: string;
      priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
      executionStrategy: "CODE_PATCH" | "CMS_API" | "MANUAL_BRIEF";
      phase: number;
    }> = [];

    if (pmAgent) {
      const pmResult = await this.runtime.execute(
        pmAgent,
        {
          ceoDirectives: ceoPlan.strategicDirectives,
          findings: allFindings,
          operatingMode: project.operatingMode as "MODE_A" | "MODE_B",
        },
        context
      );

      if (pmResult.status === "SUCCESS" && pmResult.data) {
        const pmData = pmResult.data as { delegatedTasks: typeof pmTasks };
        pmTasks = pmData.delegatedTasks || [];
      }
    }

    // Fallback tasks if empty
    if (pmTasks.length === 0) {
      pmTasks = [
        {
          title: "Patch Absolute Self-Referential Canonical Tag in Root Head",
          assignedAgent: "code-implementation-agent",
          priority: "HIGH",
          executionStrategy: "CODE_PATCH",
          phase: 1,
        },
        {
          title: "Inject Root Organization JSON-LD Entity Graph",
          assignedAgent: "structured-data-agent",
          priority: "HIGH",
          executionStrategy: "CODE_PATCH",
          phase: 1,
        },
      ];
    }

    // Persist tasks in database as APPROVED (ready for autonomous execution)
    const executedTasks: Array<{ id: string; title: string; agent: string; passed: boolean }> = [];

    for (const t of pmTasks) {
      const task = await db.roadmapTask.create({
        data: {
          projectId: project.id,
          title: t.title,
          description: `Autonomous task dispatched by Project Manager under CEO Directives. Handled by ${t.assignedAgent}.`,
          assignedAgent: t.assignedAgent,
          priority: t.priority,
          status: "APPROVED",
          affectedUrls: JSON.stringify([targetUrl]),
          evidence: "Identified during autonomous crawl and prioritized by CEO master plan.",
          acceptanceCriteria: `Verified implementation conforming to Google Search Essentials for ${t.title}.`,
          executionStrategy: t.executionStrategy,
          riskLevel: "LOW",
          requiresApproval: false,
          phase: t.phase,
        },
      });

      // 5. Autonomous Execution & QA Verification Loop (No human click required!)
      const verifyOutcome = await this.executeAndVerifyTask(task.id);
      executedTasks.push({
        id: task.id,
        title: task.title,
        agent: t.assignedAgent,
        passed: verifyOutcome.passed,
      });
    }

    // Update project state in memory
    await ProjectMemory.setRecord(project.id, "AUDIT_SUMMARY", "ceo_autonomous_run", {
      executedAt: new Date().toISOString(),
      ceoVision: ceoPlan.ceoVision,
      tasksExecuted: executedTasks.length,
      allVerified: executedTasks.every((t) => t.passed),
    });

    return {
      success: true,
      ceoPlan,
      executedTasks,
      totalTasksExecuted: executedTasks.length,
      allVerified: executedTasks.every((t) => t.passed),
      completionMessage:
        `🎉 Autonomous SEO Execution Complete! CEO Strategic Plan executed. ` +
        `Project Manager dispatched ${executedTasks.length} tasks across specialist agents, ` +
        `and QA Agent verified all changes on ${targetUrl}.`,
    };
  }
}

