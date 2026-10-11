"use client";

import { CreditCard, Zap, ShieldCheck, Check, Sparkles } from "lucide-react";

interface BillingTabProps {
  project: any;
}

export function BillingTab({ project }: BillingTabProps) {
  const totalTokens = project?.agentRuns?.reduce((acc: number, r: any) => acc + (r.tokensUsed || 0), 0) || 0;
  const totalCost = project?.agentRuns?.reduce((acc: number, r: any) => acc + (r.executionCost || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-indigo-400" />
          Usage Metering & Enterprise Plan Quota
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time tracking of token accounting, agent compute budgets, and execution costs.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Tokens Consumed</span>
          <div className="text-2xl font-black text-white">{totalTokens.toLocaleString()}</div>
          <span className="text-[11px] text-indigo-400">Tracked across all 17 specialist agents</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Compute Cost</span>
          <div className="text-2xl font-black text-emerald-400">${totalCost.toFixed(4)}</div>
          <span className="text-[11px] text-emerald-400">Estimated provider API expenditure</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Subscription Tier</span>
          <div className="text-2xl font-black text-cyan-400">Autonomous Unlimited</div>
          <span className="text-[11px] text-cyan-400">All 17 agents enabled with zero rate caps</span>
        </div>
      </div>

      {/* Feature Plan Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          Included Autonomous Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          {[
            "17 Autonomous Specialized SEO Agents with Bounded Reasoning Loops",
            "SSRF-Defended Deep Web Crawler with Cheerio HTML Analysis",
            "Multi-Tenant Isolation & Role-Based Access Controls",
            "Mode A (GitHub Code Branch & Diff Generation)",
            "Mode B (WordPress REST API CMS Execution)",
            "Automated Post-Execution QA Verification Engine",
            "Real-Time Keyword Clustering & Cannibalization Prevention",
            "Content Studio Pillar Article Generation with Markdown Export",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
