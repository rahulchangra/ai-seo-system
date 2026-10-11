import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: {
        website: true,
        crawls: {
          orderBy: { createdAt: "desc" },
          include: {
            pages: {
              take: 20,
              orderBy: { createdAt: "desc" },
            },
          },
        },
        findings: {
          orderBy: { createdAt: "desc" },
        },
        roadmapTasks: {
          orderBy: [{ phase: "asc" }, { createdAt: "desc" }],
          include: {
            approvals: true,
            codeChanges: true,
            verificationResults: true,
          },
        },
        agentRuns: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            toolExecutions: true,
          },
        },
        memoryRecords: true,
        integrations: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
