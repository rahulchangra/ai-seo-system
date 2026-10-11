import { db } from "../db";

export class ProjectMemory {
  /**
   * Saves or updates a scoped memory record ensuring tenant isolation.
   */
  public static async setRecord(
    projectId: string,
    category:
      | "TECH_STACK"
      | "BRAND_VOICE"
      | "COMPETITORS"
      | "KEYWORDS"
      | "USER_PREFERENCE"
      | "AUDIT_SUMMARY",
    key: string,
    value: unknown,
    confidence = 1.0
  ): Promise<void> {
    const valueString =
      typeof value === "string" ? value : JSON.stringify(value);

    const existing = await db.projectMemoryRecord.findFirst({
      where: {
        projectId,
        category,
        key,
      },
    });

    if (existing) {
      await db.projectMemoryRecord.update({
        where: { id: existing.id },
        data: {
          value: valueString,
          confidence,
        },
      });
    } else {
      await db.projectMemoryRecord.create({
        data: {
          projectId,
          category,
          key,
          value: valueString,
          confidence,
        },
      });
    }
  }

  /**
   * Retrieves memory records filtered by category and key.
   */
  public static async getRecord<T = unknown>(
    projectId: string,
    category: string,
    key: string
  ): Promise<T | null> {
    const record = await db.projectMemoryRecord.findFirst({
      where: {
        projectId,
        category,
        key,
      },
    });

    if (!record) return null;

    try {
      return JSON.parse(record.value) as T;
    } catch {
      return record.value as unknown as T;
    }
  }

  /**
   * Retrieves relevant memory records for agent context injection.
   */
  public static async getContextForAgent(
    projectId: string,
    agentCategory: string
  ): Promise<Record<string, unknown>> {
    const records = await db.projectMemoryRecord.findMany({
      where: {
        projectId,
      },
      take: 20,
      orderBy: { updatedAt: "desc" },
    });

    const memoryMap: Record<string, unknown> = {};
    for (const r of records) {
      try {
        memoryMap[`${r.category}:${r.key}`] = JSON.parse(r.value);
      } catch {
        memoryMap[`${r.category}:${r.key}`] = r.value;
      }
    }

    return memoryMap;
  }
}
