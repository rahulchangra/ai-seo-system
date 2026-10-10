// AI SEO Stack Operations Hub & Visualizer
import { AI_TOOLS } from '../data/mockData.js';

export function renderStackVisualizer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const toolPositions = [
    { id: 'chatgpt', angle: -90, radius: 140 },      // Top
    { id: 'claude', angle: -45, radius: 145 },       // Top-right
    { id: 'perplexity', angle: 0, radius: 140 },     // Right
    { id: 'notion', angle: 45, radius: 145 },        // Bottom-right
    { id: 'looker', angle: 90, radius: 140 },        // Bottom
    { id: 'semrush', angle: 135, radius: 145 },      // Bottom-left
    { id: 'midjourney', angle: 180, radius: 140 },   // Left
    { id: 'make', angle: 225, radius: 145 }          // Top-left
  ];

  let selectedToolId = 'claude';

  function render() {
    const selectedTool = AI_TOOLS.find(t => t.id === selectedToolId) || AI_TOOLS[0];

    container.innerHTML = `
      <div class="stack-hub-wrapper">
        <div class="stack-hub-canvas">
          <!-- Ambient Glow Rings -->
          <div class="orbit-ring orbit-ring-outer"></div>
          <div class="orbit-ring orbit-ring-inner"></div>
          
          <!-- SVG Connection Lines -->
          <svg class="orbit-svg-lines" viewBox="-180 -180 360 360">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff2a85" stop-opacity="0.8"/>
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.8"/>
              </linearGradient>
            </defs>
            
            ${toolPositions.map(pos => {
              const rad = (pos.angle * Math.PI) / 180;
              const x = Math.round(pos.radius * Math.cos(rad));
              const y = Math.round(pos.radius * Math.sin(rad));
              const isActive = pos.id === selectedToolId;
              return `
                <line x1="0" y1="0" x2="${x}" y2="${y}" 
                      class="stack-conn-line ${isActive ? 'is-active' : ''}" 
                      stroke="url(#lineGrad)" 
                      stroke-width="${isActive ? '2.5' : '1.2'}" 
                      stroke-dasharray="${isActive ? 'none' : '4,4'}"
                      opacity="${isActive ? '1' : '0.45'}" />
                <circle cx="${x}" cy="${y}" r="${isActive ? 6 : 3}" fill="#ff2a85" opacity="${isActive ? '0.9' : '0.4'}" />
              `;
            }).join('')}
            
            <circle class="pulse-beam" r="4" fill="#00e599">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="${getActivePath()}" />
            </circle>
          </svg>

          <!-- Central Core Hub -->
          <div class="stack-center-core" id="centerHubCore" title="Central AI SEO Engine">
            <div class="core-particles">
              <span class="sparkle s1">✦</span>
              <span class="sparkle s2">✦</span>
              <span class="sparkle s3">✦</span>
            </div>
            <div class="core-title-group">
              <span class="core-prefix">AI SEO</span>
              <span class="core-main">STACK</span>
            </div>
          </div>

          <!-- Orbiting Tool Nodes -->
          ${toolPositions.map(pos => {
            const tool = AI_TOOLS.find(t => t.id === pos.id);
            if (!tool) return '';
            const rad = (pos.angle * Math.PI) / 180;
            const x = Math.round(pos.radius * Math.cos(rad));
            const y = Math.round(pos.radius * Math.sin(rad));
            const isSelected = tool.id === selectedToolId;

            return `
              <div class="tool-node-item ${isSelected ? 'is-selected' : ''}" 
                   data-tool-id="${tool.id}" 
                   style="transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)); --tool-color: ${tool.color};"
                   title="${tool.name} (${tool.role})">
                <div class="node-icon-bubble">
                  ${tool.icon}
                  <span class="node-online-dot"></span>
                </div>
                <div class="node-label-pill">${tool.name.split('/')[0].split(' ')[0]}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Selected Tool Details Card -->
        <div class="stack-inspector-card">
          <div class="inspector-header">
            <div class="inspector-badge-row">
              <span class="tool-provider-badge">${selectedTool.provider}</span>
              <span class="tool-status-badge">
                <span class="status-pulse-dot"></span> ${selectedTool.status} • ${selectedTool.latency}
              </span>
            </div>
            <div class="inspector-title-row">
              <div class="inspector-icon" style="color: ${selectedTool.color};">
                ${selectedTool.icon}
              </div>
              <div>
                <h4 class="inspector-name">${selectedTool.name}</h4>
                <div class="inspector-role">${selectedTool.role}</div>
              </div>
            </div>
          </div>
          <p class="inspector-desc">${selectedTool.description}</p>
          <div class="inspector-metrics-bar">
            <span>Throughput: <strong>${selectedTool.tokensUsed}</strong></span>
            <button class="btn-config-tool" id="btnOpenConfigKey">Configure API / Hook ⚙</button>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function getActivePath() {
    const pos = toolPositions.find(p => p.id === selectedToolId) || toolPositions[0];
    const rad = (pos.angle * Math.PI) / 180;
    const x = Math.round(pos.radius * Math.cos(rad));
    const y = Math.round(pos.radius * Math.sin(rad));
    return `M 0 0 L ${x} ${y} Z`;
  }

  function bindEvents() {
    container.querySelectorAll('.tool-node-item').forEach(el => {
      el.addEventListener('click', () => {
        selectedToolId = el.dataset.toolId;
        render();
      });
    });

    const configBtn = container.querySelector('#btnOpenConfigKey');
    if (configBtn) {
      configBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-settings-modal'));
      });
    }
  }

  render();
}
