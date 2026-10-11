"use client";

import { useState } from "react";
import { Globe, GitBranch, Server, X, Loader2, Sparkles } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: any) => void;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onCreated,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [operatingMode, setOperatingMode] = useState<"MODE_A" | "MODE_B">("MODE_B");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || new URL(url).hostname,
          url,
          operatingMode,
          repoUrl: operatingMode === "MODE_A" ? repoUrl : undefined,
          repoBranch: operatingMode === "MODE_A" ? repoBranch : "main",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create project");
      }

      onCreated(data.project);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Create New SEO Project</h2>
              <p className="text-xs text-slate-400">
                Deploy autonomous agents to crawl, audit, and optimize
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-950/50 border border-red-800/60 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Execution Architecture
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOperatingMode("MODE_B")}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  operatingMode === "MODE_B"
                    ? "border-indigo-500 bg-indigo-950/20 text-white"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Server className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-semibold">Mode B: No Source Code</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Public crawling, CMS APIs (WordPress), and implementation briefs.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setOperatingMode("MODE_A")}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  operatingMode === "MODE_A"
                    ? "border-indigo-500 bg-indigo-950/20 text-white"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold">Mode A: Source Code</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct GitHub repo access, branch patches, diffs, and pull requests.
                </p>
              </button>
            </div>
          </div>

          {operatingMode === "MODE_A" && (
            <div className="space-y-3 rounded-xl border border-cyan-900/40 bg-cyan-950/10 p-3.5">
              <div>
                <label className="block text-xs font-medium text-cyan-200 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cyan-200 mb-1">
                  Target Branch
                </label>
                <input
                  type="text"
                  placeholder="main"
                  value={repoBranch}
                  onChange={(e) => setRepoBranch(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-medium text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Creating..." : "Initialize Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
