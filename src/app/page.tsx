"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { OverviewTab } from "@/components/OverviewTab";
import { AuditTab } from "@/components/AuditTab";
import { RoadmapTab } from "@/components/RoadmapTab";
import { AgentCenterTab } from "@/components/AgentCenterTab";
import { KeywordResearchTab } from "@/components/KeywordResearchTab";
import { ContentStudioTab } from "@/components/ContentStudioTab";
import { CompetitorTab } from "@/components/CompetitorTab";
import { PerformanceTab } from "@/components/PerformanceTab";
import { IntegrationsTab } from "@/components/IntegrationsTab";
import { ReportsTab } from "@/components/ReportsTab";
import { ActivityLogTab } from "@/components/ActivityLogTab";
import { SettingsTab } from "@/components/SettingsTab";
import { BillingTab } from "@/components/BillingTab";
import { NewProjectModal } from "@/components/NewProjectModal";
import { CeoAutopilotModal } from "@/components/CeoAutopilotModal";

export default function SaaSApp() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isAutopilotModalOpen, setIsAutopilotModalOpen] = useState<boolean>(false);

  // Load projects
  const fetchProjects = async (autoSelectId?: string) => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && data.projects.length > 0) {
        setProjects(data.projects);
        const target = autoSelectId
          ? data.projects.find((p: any) => p.id === autoSelectId)
          : selectedProject
          ? data.projects.find((p: any) => p.id === selectedProject.id)
          : data.projects[0];

        if (target) {
          await loadProjectDetails(target.id);
        }
      } else {
        setProjects([]);
        setSelectedProject(null);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedProject(data.project);
      }
    } catch (err) {
      console.error("Failed to load project details", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTriggerAudit = async () => {
    if (!selectedProject) return;
    setIsAuditing(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/audit`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Audit failed");
      } else {
        await loadProjectDetails(selectedProject.id);
      }
    } catch (err: any) {
      alert("Audit request failed: " + err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070b12] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="text-xs text-slate-400 font-mono tracking-wider">
            LOADING AUTONOMOUS SAAS ENGINE...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(proj) => loadProjectDetails(proj.id)}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onTriggerAudit={handleTriggerAudit}
        onOpenAutopilot={() => setIsAutopilotModalOpen(true)}
        isAuditing={isAuditing}
      />

      {/* Main SaaS Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          project={selectedProject}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full">
          {selectedProject ? (
            <div className="space-y-6">
              {/* Active Module View */}
              {activeTab === "overview" && (
                <OverviewTab
                  project={selectedProject}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onTriggerAudit={handleTriggerAudit}
                  onOpenAutopilot={() => setIsAutopilotModalOpen(true)}
                  isAuditing={isAuditing}
                />
              )}

              {activeTab === "audit" && <AuditTab project={selectedProject} />}

              {activeTab === "roadmap" && (
                <RoadmapTab
                  project={selectedProject}
                  onRefreshProject={() => loadProjectDetails(selectedProject.id)}
                  onOpenAutopilot={() => setIsAutopilotModalOpen(true)}
                />
              )}

              {activeTab === "agents" && <AgentCenterTab project={selectedProject} />}

              {activeTab === "keywords" && (
                <KeywordResearchTab project={selectedProject} />
              )}

              {activeTab === "content" && (
                <ContentStudioTab project={selectedProject} />
              )}

              {activeTab === "competitors" && (
                <CompetitorTab project={selectedProject} />
              )}

              {activeTab === "performance" && (
                <PerformanceTab project={selectedProject} />
              )}

              {activeTab === "integrations" && (
                <IntegrationsTab
                  project={selectedProject}
                  onRefreshProject={() => loadProjectDetails(selectedProject.id)}
                />
              )}

              {activeTab === "reports" && <ReportsTab project={selectedProject} />}

              {activeTab === "activity" && <ActivityLogTab project={selectedProject} />}

              {activeTab === "settings" && <SettingsTab />}

              {activeTab === "billing" && <BillingTab project={selectedProject} />}
            </div>
          ) : (
            /* Empty State: Create First Project */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 py-24 px-6 text-center space-y-4 my-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-xl">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <h2 className="text-xl font-bold text-white">
                  Welcome to Autonomous AI SEO SaaS
                </h2>
                <p className="text-xs text-slate-400">
                  Enter your website URL to initiate autonomous crawling, technical diagnostics, and self-executing optimization roadmaps.
                </p>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Create First SEO Project
              </button>
            </div>
          )}
        </main>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreated={(newProj) => {
          fetchProjects(newProj.id);
        }}
      />

      {/* Autonomous CEO & Project Manager Autopilot Modal */}
      {selectedProject && (
        <CeoAutopilotModal
          isOpen={isAutopilotModalOpen}
          onClose={() => setIsAutopilotModalOpen(false)}
          project={selectedProject}
          onComplete={() => {
            loadProjectDetails(selectedProject.id);
          }}
        />
      )}
    </div>
  );
}
