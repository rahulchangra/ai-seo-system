"use client";

import { useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Code2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AuditTabProps {
  project: any;
}

export function AuditTab({ project }: AuditTabProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const crawledPages = project.crawls?.[0]?.pages || [];
  const findings = project.findings || [];

  const filteredFindings =
    selectedSeverity === "ALL"
      ? findings
      : findings.filter((f: any) => f.severity === selectedSeverity);

  return (
    <div className="space-y-8">
      {/* 1. Crawled Pages Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Crawled Website Inventory</h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {crawledPages.length} pages
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Source: Production SSRF-Safe Crawler
          </span>
        </div>

        {crawledPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Page URL</th>
                  <th className="pb-3 font-medium">HTTP Status</th>
                  <th className="pb-3 font-medium">Title Tag</th>
                  <th className="pb-3 font-medium">Canonical Tag</th>
                  <th className="pb-3 font-medium">Images / Missing Alt</th>
                  <th className="pb-3 font-medium">Schema Entities</th>
                  <th className="pb-3 font-medium">Words</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {crawledPages.map((page: any) => {
                  let schemaList: string[] = [];
                  try {
                    schemaList = JSON.parse(page.schemaTypes || "[]");
                  } catch {
                    schemaList = [];
                  }

                  return (
                    <tr key={page.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-mono text-[11px] text-indigo-300">
                        <div className="flex items-center gap-1.5 max-w-xs truncate">
                          <span>{page.url}</span>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            page.statusCode >= 200 && page.statusCode < 300
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : page.statusCode >= 300 && page.statusCode < 400
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {page.statusCode}
                        </span>
                      </td>
                      <td className="py-3 max-w-xs truncate">
                        {page.title || (
                          <span className="text-red-400 italic">Missing title tag</span>
                        )}
                      </td>
                      <td className="py-3 max-w-xs truncate font-mono text-[11px]">
                        {page.canonicalUrl ? (
                          <span className="text-slate-300">{page.canonicalUrl}</span>
                        ) : (
                          <span className="text-amber-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3">
                        {page.imageCount > 0 ? (
                          <span
                            className={
                              page.missingAltCount > 0 ? "text-amber-400" : "text-slate-400"
                            }
                          >
                            {page.imageCount} imgs ({page.missingAltCount} missing alt)
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                      <td className="py-3">
                        {schemaList.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {schemaList.map((s, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-indigo-950/60 border border-indigo-800/40 px-1.5 py-0.2 text-[10px] text-indigo-300"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">None detected</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400">{page.wordCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">
            No pages crawled yet. Click &quot;Run SEO Audit&quot; to trigger autonomous crawler.
          </div>
        )}
      </div>

      {/* 2. SEO Findings & Evidence */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Evidence-Based SEO Audit Findings
            </h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {findings.length} total
            </span>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                  selectedSeverity === sev
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {filteredFindings.length > 0 ? (
          <div className="space-y-3">
            {filteredFindings.map((finding: any) => {
              const isExpanded = expandedFindingId === finding.id;
              let evidenceObj: any = null;
              try {
                evidenceObj = JSON.parse(finding.evidence);
              } catch {
                evidenceObj = finding.evidence;
              }

              return (
                <div
                  key={finding.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all"
                >
                  <div
                    className="flex cursor-pointer items-start justify-between gap-4"
                    onClick={() =>
                      setExpandedFindingId(isExpanded ? null : finding.id)
                    }
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            finding.severity === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : finding.severity === "HIGH"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : finding.severity === "MEDIUM"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {finding.severity}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {finding.category}
                        </span>
                        <h4 className="text-xs font-semibold text-white">
                          {finding.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400">{finding.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-indigo-400">
                        Confidence: {(finding.confidence * 100).toFixed(0)}%
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-3 text-xs">
                      <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800">
                        <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                          Diagnostic Evidence:
                        </div>
                        <pre className="text-[11px] font-mono text-cyan-200 overflow-x-auto">
                          {JSON.stringify(evidenceObj, null, 2)}
                        </pre>
                      </div>

                      <div className="rounded-lg bg-indigo-950/20 p-3 border border-indigo-900/30">
                        <div className="font-semibold text-indigo-300 mb-0.5 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Recommended Solution:
                        </div>
                        <p className="text-slate-300 text-xs">
                          {finding.recommendedFix}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">
            No findings for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
