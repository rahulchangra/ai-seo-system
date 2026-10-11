import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AgentOrchestrator } from "@/lib/agent-framework/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: { website: true },
    });

    if (!project || !project.website) {
      return NextResponse.json(
        { success: false, error: "Project or website not found" },
        { status: 404 }
      );
    }

    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.runDiscoveryAndAudit(
      project.id,
      project.website.url
    );

    return NextResponse.json({
      success: true,
      result,
      message: "Discovery, Technical Audit, and Roadmap Planning completed.",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
