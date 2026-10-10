// Pillar 4: Build Workflows - Autonomous Multi-Tool SEO Pipeline Builder
import { WORKFLOW_TEMPLATES } from '../data/mockData.js';

export function renderWorkflowBuilder(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let currentWfIndex = 0;
  let isRunningWorkflow = false;
  let activeStepIndex = -1;
  let executionLogs = [];
  let selectedNode = null;

  function render() {
    const wf = WORKFLOW_TEMPLATES[currentWfIndex];

    container.innerHTML = `
      <div class="pillar-workspace">
        <!-- Pillar Header -->
        <div class="pillar-top-header">
          <div class="pillar-title-block">
            <div class="pillar-badge pillar-badge-orange">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              Pillar 04 • Autonomous Pipeline Engine
            </div>
            <h2 class="pillar-heading">No-Code Multi-Tool SEO Workflows</h2>
            <p class="pillar-subheading">Orchestrate Make.com, Claude 3.5, Perplexity, Semrush, Midjourney and Notion into self-running organic growth pipelines.</p>
          </div>

          <div class="wf-selector-tabs">
            ${WORKFLOW_TEMPLATES.map((t, idx) => `
              <button class="wf-tab-btn ${currentWfIndex === idx ? 'is-active' : ''}" data-idx="${idx}">
                ${t.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Workflow Canvas & Execution Panel -->
        <div class="wf-builder-grid">
          <!-- Left: Visual Node Canvas -->
          <div class="wf-canvas-card">
            <div class="canvas-header-bar">
              <div class="canvas-title-group">
                <h4 class="canvas-name">${wf.name}</h4>
                <p class="canvas-desc">${wf.description}</p>
              </div>
              <div class="canvas-action-group">
                <button class="btn-outline-sm" id="btnExportBlueprint" title="Export Make.com compatible Blueprint JSON">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export Blueprint JSON
                </button>
                <button class="btn-run-workflow ${isRunningWorkflow ? 'is-running' : ''}" id="btnRunWorkflow" ${isRunningWorkflow ? 'disabled' : ''}>
                  ${isRunningWorkflow ? `
                    <svg class="spin" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                    Executing Pipeline...
                  ` : `
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Test Run Pipeline
                  `}
                </button>
              </div>
            </div>

            <!-- Interactive Visual Pipeline Nodes -->
            <div class="pipeline-flow-wrapper">
              ${wf.steps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const isPassed = activeStepIndex > idx;
                const isSelected = selectedNode && selectedNode.id === step.id;

                return `
                  <div class="pipeline-step-wrapper">
                    <div class="pipeline-node ${isActive ? 'is-active-step' : ''} ${isPassed ? 'is-passed-step' : ''} ${isSelected ? 'is-selected-node' : ''}" 
                         data-step-id="${step.id}" 
                         data-step-idx="${idx}">
                      
                      <div class="node-tool-badge tool-${step.tool.toLowerCase().replace('.', '')}">
                        ${step.tool}
                      </div>

                      <div class="node-icon-circle">
                        ${getNodeIcon(step.icon)}
                      </div>

                      <div class="node-info">
                        <span class="node-step-label">Step 0${idx + 1}</span>
                        <h5 class="node-title">${step.name}</h5>
                      </div>

                      <div class="node-status-indicator">
                        ${isActive ? `
                          <span class="status-badge running">Running...</span>
                        ` : isPassed ? `
                          <span class="status-badge success">✓ 200 OK</span>
                        ` : `
                          <span class="status-badge ready">Ready</span>
                        `}
                      </div>
                    </div>

                    ${idx < wf.steps.length - 1 ? `
                      <div class="pipeline-connector ${isPassed ? 'is-passed-connector' : ''} ${isActive ? 'is-pulsing-connector' : ''}">
                        <div class="connector-line"></div>
                        <div class="connector-arrow">➔</div>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Node Inspector Drawer (If user clicked a node) -->
            ${selectedNode ? `
              <div class="node-config-inspector">
                <div class="inspector-top">
                  <h5>Step Configuration: ${selectedNode.name} (${selectedNode.tool})</h5>
                  <button class="btn-close-inspector" id="btnCloseInspector">✕</button>
                </div>
                <div class="inspector-fields">
                  <div class="field-item">
                    <label>Connector Type:</label>
                    <code>${selectedNode.tool} Webhook v2 (REST JSON)</code>
                  </div>
                  <div class="field-item">
                    <label>Action Hook:</label>
                    <code>${selectedNode.type.toUpperCase()}_DISPATCH_ACTION</code>
                  </div>
                  <div class="field-item">
                    <label>Autopilot Status:</label>
                    <span class="badge-auto">Active • Ready for Webhook Triggers</span>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right: Live Execution Console Terminal -->
          <div class="wf-console-card">
            <div class="console-header">
              <div class="console-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="console-title">Live Pipeline Execution Logs</div>
              <button class="btn-clear-logs" id="btnClearLogs">Clear</button>
            </div>

            <div class="console-body" id="consoleBody">
              ${executionLogs.length === 0 ? `
                <div class="console-empty">
                  <span class="prompt-sign">&gt;</span> Pipeline idle. Click "Test Run Pipeline" to simulate autonomous data transfer across all 8 tools.
                </div>
              ` : executionLogs.map(log => `
                <div class="log-line ${log.type}">
                  <span class="log-time">[${log.time}]</span>
                  <span class="log-badge">[${log.tool}]</span>
                  <span class="log-msg">${log.msg}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function getNodeIcon(iconType) {
    if (iconType === 'zap') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
    if (iconType === 'search') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`;
    if (iconType === 'file-text') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/></svg>`;
    if (iconType === 'check-circle') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    if (iconType === 'image') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    if (iconType === 'database') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`;
    if (iconType === 'clock') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    if (iconType === 'bar-chart') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
    if (iconType === 'cpu') return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>`;
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`;
  }

  function runWorkflowSimulation() {
    const wf = WORKFLOW_TEMPLATES[currentWfIndex];
    isRunningWorkflow = true;
    activeStepIndex = 0;
    executionLogs = [];
    addLog('system', 'Make.com', `Pipeline triggered: ${wf.name}`);

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < wf.steps.length) {
        const step = wf.steps[currentStep];
        activeStepIndex = currentStep;

        if (step.tool === 'Make') {
          addLog('info', 'Make', `Webhook payload parsed. Routing to ${wf.steps[currentStep + 1]?.tool || 'Next'}`);
        } else if (step.tool === 'Perplexity') {
          addLog('success', 'Perplexity', `Queried real-time SERP gap. Extracted 8 citation entities.`);
        } else if (step.tool === 'Claude') {
          addLog('success', 'Claude 3.5', `Generated 2,480-word pillar draft with semantic entity anchors (1,840 tokens).`);
        } else if (step.tool === 'Semrush') {
          addLog('success', 'Semrush', `Keyword density verified at 1.4%. 0 cannibalization risks detected.`);
        } else if (step.tool === 'Midjourney') {
          addLog('success', 'Midjourney', `Generated 16:9 featured header artwork & infographic.`);
        } else if (step.tool === 'Notion') {
          addLog('success', 'Notion', `Draft created in Editorial Database (ID: #seo-notion-284). Ready for publish.`);
        } else {
          addLog('success', step.tool, `Step finished with status 200 OK.`);
        }

        currentStep++;
        render();
      } else {
        clearInterval(interval);
        isRunningWorkflow = false;
        activeStepIndex = wf.steps.length;
        addLog('complete', 'SYSTEM', `🎉 Pipeline executed successfully in 2.84s! Zero errors.`);
        render();
        showToast(`Pipeline "${wf.name}" completed successfully!`);
      }
    }, 700);
  }

  function addLog(type, tool, msg) {
    const time = new Date().toTimeString().split(' ')[0];
    executionLogs.push({ type, tool, msg, time });
  }

  function bindEvents() {
    container.querySelectorAll('.wf-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentWfIndex = Number(btn.dataset.idx);
        activeStepIndex = -1;
        selectedNode = null;
        render();
      });
    });

    const runBtn = container.querySelector('#btnRunWorkflow');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        runWorkflowSimulation();
      });
    }

    const exportBtn = container.querySelector('#btnExportBlueprint');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const wf = WORKFLOW_TEMPLATES[currentWfIndex];
        const blueprint = {
          name: wf.name,
          version: 1,
          flow: wf.steps.map((s, i) => ({
            id: i + 1,
            module: `ai-seo:${s.tool.toLowerCase()}`,
            name: s.name,
            parameters: { autoTrigger: true, retryOnFail: 3 }
          }))
        };
        const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${wf.id}_make_blueprint.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Make.com Blueprint JSON exported!');
      });
    }

    container.querySelectorAll('.pipeline-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const stepId = nodeEl.dataset.stepId;
        const wf = WORKFLOW_TEMPLATES[currentWfIndex];
        selectedNode = wf.steps.find(s => s.id === stepId) || null;
        render();
      });
    });

    const closeInsp = container.querySelector('#btnCloseInspector');
    if (closeInsp) {
      closeInsp.addEventListener('click', () => {
        selectedNode = null;
        render();
      });
    }

    const clearBtn = container.querySelector('#btnClearLogs');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        executionLogs = [];
        render();
      });
    }
  }

  function showToast(msg) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg } }));
  }

  render();
}
