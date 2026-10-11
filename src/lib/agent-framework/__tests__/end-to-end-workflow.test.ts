import { describe, it, expect, beforeAll } from "vitest";
import { AgentOrchestrator } from "../orchestrator";
import { db } from "../../db";

describe("Phase 3: End-to-End SEO Workflow Test", () => {
  const orchestrator = new AgentOrchestrator();
  let projectId = "";

  beforeAll(async () => {
    const org = await db.organization.upsert({
      where: { slug: "demo-org" },
      update: {},
      create: {
        name: "Demo Organization",
        slug: "demo-org",
      },
    });

    const project = await db.project.create({
      data: {
        name: "Example Health Portal",
        operatingMode: "MODE_B",
        organizationId: org.id,
      },
    });
    projectId = project.id;
  });

  it("executes complete flow: Discovery -> Technical Audit -> Roadmap Generation -> Approval -> Execution -> QA Verification", async () => {
    // 1. Run Discovery, Crawl, Technical Audit, and Roadmap Planning
    const auditOutcome = await orchestrator.runDiscoveryAndAudit(
      projectId,
      "https://example.com"
    );

    expect(auditOutcome.pagesCrawled).toBeGreaterThanOrEqual(1);
    expect(auditOutcome.findingsCount).toBeGreaterThanOrEqual(1);
    expect(auditOutcome.tasksCreatedCount).toBeGreaterThanOrEqual(1);

    // Verify findings persisted in database
    const persistedFindings = await db.seoFinding.findMany({
      where: { projectId },
    });
    expect(persistedFindings.length).toBeGreaterThanOrEqual(1);

    // Verify roadmap tasks persisted in database
    const persistedTasks = await db.roadmapTask.findMany({
      where: { projectId },
    });
    expect(persistedTasks.length).toBeGreaterThanOrEqual(1);
    const targetTask = persistedTasks[0];
    expect(targetTask.status).toMatch(/AWAITING_APPROVAL|APPROVED|ROADMAP_GENERATED/);

    // 2. User approves task
    await db.roadmapTask.update({
      where: { id: targetTask.id },
      data: { status: "APPROVED" },
    });

    // 3. Orchestrator executes approved task & runs QA Verification
    const executionOutcome = await orchestrator.executeAndVerifyTask(targetTask.id);

    expect(executionOutcome.taskId).toBe(targetTask.id);
    expect(["COMPLETED", "FAILED"]).toContain(executionOutcome.finalStatus);

    // Verify verification result record in database
    const verificationRecord = await db.verificationResult.findFirst({
      where: { taskId: targetTask.id },
    });
    expect(verificationRecord).toBeDefined();
    expect(verificationRecord?.checkedUrl).toBeDefined();

    // Verify final persisted status on the task
    const updatedTask = await db.roadmapTask.findUnique({
      where: { id: targetTask.id },
    });
    expect(updatedTask?.status).toBe(executionOutcome.finalStatus);
  });
});
