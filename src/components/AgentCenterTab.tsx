"use client";

import { useEffect, useState } from "react";
import { Bot, Wrench, Shield, Zap, Terminal, CheckCircle2, Clock } from "lucide-react";

interface AgentCenterTabProps {
  project: any;
}

export function AgentCenterTab({ project }: AgentCenterTabProps) {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch("/api/agents");
        const data = await res.json();
        if (data.success) {
          setAgents(data.agents);
        }
      } catch (err) {
        console.error("Failed to load agents", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  const agentRuns = project.agentRuns || [];

  return (
    <div className="space-y-8">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            Specialized Agent Control Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            17 autonomous agents operating under strict bounded execution loops, permission gating, and verified tools.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span>Active Agents: 17</span>
        </div>
      </div>

      {/* Grid of all 17 Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const runsForAgent = agentRuns.filter((r: any) => r.agentId === agent.id);
          const lastRun = runsForAgent[0];

          return (
            <div
              key={agent.id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{agent.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {agent.id}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      agent.riskLevel === "READ_ONLY"
                        ? "bg-slate-800 text-slate-300"
                        : agent.riskLevel === "LOW"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {agent.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {agent.purpose}
                </p>

                {/* Permitted Tools */}
                <div>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mb-1">
                    <Wrench className="h-3 w-3 text-cyan-400" />
                    Authorized Tools:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.allowedTools.length > 0 ? (
                      agent.allowedTools.map((t: string) => (
                        <span
                          key={t}
                          className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        Pure reasoning (no direct tools)
                      </span>
                    )}
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-400 border-t border-slate-800/60">
                  <div>
                    Max Loop:{" "}
                    <strong className="text-slate-300">
                      {agent.executionLimits?.maxIterations} iters
                    </strong>
                  </div>
                  <div>
                    Timeout:{" "}
                    <strong className="text-slate-300">
                      {agent.executionLimits?.timeoutMs / 1000}s
                    </strong>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                {lastRun ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Ran {new Date(lastRun.createdAt).toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <span className="text-slate-500">Standby (awaiting trigger)</span>
                )}
                <span className="text-slate-500">
                  {runsForAgent.length} executions
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity Terminal */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-semibold text-white">
              Agent Execution Stream & Tool Logs
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {agentRuns.length} total events recorded
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs text-slate-300">
          {agentRuns.length > 0 ? (
            agentRuns.map((run: any) => (
              <div
                key={run.id}
                className="rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/60 flex flex-col gap-1 text-[11px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">[{run.status}]</span>
                    <span className="text-indigo-300 font-semibold">{run.agentId}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(run.createdAt).toISOString()}
                  </span>
                </div>
                {run.outputSummary && (
                  <div className="text-slate-400 text-[10px] line-clamp-1">
                    Output: {run.outputSummary}
                  </div>
                )}
                <div className="text-[10px] text-slate-500">
                  Tokens: {run.tokensUsed} • Cost: ${run.executionCost.toFixed(4)} • Duration:{" "}
                  {run.durationMs}ms
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-xs py-4">
              [SYSTEM] No agent activity logs recorded yet. Run an audit to start logging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
