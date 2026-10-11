"use client";

import { useState, useEffect } from "react";
import { FileEdit, Sparkles, Loader2, BookOpen, CheckCircle, Copy, Check } from "lucide-react";

interface ContentStudioTabProps {
  project: any;
}

export function ContentStudioTab({ project }: ContentStudioTabProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [targetKeyword, setTargetKeyword] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(1200);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}/content`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
        if (data.articles.length > 0 && !selectedArticle) {
          setSelectedArticle(data.articles[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (project?.id) fetchArticles();
  }, [project?.id]);

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetKeyword.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetKeyword: targetKeyword.trim(),
          targetWordCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles([data.article, ...articles]);
        setSelectedArticle(data.article);
        setTargetKeyword("");
      } else {
        alert(data.error || "Failed to generate article");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-indigo-400" />
          Autonomous Content Studio & Pillar Writing
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Powered by Content Strategy & Content Creation Agents (Agents 5 & 6). Generates full-length, intent-optimized pillar content and meta tags adhering strictly to brand quality standards.
        </p>
      </div>

      {/* Generation Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg">
        <form onSubmit={handleGenerateArticle} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Target Keyword / Topic
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js SEO Best Practices, B2B Cloud Cost Optimization"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Target Word Count
            </label>
            <select
              value={targetWordCount}
              onChange={(e) => setTargetWordCount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value={800}>Short Form (800 words)</option>
              <option value={1200}>Standard Pillar (1,200 words)</option>
              <option value={2500}>Comprehensive Guide (2,500 words)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Writing Pillar..." : "Generate Content"}
            </button>
          </div>
        </form>
      </div>

      {/* 2 Column View: Articles list on left, Article Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Cards Sidebar */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400">
            Saved Articles ({articles.length})
          </div>
          {articles.length > 0 ? (
            articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  selectedArticle?.id === art.id
                    ? "border-indigo-500 bg-indigo-950/20"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-mono text-indigo-400">Keyword: {art.targetKeyword}</span>
                  <span className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2">
                    {art.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">
                  {art.title}
                </h4>
                <div className="text-[11px] text-slate-500 mt-2">
                  {art.wordCount} words • {new Date(art.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-8 text-center text-xs text-slate-500">
              No articles generated yet.
            </div>
          )}
        </div>

        {/* Article Viewer Pane */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl space-y-4">
          {selectedArticle ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="rounded bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                    Target: {selectedArticle.targetKeyword}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Meta Description: {selectedArticle.metaDescription}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedArticle.articleMarkdown)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Markdown"}
                </button>
              </div>

              {/* Markdown Content */}
              <div className="max-h-[600px] overflow-y-auto pr-2">
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  {selectedArticle.articleMarkdown}
                </pre>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-slate-500">
              Select an article on the left or generate a new one to preview the pillar content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
