// Main Application Controller
import { renderStackVisualizer } from './modules/stackVisualizer.js';
import { renderGscChart } from './modules/gscChart.js';
import { renderAutonomousAgent } from './modules/autonomousAgent.js';
import { renderOpportunityFinder } from './modules/opportunityFinder.js';
import { renderContentStudio } from './modules/contentStudio.js';
import { renderAnalyticsTracker } from './modules/analyticsTracker.js';
import { renderWorkflowBuilder } from './modules/workflowBuilder.js';
import { setupSettingsModal } from './modules/settingsModal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialise Hero Visual Components
  renderStackVisualizer('stackOrbitContainer');
  renderGscChart('gscCardContainer');

  // 2. Initialise Settings Modal Engine
  setupSettingsModal();

  // 3. Tab State & Pillar Router
  let currentActiveTab = 'pillar-autonomous';
  let passedKeywordToContent = '';

  const tabButtons = document.querySelectorAll('.tab-btn');

  function switchTab(tabId) {
    currentActiveTab = tabId;

    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    if (tabId === 'pillar-autonomous') {
      renderAutonomousAgent('pillarActiveWorkspace', (targetTab) => {
        switchTab(targetTab);
      });
    } else if (tabId === 'pillar-opportunities') {
      renderOpportunityFinder('pillarActiveWorkspace', (kw) => {
        passedKeywordToContent = kw;
        switchTab('pillar-content');
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
      });
    } else if (tabId === 'pillar-content') {
      renderContentStudio('pillarActiveWorkspace', passedKeywordToContent);
      passedKeywordToContent = '';
    } else if (tabId === 'pillar-performance') {
      renderAnalyticsTracker('pillarActiveWorkspace', (kw) => {
        passedKeywordToContent = kw;
        switchTab('pillar-content');
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
      });
    } else if (tabId === 'pillar-workflows') {
      renderWorkflowBuilder('pillarActiveWorkspace');
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Hero 4-feature badges to jump directly into the respective pillar
  document.querySelectorAll('[data-jump-pillar]').forEach(badge => {
    badge.addEventListener('click', () => {
      const targetPillar = badge.dataset.jumpPillar;
      switchTab(targetPillar);
      const dash = document.getElementById('dashboard');
      if (dash) {
        dash.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero Autonomous SEO Action Trigger
  const btnHeroAutoSeo = document.getElementById('btnHeroExecuteAutoSeo');
  if (btnHeroAutoSeo) {
    btnHeroAutoSeo.addEventListener('click', () => {
      switchTab('pillar-autonomous');
      const dash = document.getElementById('dashboard');
      if (dash) {
        dash.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        const autoTrigger = document.getElementById('btnLaunchAutonomousSeo');
        if (autoTrigger) autoTrigger.click();
      }, 300);
    });
  }

  // Initial tab render: Launch straight into 100% Autonomous Auto-Pilot!
  switchTab('pillar-autonomous');

  // 4. Settings & Quick Actions
  const openSettings = () => {
    window.dispatchEvent(new CustomEvent('open-settings-modal'));
  };

  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const btnFooterSettings = document.getElementById('btnFooterSettings');
  const btnQuickNew = document.getElementById('btnQuickNewArticle');

  if (btnOpenSettings) btnOpenSettings.addEventListener('click', openSettings);
  if (btnFooterSettings) btnFooterSettings.addEventListener('click', openSettings);
  if (btnQuickNew) {
    btnQuickNew.addEventListener('click', () => {
      switchTab('pillar-content');
      document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const projSelect = document.getElementById('projectSelect');
  if (projSelect) {
    projSelect.addEventListener('change', (e) => {
      const targetDomainInput = document.getElementById('autoTargetDomain');
      if (targetDomainInput) {
        targetDomainInput.value = e.target.value.replace('https://', '');
      }
      showToast(`Switched active property to ${e.target.value}`);
      renderGscChart('gscCardContainer');
    });
  }

  // 5. Global Toast Notification System
  const toastContainer = document.getElementById('toastContainer');
  window.addEventListener('app-toast', (e) => {
    const msg = e.detail?.message || 'Operation updated successfully.';
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.innerHTML = `
      <span class="toast-icon">✓</span>
      <span>${msg}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  });

  function showToast(msg) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg } }));
  }
});
