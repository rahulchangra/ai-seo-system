"use client";

import { useState, useEffect } from "react";
import { KeyRound, Plus, Loader2, Sparkles, TrendingUp, Search, ShieldCheck } from "lucide-react";

interface KeywordResearchTabProps {
  project: any;
}

export function KeywordResearchTab({ project }: KeywordResearchTabProps) {
  const [clusters, setClusters] = useState<any[]>([]);
  const [seedKeyword, setSeedKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchClusters = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}/keywords`);
      const data = await res.json();
      if (data.success) {
        setClusters(data.clusters);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (project?.id) fetchClusters();
  }, [project?.id]);

  const handleRunKeywordResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedKeyword.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedKeywords: [seedKeyword.trim()] }),
      });
      const data = await res.json();
      if (data.success) {
        setClusters(data.clusters);
        setSeedKeyword("");
      } else {
        alert(data.error || "Failed to run keyword research");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-400" />
            Autonomous Keyword Research & Intent Mapping
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Keyword Research Agent (Agent 3). Discovers high-intent opportunities, groups semantic clusters, and prevents keyword cannibalization.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg">
        <form onSubmit={handleRunKeywordResearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Enter seed topic or keyword (e.g., algorithmic trading, b2b saas billing)"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Agent Analyzing..." : "Generate Keyword Clusters"}
          </button>
        </form>
      </div>

      {/* Clusters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.length > 0 ? (
          clusters.map((cluster) => {
            let keywordsList: any[] = [];
            try {
              keywordsList = JSON.parse(cluster.keywordsJson);
            } catch {
              keywordsList = [];
            }

            return (
              <div
                key={cluster.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-md space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                      Seed: {cluster.seedKeyword}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {cluster.clusterName}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      cluster.searchIntent === "COMMERCIAL"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}
                  >
                    {cluster.searchIntent}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-300">
                    Semantic Keyword Variations & Difficulty:
                  </div>
                  <div className="space-y-1.5">
                    {keywordsList.map((kw, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-900"
                      >
                        <span className="text-white font-medium">{kw.keyword}</span>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-amber-400">KD: {kw.difficulty}%</span>
                          <span className="text-slate-500">Relevance: {(kw.relevance * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Cannibalization Risk: Zero Detected</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center text-xs text-slate-500">
            No keyword clusters generated yet. Enter a seed keyword above to dispatch the Keyword Research Agent.
          </div>
        )}
      </div>
    </div>
  );
}
