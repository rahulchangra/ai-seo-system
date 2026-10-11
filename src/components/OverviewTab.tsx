"use client";

import {
  FileText,
  AlertTriangle,
  ListTodo,
  CheckCircle2,
  GitBranch,
  Server,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface OverviewTabProps {
  project: any;
  onNavigateTab: (tab: string) => void;
  onTriggerAudit: () => void;
  isAuditing: boolean;
}

export function OverviewTab({
  project,
  onNavigateTab,
  onTriggerAudit,
  isAuditing,
}: OverviewTabProps) {
  if (!project) return null;

  const totalPages = project.crawls?.[0]?.pages?.length || 0;
  const totalFindings = project.findings?.length || 0;
  const criticalFindings =
    project.findings?.filter((f: any) => f.severity === "CRITICAL" || f.severity === "HIGH")
      .length || 0;
  const totalTasks = project.roadmapTasks?.length || 0;
  const completedTasks =
    project.roadmapTasks?.filter((t: any) => t.status === "COMPLETED").length || 0;
  const pendingApprovals =
    project.roadmapTasks?.filter((t: any) => t.status === "AWAITING_APPROVAL")
      .length || 0;

  return (
    <div className="space-y-6">
      {/* Mode Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-indigo-950/20 p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
            {project.operatingMode === "MODE_A" ? (
              <GitBranch className="h-6 w-6 text-cyan-400" />
            ) : (
              <Server className="h-6 w-6 text-indigo-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                {project.website?.url || "Target Website"}
              </h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                {project.operatingMode === "MODE_A"
                  ? "Mode A: Source Code (GitHub)"
                  : "Mode B: CMS & Public Crawling"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Market: {project.targetCountry || "US"} ({project.targetLanguage || "en"}) • Organization:{" "}
              {project.organization?.name || "Default Workspace"}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-2">
          <button
            onClick={onTriggerAudit}
            disabled={isAuditing}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
          >
            {isAuditing ? "Agents Processing..." : "Re-run Full Audit"}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pages Crawled</span>
            <FileText className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalPages}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Latest run duration: {project.crawls?.[0]?.durationMs || 0}ms</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Issues Detected</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalFindings}</div>
          <div className="mt-1 text-[11px] text-amber-400/90 font-medium">
            {criticalFindings} High/Critical priority
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Roadmap Tasks</span>
            <ListTodo className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalTasks}</div>
          <div className="mt-1 text-[11px] text-cyan-400/90 font-medium">
            {pendingApprovals} awaiting your approval
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Verified Changes</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{completedTasks}</div>
          <div className="mt-1 text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Passed QA post-execution</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Roadmap preview + Agent Execution Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Roadmap Tasks */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-indigo-400" />
              Priority Action Items
            </h3>
            <button
              onClick={() => onNavigateTab("roadmap")}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View Full Roadmap
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {project.roadmapTasks && project.roadmapTasks.length > 0 ? (
              project.roadmapTasks.slice(0, 4).map((task: any) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          task.priority === "HIGH" || task.priority === "CRITICAL"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs font-medium text-white">{task.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No roadmap tasks yet. Run an audit to generate tasks.
              </div>
            )}
          </div>
        </div>

        {/* Right: Agent Run History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Specialist Agent Runs
            </h3>
            <button
              onClick={() => onNavigateTab("agents")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Control Center
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {project.agentRuns && project.agentRuns.length > 0 ? (
              project.agentRuns.slice(0, 4).map((run: any) => (
                <div
                  key={run.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {run.agentId}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          run.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : run.status === "RUNNING"
                            ? "bg-indigo-500/10 text-indigo-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Tokens: {run.tokensUsed} • Cost: ${run.executionCost.toFixed(4)} •
                      Duration: {run.durationMs}ms
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(run.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent agent executions. Trigger an audit to activate agents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
