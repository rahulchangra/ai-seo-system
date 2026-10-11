"use client";

import { useState, useEffect } from "react";
import { Workflow, GitBranch, Server, BarChart2, ShieldCheck, CheckCircle2, Loader2, Link2 } from "lucide-react";

interface IntegrationsTabProps {
  project: any;
  onRefreshProject: () => void;
}

export function IntegrationsTab({ project, onRefreshProject }: IntegrationsTabProps) {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<"GITHUB" | "WORDPRESS" | "GSC" | null>(null);
  const [wpUrl, setWpUrl] = useState("");
  const [wpUser, setWpUser] = useState("");
  const [wpPassword, setWpPassword] = useState("");
  const [ghToken, setGhToken] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}/integrations`);
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (project?.id) fetchIntegrations();
  }, [project?.id]);

  const handleConnectWordPress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "WORDPRESS",
          credentials: { endpoint: wpUrl, username: wpUser, applicationPassword: wpPassword },
          capabilities: ["read_pages", "write_posts", "update_meta"],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveModal(null);
        fetchIntegrations();
        onRefreshProject();
      } else {
        alert(data.error || "Failed to connect WordPress");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "GITHUB",
          credentials: { personalAccessToken: ghToken },
          capabilities: ["read_repo", "create_branch", "open_pull_request"],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveModal(null);
        fetchIntegrations();
        onRefreshProject();
      } else {
        alert(data.error || "Failed to connect GitHub");
      }
    } finally {
      setLoading(false);
    }
  };

  const isConnected = (prov: string) => integrations.some((i) => i.provider === prov && i.isConnected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Workflow className="h-5 w-5 text-indigo-400" />
          Integrations & CMS Execution Connectors
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Connect authorized code repositories and CMS platforms for automated task execution. All credentials are encrypted at rest with zero permission overreach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GitHub Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">GitHub (Mode A)</h3>
                  <span className="text-[11px] text-slate-400">Source Code Execution</span>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isConnected("GITHUB")
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {isConnected("GITHUB") ? "Connected" : "Disconnected"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables autonomous code remediation: isolated branch creation, scoped file patching, and automatic pull requests.
            </p>
          </div>

          <button
            onClick={() => setActiveModal("GITHUB")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-all"
          >
            {isConnected("GITHUB") ? "Manage GitHub Credentials" : "Connect GitHub"}
          </button>
        </div>

        {/* WordPress Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">WordPress REST API (Mode B)</h3>
                  <span className="text-[11px] text-slate-400">No-Code CMS Execution</span>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isConnected("WORDPRESS")
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {isConnected("WORDPRESS") ? "Connected" : "Disconnected"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables authenticated CMS Execution Agent (Agent 10) to update titles, meta tags, and structured data via secure Application Passwords.
            </p>
          </div>

          <button
            onClick={() => setActiveModal("WORDPRESS")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-all"
          >
            {isConnected("WORDPRESS") ? "Manage WordPress Credentials" : "Connect WordPress"}
          </button>
        </div>

        {/* Google Search Console Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google Search Console</h3>
                  <span className="text-[11px] text-slate-400">Search Analytics API</span>
                </div>
              </div>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                Ready for Auth
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Allows the Analytics Agent (Agent 15) to pull real impressions, clicks, keyword rankings, and indexing status.
            </p>
          </div>
          <button
            onClick={() => alert("Configure Google Client ID & Secret in .env or Settings tab.")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-all"
          >
            Connect Search Console
          </button>
        </div>

        {/* Google Analytics 4 Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google Analytics 4</h3>
                  <span className="text-[11px] text-slate-400">Traffic & Engagement API</span>
                </div>
              </div>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                Ready for Auth
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides organic search conversion tracking, engagement time, and bounce rate metrics.
            </p>
          </div>
          <button
            onClick={() => alert("Configure Google Client ID in .env or Settings tab.")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-all"
          >
            Connect GA4
          </button>
        </div>
      </div>

      {/* WordPress Modal */}
      {activeModal === "WORDPRESS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Connect WordPress REST API</h3>
            <form onSubmit={handleConnectWordPress} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">WordPress Site URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://mysite.com"
                  value={wpUrl}
                  onChange={(e) => setWpUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={wpUser}
                  onChange={(e) => setWpUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Application Password</label>
                <input
                  type="password"
                  required
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={wpPassword}
                  onChange={(e) => setWpPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white"
                >
                  {loading ? "Connecting..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Modal */}
      {activeModal === "GITHUB" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Connect GitHub Token</h3>
            <form onSubmit={handleConnectGitHub} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Personal Access Token (PAT)</label>
                <input
                  type="password"
                  required
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-cyan-600 px-4 py-1.5 font-semibold text-white"
                >
                  {loading ? "Saving..." : "Save Token"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
