import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AgentOrchestrator } from "@/lib/agent-framework/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: { website: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // Determine target URL with auto-heal fallback
    let targetUrl = body?.url || project.website?.url;

    if (!targetUrl) {
      const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const domain = sanitizedName ? `${sanitizedName}.com` : "example.com";
      targetUrl = `https://${domain}`;
    }

    // Ensure website record is persisted in DB
    if (!project.website) {
      const domain = new URL(targetUrl).hostname;
      const createdWebsite = await db.website.create({
        data: {
          projectId: project.id,
          url: targetUrl,
          domain,
        },
      });
      project.website = createdWebsite;
    } else if (body?.url && body.url !== project.website.url) {
      const domain = new URL(body.url).hostname;
      const updatedWebsite = await db.website.update({
        where: { id: project.website.id },
        data: { url: body.url, domain },
      });
      project.website = updatedWebsite;
    }

    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.runFullCeoAutonomousPipeline(
      project.id,
      targetUrl
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Autonomous CEO Pipeline execution failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute CEO autonomous pipeline" },
      { status: 500 }
    );
  }
}
