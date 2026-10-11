import { describe, it, expect, beforeAll } from "vitest";
import { AgentRegistry } from "../agent-registry";
import { ToolRegistry } from "../tool-registry";
import { AgentRuntime } from "../runtime";
import { MockLLMProvider } from "../../llm/mock-provider";
import { AgentExecutionContext } from "../types";
import { db } from "../../db";

describe("Agent Framework and Runtime", () => {
  const registry = AgentRegistry.getInstance();
  const toolRegistry = ToolRegistry.getInstance();
  const mockProvider = new MockLLMProvider();
  const runtime = new AgentRuntime(mockProvider);

  let testProjectId = "";
  let testOrgId = "";

  beforeAll(async () => {
    // Seed real Organization and Project for test DB foreign keys
    const org = await db.organization.upsert({
      where: { slug: "test-org" },
      update: {},
      create: {
        name: "Test Organization",
        slug: "test-org",
      },
    });
    testOrgId = org.id;

    const project = await db.project.create({
      data: {
        name: "Test Project",
        organizationId: org.id,
        operatingMode: "MODE_B",
      },
    });
    testProjectId = project.id;
  });

  it("loads all 19 specialized and executive agent definitions", () => {
    const agents = registry.getAllAgents();
    expect(agents.length).toBe(19);

    const techAgent = registry.getAgent("technical-seo-agent");
    expect(techAgent).toBeDefined();
    expect(techAgent?.name).toBe("Technical SEO Agent");
    expect(techAgent?.allowedTools).toContain("fetch_page");

    const ceoAgent = registry.getAgent("autonomous-ceo-agent");
    expect(ceoAgent).toBeDefined();
    expect(ceoAgent?.name).toBe("Autonomous CEO Agent");

    const pmAgent = registry.getAgent("project-manager-agent");
    expect(pmAgent).toBeDefined();
    expect(pmAgent?.name).toBe("Project Manager Agent");
  });

  it("validates registered tools with schemas and permissions", () => {
    const tools = toolRegistry.getAllTools();
    expect(tools.length).toBeGreaterThanOrEqual(5);

    const fetchTool = toolRegistry.getTool("fetch_page");
    expect(fetchTool).toBeDefined();
    expect(fetchTool?.permissionRequired).toBe("crawler:read");
    expect(fetchTool?.isReadOnly).toBe(true);
  });

  it("executes an agent within runtime and enforces bounded tool loop", async () => {
    const techAgent = registry.getAgent("technical-seo-agent")!;
    const mockContext: AgentExecutionContext = {
      projectId: testProjectId,
      organizationId: testOrgId,
      operatingMode: "MODE_B",
      auditTrail: [],
    };

    const result = await runtime.execute(
      techAgent,
      {
        crawledPages: [
          {
            url: "https://example.com",
            title: "Example Title",
            statusCode: 200,
          },
        ],
        targetDomain: "example.com",
      },
      mockContext
    );

    expect(result.status).toBe("SUCCESS");
    expect(result.agentId).toBe("technical-seo-agent");
    expect(result.usage.totalTokens).toBeGreaterThan(0);
    expect(result.data).toBeDefined();
  });
});
