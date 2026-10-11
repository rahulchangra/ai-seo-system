"use client";

import { useState, useEffect } from "react";
import { History, Shield, RefreshCw, Bot, User, Cpu } from "lucide-react";

interface ActivityLogTabProps {
  project: any;
}

export function ActivityLogTab({ project }: ActivityLogTabProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/activity`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?.id) fetchLogs();
  }, [project?.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            Security Audit Trail & Activity Log
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of all user approvals, agent dispatches, code stage operations, and verification checks.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg">
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium">Actor</th>
                  <th className="pb-3 font-medium">Action</th>
                  <th className="pb-3 font-medium">Target Resource</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {log.actorType === "AGENT" ? (
                          <Bot className="h-3.5 w-3.5 text-indigo-400" />
                        ) : log.actorType === "USER" ? (
                          <User className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                        )}
                        <span className="font-semibold text-white">{log.actorId}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {log.targetResource}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">
            No audit events recorded yet for this project.
          </div>
        )}
      </div>
    </div>
  );
}
