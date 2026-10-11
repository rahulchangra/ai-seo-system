import { NextResponse } from "next/server";
import { AgentRegistry } from "@/lib/agent-framework/agent-registry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const registry = AgentRegistry.getInstance();
    const agents = registry.getAllAgents().map((a) => ({
      id: a.id,
      name: a.name,
      purpose: a.purpose,
      allowedTools: a.allowedTools,
      riskLevel: a.riskLevel,
      modelConfig: a.modelConfig,
      executionLimits: a.executionLimits,
      requiresApproval: a.requiresApprovalForActions,
    }));

    return NextResponse.json({ success: true, count: agents.length, agents });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
