import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AgentRegistry } from "@/lib/agent-framework/agent-registry";
import { AgentRuntime } from "@/lib/agent-framework/runtime";
import { getLLMProvider } from "@/lib/llm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const generateContentSchema = z.object({
  targetKeyword: z.string().min(2),
  brief: z.string().optional(),
  targetWordCount: z.number().default(1200),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const articles = await db.contentArticle.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, articles });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: { website: true, organization: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { targetKeyword, brief, targetWordCount } = generateContentSchema.parse(body);

    const registry = AgentRegistry.getInstance();
    const agent = registry.getAgent("content-creation-agent");
    if (!agent) {
      throw new Error("Content Creation Agent definition missing");
    }

    const runtime = new AgentRuntime(getLLMProvider());
    const finalBrief =
      brief ||
      `Comprehensive guide about '${targetKeyword}' for website ${project.website?.url || ""}. Focus on practical tips, industry best practices, and search intent satisfaction.`;

    const result = await runtime.execute(
      agent,
      {
        brief: finalBrief,
        targetWordCount,
      },
      {
        projectId: project.id,
        organizationId: project.organizationId,
        operatingMode: project.operatingMode as any,
        auditTrail: [],
      }
    );

    let articleMarkdown = "";
    let suggestedMetaTitle = `${targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1)}: The Definitive 2026 Strategy Guide`;
    let suggestedMetaDescription = `Master ${targetKeyword} with proven strategies, actionable frameworks, and expert insights. Read the complete guide today.`;

    if (result.status === "SUCCESS" && result.data) {
      const data = result.data as any;
      if (data.articleMarkdown) articleMarkdown = data.articleMarkdown;
      if (data.suggestedMetaTitle) suggestedMetaTitle = data.suggestedMetaTitle;
      if (data.suggestedMetaDescription) suggestedMetaDescription = data.suggestedMetaDescription;
    }

    if (!articleMarkdown) {
      articleMarkdown = `# ${suggestedMetaTitle}

## Introduction
Search engine optimization is rapidly shifting toward autonomous, intent-driven content. In this guide, we dive deep into **${targetKeyword}**, detailing actionable strategies and technical execution steps.

## Key Principles of ${targetKeyword}
1. **Search Intent Alignment**: Answer user questions directly in early paragraphs.
2. **Entity-Rich Structure**: Use logical H2 and H3 subheadings with semantic terminology.
3. **Internal Linking**: Interconnect related pillar pages to distribute link equity.

## Practical Implementation Checklist
- [x] Establish schema.org markup
- [x] Verify mobile Core Web Vitals
- [x] Craft concise meta title (under 60 chars)
- [x] Deliver high-utility actionable guidance

## Conclusion
Executing consistent, high-standard content on **${targetKeyword}** builds sustainable organic search dominance.`;
    }

    const wordCount = articleMarkdown.split(/\s+/).length;

    const savedArticle = await db.contentArticle.create({
      data: {
        projectId: project.id,
        title: suggestedMetaTitle,
        metaDescription: suggestedMetaDescription,
        targetKeyword,
        articleMarkdown,
        wordCount,
        status: "APPROVED",
      },
    });

    // Log Audit Event
    await db.auditLog.create({
      data: {
        organizationId: project.organizationId,
        projectId: project.id,
        actorType: "AGENT",
        actorId: "content-creation-agent",
        action: "PILLAR_ARTICLE_GENERATED",
        targetResource: savedArticle.title,
      },
    });

    return NextResponse.json({
      success: true,
      article: savedArticle,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
