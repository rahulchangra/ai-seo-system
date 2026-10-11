import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  operatingMode: z.enum(["MODE_A", "MODE_B"]).default("MODE_B"),
  repoUrl: z.string().url().optional(),
  repoBranch: z.string().default("main"),
  targetCountry: z.string().default("US"),
  targetLanguage: z.string().default("en"),
});

export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        website: true,
        crawls: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        findings: true,
        roadmapTasks: true,
        agentRuns: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, projects });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createProjectSchema.parse(body);

    // Ensure default organization exists
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "Default Workspace",
          slug: "default-workspace",
        },
      });
    }

    const domain = new URL(validated.url).hostname;

    const project = await db.project.create({
      data: {
        name: validated.name,
        operatingMode: validated.operatingMode,
        targetCountry: validated.targetCountry,
        targetLanguage: validated.targetLanguage,
        organizationId: org.id,
        website: {
          create: {
            url: validated.url,
            domain,
            repoUrl: validated.repoUrl,
            repoBranch: validated.repoBranch,
          },
        },
      },
      include: {
        website: true,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
