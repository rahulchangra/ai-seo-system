"use client";

import { useState, useEffect } from "react";
import { Settings, Cpu, Key, Save, CheckCircle2, AlertCircle } from "lucide-react";

export function SettingsTab() {
  const [provider, setProvider] = useState("mock");
  const [modelName, setModelName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setProvider(data.settings.llmProvider || "mock");
          setModelName(data.settings.modelName || "");
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          llmProvider: provider,
          modelName: modelName || undefined,
          apiKey: apiKey || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setApiKey("");
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(data.error || "Failed to save settings");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-400" />
          System & LLM Provider Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure external LLM reasoning engines. The system supports OpenAI (GPT-4o), Anthropic (Claude 3.5), Google Gemini, and a deterministic offline Mock provider.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl max-w-2xl space-y-5">
        <form onSubmit={handleSaveSettings} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Active LLM Reasoning Engine
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="mock">Mock Provider (Built-In Offline Deterministic Intelligence)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="gemini">Google Gemini (Gemini 1.5 Pro / Flash)</option>
              <option value="groq">Groq (Llama 3.3 70B Ultra-Fast)</option>
            </select>
          </div>

          {/* Model Name Override */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Model Identifier (Optional Override)
            </label>
            <input
              type="text"
              placeholder={
                provider === "openai"
                  ? "gpt-4o"
                  : provider === "anthropic"
                  ? "claude-3-5-sonnet-20241022"
                  : provider === "gemini"
                  ? "gemini-1.5-pro"
                  : "default"
              }
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* API Key */}
          {provider !== "mock" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                API Key for {provider.toUpperCase()}
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Enter API key (stored encrypted / in env)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved and active reasoning engine updated!
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Provider Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
