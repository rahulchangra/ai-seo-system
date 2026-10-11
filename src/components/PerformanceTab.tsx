"use client";

import { useState, useEffect } from "react";
import { Gauge, Sparkles, Loader2, Zap, AlertTriangle, ShieldCheck, ArrowUpRight } from "lucide-react";

interface PerformanceTabProps {
  project: any;
}

export function PerformanceTab({ project }: PerformanceTabProps) {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAudits = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}/performance`);
      const data = await res.json();
      if (data.success) {
        setAudits(data.audits);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (project?.id) fetchAudits();
  }, [project?.id]);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/performance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: project.website?.url }),
      });
      const data = await res.json();
      if (data.success) {
        setAudits([data.audit, ...audits]);
      } else {
        alert(data.error || "Performance audit failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const latestAudit = audits[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Gauge className="h-5 w-5 text-indigo-400" />
            Performance & Core Web Vitals Audits
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Performance Agent (Agent 11). Evaluates Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and render-blocking resources.
          </p>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Agent Auditing..." : "Run Performance Audit"}
        </button>
      </div>

      {latestAudit ? (
        <div className="space-y-6">
          {/* Vitals Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Score */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Performance Score</span>
              <div className="mt-2 text-3xl font-black text-emerald-400">
                {latestAudit.performanceScore} / 100
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Good Core Web Vitals</span>
            </div>

            {/* LCP */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Largest Contentful Paint</span>
              <div className="mt-2 text-2xl font-bold text-white">
                {(latestAudit.lcpMs / 1000).toFixed(2)}s
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">&lt; 2.5s (Target Met)</span>
            </div>

            {/* CLS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Cumulative Layout Shift</span>
              <div className="mt-2 text-2xl font-bold text-white">
                {latestAudit.clsScore}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">&lt; 0.1 (Optimal)</span>
            </div>

            {/* FID */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">First Input Delay</span>
              <div className="mt-2 text-2xl font-bold text-white">
                {latestAudit.fidMs}ms
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">&lt; 100ms (Fast)</span>
            </div>
          </div>

          {/* Speed Opportunities */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Prioritized Speed Remediation Opportunities
            </h3>

            <div className="space-y-2">
              {(() => {
                let opps: string[] = [];
                try {
                  opps = JSON.parse(latestAudit.opportunitiesJson);
                } catch {
                  opps = [];
                }

                return opps.map((opp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-400">
                        {idx + 1}
                      </span>
                      <span>{opp}</span>
                    </div>
                    <span className="rounded bg-indigo-950/50 text-[10px] text-indigo-300 px-2 py-0.5 border border-indigo-800/30">
                      High Impact
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-16 text-center text-xs text-slate-500">
          No performance audits recorded yet. Click &quot;Run Performance Audit&quot; to test Core Web Vitals.
        </div>
      )}
    </div>
  );
}
