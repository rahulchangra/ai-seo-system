"use client";

import { useState } from "react";
import { BarChart3, Download, FileText, CheckCircle2, TrendingUp, Calendar } from "lucide-react";

interface ReportsTabProps {
  project: any;
}

export function ReportsTab({ project }: ReportsTabProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.name || "seo"}_audit_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const findingsCount = project?.findings?.length || 0;
  const pagesCount = project?.crawls?.[0]?.pages?.length || 0;
  const tasksCount = project?.roadmapTasks?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Executive SEO Reports & Historical Audits
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Analytics & Continuous Improvement Agents (Agents 15 & 17). Generates comprehensive audit summaries and performance exports.
          </p>
        </div>
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-all"
        >
          <Download className="h-4 w-4" />
          Export JSON Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Total Crawled Inventory</span>
          <div className="text-3xl font-black text-white">{pagesCount} Pages</div>
          <p className="text-[11px] text-indigo-400">Indexed and audited with SSRF-safe engine</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Identified Findings</span>
          <div className="text-3xl font-black text-amber-400">{findingsCount} Issues</div>
          <p className="text-[11px] text-amber-400/90">Categorized with concrete evidence</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Roadmap Progress</span>
          <div className="text-3xl font-black text-cyan-400">{tasksCount} Tasks</div>
          <p className="text-[11px] text-cyan-400/90">Autonomous remediation in progress</p>
        </div>
      </div>

      {/* Executive Report Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            Executive Summary & Remediation Strategy
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Generated: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The Autonomous AI SEO System has completed a baseline crawl of <strong>{project.website?.url}</strong>. Technical analysis indicates primary opportunities centered on canonical tag enforcement, structured data injection (Organization & Financial schemas), and metadata optimization.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Strategic Roadmap Highlights:
            </h4>
            <ul className="space-y-1 list-disc list-inside text-slate-400">
              <li>Deploy self-referential canonical link elements across primary layout heads.</li>
              <li>Inject validated JSON-LD schema entity graphs to capture Google Rich Snippets.</li>
              <li>Execute automated pillar content expansions in targeted semantic topic clusters.</li>
              <li>Re-crawl changed pages post-deployment to confirm verified search acceptance criteria.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
