"use client";

import { useState, useEffect } from "react";
import { Crosshair, Plus, Loader2, Sparkles, AlertCircle, CheckCircle2, Globe } from "lucide-react";

interface CompetitorTabProps {
  project: any;
}

export function CompetitorTab({ project }: CompetitorTabProps) {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCompetitors = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}/competitors`);
      const data = await res.json();
      if (data.success) {
        setCompetitors(data.competitors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (project?.id) fetchCompetitors();
  }, [project?.id]);

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorUrl: competitorUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCompetitors([data.profile, ...competitors]);
        setCompetitorUrl("");
      } else {
        alert(data.error || "Failed to analyze competitor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Crosshair className="h-5 w-5 text-indigo-400" />
          Autonomous Competitor Analysis & Content Gaps
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Powered by Competitor Analysis Agent (Agent 4). Evaluates topical authority overlap, page-type distribution, and content voids across user-designated competitors.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg">
        <form onSubmit={handleAddCompetitor} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="url"
              required
              placeholder="https://competitor-domain.com"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Agent Auditing Competitor..." : "Analyze Competitor Gaps"}
          </button>
        </form>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.length > 0 ? (
          competitors.map((comp) => {
            let gaps: string[] = [];
            let strengths: string[] = [];
            try {
              gaps = JSON.parse(comp.contentGapsJson);
              strengths = JSON.parse(comp.strengthsJson || "[]");
            } catch {
              gaps = [];
            }

            return (
              <div
                key={comp.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-md space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      {comp.domain}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Topical Overlap Score: {(comp.overlapScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                    Active Benchmark
                  </span>
                </div>

                {/* Content Gaps */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    High-Opportunity Content Gaps:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {gaps.map((g, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths */}
                {strengths.length > 0 && (
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="text-[11px] font-semibold text-slate-300">
                      Identified Competitive Advantages:
                    </div>
                    {strengths.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center text-xs text-slate-500">
            No competitors analyzed yet. Submit a competitor URL above to trigger the Competitor Analysis Agent.
          </div>
        )}
      </div>
    </div>
  );
}
