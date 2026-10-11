import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LifecycleStateMachine } from "@/lib/lifecycle/state-machine";

export async function POST(
  req: Request,
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

    // Validate state transition
    LifecycleStateMachine.assertValidTransition(
      task.status as any,
      "APPROVED"
    );

    const updated = await db.roadmapTask.update({
      where: { id: params.taskId },
      data: { status: "APPROVED" },
    });

    // Record approval record
    await db.taskApproval.create({
      data: {
        taskId: params.taskId,
        status: "APPROVED",
        note: "Approved by user via Agent Control Center",
      },
    });

    return NextResponse.json({ success: true, task: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
