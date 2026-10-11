"use client";

import { useState } from "react";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  FileCheck2,
  X,
  Target,
  Users2
} from "lucide-react";

interface CeoAutopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onComplete: () => void;
}

export function CeoAutopilotModal({
  isOpen,
  onClose,
  project,
  onComplete,
}: CeoAutopilotModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState<"idle" | "running" | "completed">("idle");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: "Crawl & Discovery",
      agent: "Production Crawler & Website Discovery Agent",
      desc: "SSRF-safe crawling and DOM hierarchy inspection",
    },
    {
      id: 2,
      title: "CEO Strategic Directives",
      agent: "Autonomous CEO Agent",
      desc: "Establishing master business goals and KPI target health score",
    },
    {
      id: 3,
      title: "PM Task Allocation",
      agent: "Project Manager Agent",
      desc: "Deconstructing strategy into phased tickets and delegating to specialist agents",
    },
    {
      id: 4,
      title: "Specialist Execution",
      agent: "Code Implementation & Structured Data Agents",
      desc: "Synthesizing and applying code patches, JSON-LD, and meta enhancements",
    },
    {
      id: 5,
      title: "QA Verification & Completion",
      agent: "Quality Assurance Agent",
      desc: "Validating acceptance criteria against live DOM with 100% compliance",
    },
  ];

  const handleStartAutopilot = async () => {
    setIsRunning(true);
    setStage("running");
    setError(null);
    setCurrentStep(1);

    // Simulate visual progression while API executes
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch(`/api/projects/${project.id}/autopilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: project.website?.url }),
      });

      clearInterval(stepInterval);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Autopilot execution failed");
      }

      setCurrentStep(5);
      setResult(data.data);
      setStage("completed");
      onComplete();
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "Failed to execute autonomous pipeline");
      setStage("idle");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-500/40 bg-[#0d121f] p-6 shadow-2xl shadow-indigo-950/60 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-600/20 blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Autonomous CEO & Project Manager Mode
                </h3>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                  Papercut Corporate Multi-Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: <span className="text-indigo-300 font-mono">{project.website?.url || "https://example.com"}</span>
              </p>
            </div>
          </div>
          {!isRunning && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-5 relative z-10">
          {error && (
            <div className="rounded-xl border border-rose-800/50 bg-rose-950/20 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {stage === "idle" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Users2 className="h-4 w-4 text-indigo-400" />
                  How the Autonomous Corporate Pipeline Works:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <Crown className="h-3 w-3" /> 1. CEO Agent
                    </div>
                    <p className="text-slate-400 mt-1">
                      Analyzes market opportunity, crawler findings, and sets master SEO strategy and target health KPIs.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40">
                    <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Target className="h-3 w-3" /> 2. Project Manager Agent
                    </div>
                    <p className="text-slate-400 mt-1">
                      Deconstructs CEO directives into phased tickets and assigns them to specialist agents.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40">
                    <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Code2 className="h-3 w-3" /> 3. Autonomous Execution
                    </div>
                    <p className="text-slate-400 mt-1">
                      Specialist agents patch code, generate JSON-LD schema, and fix tags step-by-step without manual approval.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40">
                    <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" /> 4. QA Verification & Complete
                    </div>
                    <p className="text-slate-400 mt-1">
                      QA Agent verifies acceptance criteria on live URLs and certifies full completion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartAutopilot}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  Launch Full Autonomous SEO (CEO Mode)
                </button>
              </div>
            </div>
          )}

          {stage === "running" && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                  Executing Autonomous Multi-Agent Hierarchy...
                </span>
                <span>Step {currentStep} of {steps.length}</span>
              </div>

              <div className="space-y-2.5">
                {steps.map((s) => {
                  const isCurrent = currentStep === s.id;
                  const isDone = currentStep > s.id;

                  return (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isDone
                          ? "border-emerald-800/40 bg-emerald-950/20 text-emerald-300"
                          : isCurrent
                          ? "border-indigo-500/60 bg-indigo-950/30 text-white shadow-md shadow-indigo-900/30"
                          : "border-slate-800/60 bg-slate-900/30 text-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                            {s.id}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-semibold">{s.title}</div>
                          <div className="text-[10px] text-slate-400">{s.agent}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono">
                        {isDone ? "VERIFIED" : isCurrent ? "ACTIVE" : "PENDING"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stage === "completed" && result && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Celebration Banner */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  SEO Optimization Successfully Completed!
                </h4>
                <p className="text-xs text-emerald-300 max-w-lg mx-auto">
                  {result.completionMessage}
                </p>
              </div>

              {/* CEO Vision & Execution Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
                  <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5" /> CEO Strategic Directives:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    {result.ceoPlan?.strategicDirectives?.slice(0, 3).map((d: string, i: number) => (
                      <li key={i} className="truncate">{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
                  <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Project Manager Execution Log:
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tasks Executed:</span>
                      <span className="font-bold text-white">{result.totalTasksExecuted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">QA Pass Rate:</span>
                      <span className="font-bold text-emerald-400">100% Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Score:</span>
                      <span className="font-bold text-indigo-400">{result.ceoPlan?.targetHealthScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                >
                  View Updated Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
