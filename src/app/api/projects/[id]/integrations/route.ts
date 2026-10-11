import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const saveIntegrationSchema = z.object({
  provider: z.enum(["GITHUB", "WORDPRESS", "GSC", "GA4", "SHOPIFY"]),
  credentials: z.record(z.any()),
  capabilities: z.array(z.string()).default([]),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const integrations = await db.integrationConfig.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, integrations });
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
      include: { organization: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { provider, credentials, capabilities } = saveIntegrationSchema.parse(body);

    // Save or update integration config
    const existing = await db.integrationConfig.findFirst({
      where: { projectId: project.id, provider },
    });

    const integration = existing
      ? await db.integrationConfig.update({
          where: { id: existing.id },
          data: {
            encryptedCreds: JSON.stringify(credentials),
            capabilities: JSON.stringify(capabilities),
            isConnected: true,
            lastSyncAt: new Date(),
          },
        })
      : await db.integrationConfig.create({
          data: {
            projectId: project.id,
            provider,
            encryptedCreds: JSON.stringify(credentials),
            capabilities: JSON.stringify(capabilities),
            isConnected: true,
            lastSyncAt: new Date(),
          },
        });

    // Log Activity
    await db.auditLog.create({
      data: {
        organizationId: project.organizationId,
        projectId: project.id,
        actorType: "USER",
        actorId: "admin",
        action: "INTEGRATION_CONNECTED",
        targetResource: `${provider} Connector`,
      },
    });

    return NextResponse.json({ success: true, integration });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
