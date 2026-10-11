import { NextResponse } from "next/server";
import { AgentOrchestrator } from "@/lib/agent-framework/orchestrator";
import { db } from "@/lib/db";
import { LifecycleStateMachine } from "@/lib/lifecycle/state-machine";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const task = await db.roadmapTask.findUnique({
      where: { id: params.taskId },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Verify task is in an approved or executable state
    if (task.status !== "APPROVED" && task.status !== "QUEUED") {
      LifecycleStateMachine.assertValidTransition(
        task.status as any,
        "EXECUTING"
      );
    }

    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.executeAndVerifyTask(params.taskId);

    return NextResponse.json({
      success: true,
      result,
      message: `Task execution finished with status: ${result.finalStatus}`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
