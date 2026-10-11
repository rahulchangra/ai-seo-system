"use client";

import { Sparkles, Globe, Plus, Cpu, ChevronDown, Crown } from "lucide-react";

interface NavbarProps {
  projects: any[];
  selectedProject: any | null;
  onSelectProject: (proj: any) => void;
  onOpenNewProject: () => void;
  onTriggerAudit: () => void;
  onOpenAutopilot: () => void;
  isAuditing: boolean;
}

export function Navbar({
  projects,
  selectedProject,
  onSelectProject,
  onOpenNewProject,
  onTriggerAudit,
  onOpenAutopilot,
  isAuditing,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                AI SEO AUTONOMOUS
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  SaaS v1.0
                </span>
              </span>
              <p className="text-[11px] text-slate-400">Self-Executing Optimization Engine</p>
            </div>
          </div>

          {/* Project Selector */}
          {projects.length > 0 && (
            <div className="relative">
              <select
                value={selectedProject?.id || ""}
                onChange={(e) => {
                  const found = projects.find((p) => p.id === e.target.value);
                  if (found) onSelectProject(found);
                }}
                className="appearance-none rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-8 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.website?.domain || "no domain"})
                  </option>
                ))}
              </select>
              <Globe className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>LLM Provider:</span>
            <span className="font-semibold text-indigo-300">
              {process.env.NEXT_PUBLIC_LLM_PROVIDER || "Configurable Adapter"}
            </span>
          </div>

          {selectedProject && (
            <>
              <button
                onClick={onOpenAutopilot}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:brightness-110 transition-all"
              >
                <Crown className="h-3.5 w-3.5 text-amber-300" />
                Autopilot (CEO Mode)
              </button>

              <button
                onClick={onTriggerAudit}
                disabled={isAuditing}
                className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-slate-700 disabled:opacity-50 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                {isAuditing ? "Auditing..." : "Run Audit"}
              </button>
            </>
          )}

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </button>
        </div>
      </div>
    </header>
  );
}
