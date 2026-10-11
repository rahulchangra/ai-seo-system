"use client";

import {
  LayoutDashboard,
  Search,
  ListTodo,
  Bot,
  KeyRound,
  FileEdit,
  Crosshair,
  Gauge,
  Workflow,
  BarChart3,
  History,
  Settings,
  CreditCard,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  project: any;
}

export function Sidebar({ activeTab, onSelectTab, project }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
    {
      id: "audit",
      label: "Website Audit",
      icon: Search,
      badge: project?.findings?.length || null,
    },
    {
      id: "roadmap",
      label: "SEO Roadmap",
      icon: ListTodo,
      badge: project?.roadmapTasks?.length || null,
    },
    { id: "agents", label: "Agent Center", icon: Bot, badge: "17" },
    { id: "keywords", label: "Keyword Research", icon: KeyRound, badge: null },
    { id: "content", label: "Content Studio", icon: FileEdit, badge: null },
    { id: "competitors", label: "Competitor Analysis", icon: Crosshair, badge: null },
    { id: "performance", label: "Performance & Vitals", icon: Gauge, badge: null },
    { id: "integrations", label: "Integrations & CMS", icon: Workflow, badge: null },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3, badge: null },
    { id: "activity", label: "Activity Log", icon: History, badge: null },
    { id: "settings", label: "LLM & Settings", icon: Settings, badge: null },
    { id: "billing", label: "Usage & Billing", icon: CreditCard, badge: "Active" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-[#070b12] flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-white flex items-center gap-1.5">
              AUTONOMOUS AI SEO
            </span>
            <p className="text-[10px] text-slate-400">Enterprise SaaS Platform</p>
          </div>
        </div>

        {/* Current Project Info */}
        {project && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Project
            </div>
            <div className="text-xs font-bold text-white truncate">
              {project.name}
            </div>
            <div className="text-[10px] text-indigo-400 font-mono truncate">
              {project.website?.url || "https://example.com"}
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Autonomous Agent Runtime</span>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </aside>
  );
}
