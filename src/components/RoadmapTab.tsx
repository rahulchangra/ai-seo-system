"use client";

import { useState } from "react";
import {
  ListTodo,
  CheckCircle,
  Play,
  ShieldCheck,
  GitPullRequest,
  Check,
  Loader2,
  FileCode,
  AlertCircle,
  ExternalLink,
  Crown,
  Zap,
} from "lucide-react";

interface RoadmapTabProps {
  project: any;
  onRefreshProject: () => void;
  onOpenAutopilot?: () => void;
}

export function RoadmapTab({ project, onRefreshProject, onOpenAutopilot }: RoadmapTabProps) {
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [activeTaskDetail, setActiveTaskDetail] = useState<any | null>(null);
  const [isExecutingAll, setIsExecutingAll] = useState(false);

  const tasks = project.roadmapTasks || [];

  const handleApprove = async (taskId: string) => {
    setProcessingTaskId(taskId);
    try {
      const res = await fetch(`/api/projects/${project.id}/tasks/${taskId}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to approve task");
      } else {
        onRefreshProject();
      }
    } finally {
      setProcessingTaskId(null);
    }
  };

  const handleExecute = async (taskId: string) => {
    setProcessingTaskId(taskId);
    try {
      const res = await fetch(`/api/projects/${project.id}/tasks/${taskId}/execute`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to execute task");
      } else {
        onRefreshProject();
      }
    } finally {
      setProcessingTaskId(null);
    }
  };

  const handleExecuteAll = async () => {
    setIsExecutingAll(true);
    try {
      const pendingTasks = tasks.filter((t: any) => t.status !== "COMPLETED");
      for (const t of pendingTasks) {
        if (t.status === "AWAITING_APPROVAL") {
          await fetch(`/api/projects/${project.id}/tasks/${t.id}/approve`, { method: "POST" });
        }
        await fetch(`/api/projects/${project.id}/tasks/${t.id}/execute`, { method: "POST" });
      }
      onRefreshProject();
    } catch (e: any) {
      alert("Error executing tasks: " + e.message);
    } finally {
      setIsExecutingAll(false);
    }
  };

  // Group by Phase
  const phases = Array.from(new Set(tasks.map((t: any) => t.phase || 1))).sort() as number[];

  return (
    <div className="space-y-6">
      {/* CEO & PM Autonomous Hierarchy Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-indigo-950/30 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Crown className="h-6 w-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Autonomous CEO & Project Manager Mode
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Fully Self-Executing
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                CEO Agent creates strategic plan $\rightarrow$ Project Manager Agent delegates to specialist agents $\rightarrow$ QA verifies live. Zero manual click-by-click intervention needed.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenAutopilot && (
              <button
                onClick={onOpenAutopilot}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                Launch CEO Autopilot
              </button>
            )}

            {tasks.some((t: any) => t.status !== "COMPLETED") && (
              <button
                onClick={handleExecuteAll}
                disabled={isExecutingAll}
                className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-4 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-900/60 disabled:opacity-50 transition-all"
              >
                {isExecutingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    Executing All...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-emerald-400" />
                    Auto-Execute & Verify All Tasks
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-indigo-400" />
            Autonomous Execution Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phase-prioritized, dependency-checked action items generated by Roadmap Planning Agent.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{tasks.length} total tasks</span>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-6">
          {phases.map((phaseNum) => {
            const phaseTasks = tasks.filter((t: any) => (t.phase || 1) === phaseNum);

            return (
              <div
                key={phaseNum}
                className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400 border border-indigo-500/30">
                      {phaseNum}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      Phase {phaseNum}: Core Foundation & High-Impact Fixes
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {phaseTasks.length} tasks
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {phaseTasks.map((task: any) => {
                    const isProcessing = processingTaskId === task.id;
                    const isCompleted = task.status === "COMPLETED";
                    const isAwaiting = task.status === "AWAITING_APPROVAL";
                    const isApproved = task.status === "APPROVED";

                    return (
                      <div
                        key={task.id}
                        className={`rounded-xl border p-4 transition-all ${
                          isCompleted
                            ? "border-emerald-900/40 bg-emerald-950/10"
                            : isAwaiting
                            ? "border-amber-900/40 bg-amber-950/10"
                            : "border-slate-800 bg-slate-900/60"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  task.priority === "HIGH" || task.priority === "CRITICAL"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {task.priority}
                              </span>
                              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                                {task.assignedAgent}
                              </span>
                              <span className="rounded bg-indigo-950/50 border border-indigo-800/40 px-2 py-0.5 text-[10px] text-indigo-300">
                                {task.executionStrategy}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  isCompleted
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : isAwaiting
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>

                            <h4 className="text-sm font-semibold text-white">
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-400">{task.description}</p>

                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                              <ShieldCheck className="h-3 w-3 text-cyan-400" />
                              <span>Criteria: {task.acceptanceCriteria}</span>
                            </div>
                          </div>

                          {/* Action Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setActiveTaskDetail(task)}
                              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                            >
                              Inspect Details
                            </button>

                            {isAwaiting && (
                              <button
                                onClick={() => handleApprove(task.id)}
                                disabled={isProcessing}
                                className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-amber-500 disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                                Approve
                              </button>
                            )}

                            {(isApproved || task.status === "ROADMAP_GENERATED") && (
                              <button
                                onClick={() => handleExecute(task.id)}
                                disabled={isProcessing}
                                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                                Execute & Verify
                              </button>
                            )}

                            {isCompleted && (
                              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/40 rounded-lg border border-emerald-800/30">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center text-xs text-slate-500">
          No roadmap generated yet. Trigger an SEO Audit to build your evidence-based roadmap.
        </div>
      )}

      {/* Task Details Drawer Modal */}
      {activeTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-400">
                  {activeTaskDetail.assignedAgent}
                </span>
                <h3 className="text-base font-semibold text-white">
                  {activeTaskDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-300">Description:</span>
                <p className="text-slate-400 mt-0.5">{activeTaskDetail.description}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-300">Acceptance Criteria:</span>
                <p className="text-cyan-300 mt-0.5 bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-900/30">
                  {activeTaskDetail.acceptanceCriteria}
                </p>
              </div>

              {/* Code Changes Preview */}
              {activeTaskDetail.codeChanges && activeTaskDetail.codeChanges.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                    Generated Code Patch (Isolated Branch):
                  </span>
                  <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto">
                    {activeTaskDetail.codeChanges[0].diffSnippet}
                  </pre>
                </div>
              )}

              {/* Verification Results */}
              {activeTaskDetail.verificationResults &&
                activeTaskDetail.verificationResults.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Post-Execution Verification Evidence:
                    </span>
                    <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg space-y-1 text-emerald-300">
                      <div>
                        Status:{" "}
                        <strong className="text-emerald-400">
                          {activeTaskDetail.verificationResults[0].passed ? "PASSED" : "FAILED"}
                        </strong>
                      </div>
                      <div>URL Checked: {activeTaskDetail.verificationResults[0].checkedUrl}</div>
                      <div>Notes: {activeTaskDetail.verificationResults[0].notes}</div>
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
