// Pillar 1: Find Opportunities - AI Research & Keyword Ideas
import { SEED_KEYWORDS } from '../data/mockData.js';

export function renderOpportunityFinder(containerId, onSelectKeywordForContent) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let keywordsList = [...SEED_KEYWORDS];
  let filterIntent = 'all';
  let onlyQuickWins = false;
  let searchQuery = '';

  function render() {
    const filtered = keywordsList.filter(item => {
      const matchQuery = item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.cluster.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIntent = filterIntent === 'all' || item.intent.toLowerCase() === filterIntent.toLowerCase();
      const matchQuickWin = !onlyQuickWins || item.quickWin;
      return matchQuery && matchIntent && matchQuickWin;
    });

    container.innerHTML = `
      <div class="pillar-workspace">
        <!-- Pillar Header -->
        <div class="pillar-top-header">
          <div class="pillar-title-block">
            <div class="pillar-badge pillar-badge-purple">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              Pillar 01 • Research Engine
            </div>
            <h2 class="pillar-heading">equlix.com — Keyword Opportunities</h2>
            <p class="pillar-subheading">AI-powered keyword research for equlix.com's trading platform. Discover high-intent forex, crypto &amp; stock trading queries your competitors rank for.</p>
          </div>
          
          <div class="pillar-stat-pill-group">
            <div class="stat-bubble">
              <span class="stat-num">${keywordsList.length}</span>
              <span class="stat-label">Keywords Found</span>
            </div>
            <div class="stat-bubble">
              <span class="stat-num">18.4K</span>
              <span class="stat-label">Monthly Impressions</span>
            </div>
          </div>
        </div>

        <!-- Search Bar & Controls -->
        <div class="opportunity-search-card">
          <div class="search-input-wrapper">
            <svg class="search-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" id="oppSearchInput" class="opp-search-field" placeholder="Enter seed topic, niche, or competitor URL (e.g. 'ai seo tools', 'programmatic seo')..." value="${searchQuery}" />
            <button class="btn-gradient-sm" id="btnRunAiSearch">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              AI Deep Scan
            </button>
          </div>

          <!-- Quick Seed Chips -->
          <div class="seed-chips-row">
            <span class="seed-label">equlix.com Seeds:</span>
            <button class="seed-chip" data-seed="equlix trading platform review">equlix review</button>
            <button class="seed-chip" data-seed="secure forex trading platform india">forex platform india</button>
            <button class="seed-chip" data-seed="crypto trading app real-time analytics">crypto trading app</button>
            <button class="seed-chip" data-seed="how to start trading stocks online">trading for beginners</button>
          </div>

          <!-- Filter Toolbar -->
          <div class="opp-filter-toolbar">
            <div class="filter-intent-tabs">
              <button class="intent-filter-btn ${filterIntent === 'all' ? 'is-active' : ''}" data-intent="all">All Intents</button>
              <button class="intent-filter-btn ${filterIntent === 'informational' ? 'is-active' : ''}" data-intent="informational">Informational</button>
              <button class="intent-filter-btn ${filterIntent === 'commercial' ? 'is-active' : ''}" data-intent="commercial">Commercial</button>
              <button class="intent-filter-btn ${filterIntent === 'transactional' ? 'is-active' : ''}" data-intent="transactional">Transactional</button>
            </div>

            <div class="toolbar-right-actions">
              <label class="quick-win-toggle">
                <input type="checkbox" id="chkQuickWin" ${onlyQuickWins ? 'checked' : ''} />
                <span>Quick Wins Only (KD &lt; 35)</span>
              </label>
              <button class="btn-outline-sm" id="btnExportCsv">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <!-- Opportunities Table -->
        <div class="opportunities-table-card">
          <div class="table-responsive">
            <table class="opp-table">
              <thead>
                <tr>
                  <th>Keyword / Search Query</th>
                  <th>Intent</th>
                  <th>Search Vol</th>
                  <th>KD Difficulty</th>
                  <th>Est. CPC</th>
                  <th>AI Overview Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="7" class="empty-table-state">
                      <div class="empty-state-box">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="#71717a" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <p>No matching keywords found. Try clearing filters or entering a new seed keyword.</p>
                      </div>
                    </td>
                  </tr>
                ` : filtered.map(item => `
                  <tr class="opp-row">
                    <td class="col-keyword">
                      <div class="keyword-cell">
                        <span class="kw-text">${item.keyword}</span>
                        ${item.quickWin ? `<span class="badge-quick-win">⚡ Quick Win</span>` : ''}
                        <span class="cluster-tag">${item.cluster}</span>
                      </div>
                    </td>
                    <td>
                      <span class="intent-pill intent-${item.intent.toLowerCase()}">${item.intent}</span>
                    </td>
                    <td class="col-vol">
                      <strong>${item.volume.toLocaleString()}</strong>
                      <span class="vol-sub">/mo</span>
                    </td>
                    <td class="col-kd">
                      <div class="kd-bar-group">
                        <div class="kd-bar-track">
                          <div class="kd-bar-fill ${getKdClass(item.kd)}" style="width: ${item.kd}%"></div>
                        </div>
                        <span class="kd-val-text ${getKdClass(item.kd)}">${item.kd}%</span>
                      </div>
                    </td>
                    <td class="col-cpc">${item.cpc}</td>
                    <td>
                      <div class="ai-score-pill">
                        <span class="ai-sparkle">✦</span>
                        <strong>${item.aiScore}</strong>/100
                      </div>
                    </td>
                    <td class="col-actions">
                      <div class="action-btn-row">
                        <button class="btn-action-primary btn-draft-now" data-kw="${item.keyword}" title="Send keyword to AI Content Studio">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Draft Article
                        </button>
                        <button class="btn-action-icon btn-copy-kw" data-kw="${item.keyword}" title="Copy keyword">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Semantic Topic Clusters & People Also Ask Box -->
        <div class="clusters-grid-layout">
          <div class="cluster-card">
            <div class="cluster-card-header">
              <div class="cluster-icon-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff2e93" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="9" x2="12" y2="3"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="9" y1="12" x2="3" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
                <h4>Semantic Topic Cluster Blueprint</h4>
              </div>
              <span class="cluster-est-traffic">Est. 48.5K Monthly Visits</span>
            </div>
            <div class="cluster-tree">
              <div class="cluster-pillar-node">
                <span class="node-tag">PILLAR 10x</span>
                <strong>Ultimate Guide: Building an Autonomous AI SEO Stack in 2026</strong>
              </div>
              <div class="cluster-spokes-list">
                <div class="cluster-spoke-item">
                  <span class="spoke-branch">↳</span>
                  <span>How to connect Make & Claude 3.5 for automated article generation</span>
                  <button class="btn-spoke-draft" data-kw="connect make and claude 3.5 for seo">Draft</button>
                </div>
                <div class="cluster-spoke-item">
                  <span class="spoke-branch">↳</span>
                  <span>Google AI Overview optimization checklist & JSON-LD schema</span>
                  <button class="btn-spoke-draft" data-kw="google ai overview optimization checklist">Draft</button>
                </div>
                <div class="cluster-spoke-item">
                  <span class="spoke-branch">↳</span>
                  <span>Top 10 Looker Studio dashboards for Google Search Console</span>
                  <button class="btn-spoke-draft" data-kw="looker studio google search console dashboard">Draft</button>
                </div>
              </div>
            </div>
          </div>

          <div class="paa-card">
            <div class="cluster-card-header">
              <div class="cluster-icon-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00c8ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <h4>Google AI Overviews & People Also Ask (PAA)</h4>
              </div>
              <span class="paa-badge">Perplexity Feed</span>
            </div>
            <div class="paa-list">
              <div class="paa-item">
                <p class="paa-q">"What tools are required to build a full no-code AI SEO workflow?"</p>
                <div class="paa-ai-snippet">Target answer: Stack consists of ChatGPT/Claude for prose, Semrush for difficulty, Perplexity for live search citations, Make for webhook loops, and Notion as CMS.</div>
              </div>
              <div class="paa-item">
                <p class="paa-q">"Does Google de-index AI generated content in 2026?"</p>
                <div class="paa-ai-snippet">Target answer: Google's Helpful Content System evaluates E-E-A-T and human value regardless of AI usage, prioritizing first-hand testing and accurate data.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function getKdClass(kd) {
    if (kd <= 30) return 'kd-easy';
    if (kd <= 45) return 'kd-med';
    return 'kd-hard';
  }

  function bindEvents() {
    const searchInput = container.querySelector('#oppSearchInput');
    const searchBtn = container.querySelector('#btnRunAiSearch');

    const handleSearch = () => {
      const q = searchInput.value.trim();
      if (!q) {
        searchQuery = '';
        render();
        return;
      }
      searchQuery = q;

      // Simulate AI searching
      searchBtn.disabled = true;
      searchBtn.innerHTML = `<svg class="spin" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Mining SERP...`;

      setTimeout(() => {
        // If not in existing, add custom keyword
        const exists = keywordsList.some(k => k.keyword.toLowerCase() === q.toLowerCase());
        if (!exists) {
          keywordsList.unshift({
            keyword: q.toLowerCase(),
            volume: Math.floor(Math.random() * 8000) + 2100,
            kd: Math.floor(Math.random() * 32) + 14,
            cpc: `$${(Math.random() * 4 + 2).toFixed(2)}`,
            intent: 'Informational',
            aiScore: Math.floor(Math.random() * 10) + 90,
            quickWin: true,
            cluster: 'Custom Research',
            paa: [`What is the best way to leverage ${q}?`, `How does Google evaluate ${q}?`]
          });
        }
        searchBtn.disabled = false;
        searchBtn.innerHTML = `AI Deep Scan`;
        render();
        showToast(`AI Deep Scan complete! Found high-intent keyword opportunities for "${q}".`);
      }, 700);
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }

    container.querySelectorAll('.seed-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        searchInput.value = chip.dataset.seed;
        handleSearch();
      });
    });

    container.querySelectorAll('.intent-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterIntent = btn.dataset.intent;
        render();
      });
    });

    const chkQuick = container.querySelector('#chkQuickWin');
    if (chkQuick) {
      chkQuick.addEventListener('change', (e) => {
        onlyQuickWins = e.target.checked;
        render();
      });
    }

    container.querySelectorAll('.btn-draft-now, .btn-spoke-draft').forEach(btn => {
      btn.addEventListener('click', () => {
        const kw = btn.dataset.kw;
        if (onSelectKeywordForContent) {
          onSelectKeywordForContent(kw);
        }
      });
    });

    container.querySelectorAll('.btn-copy-kw').forEach(btn => {
      btn.addEventListener('click', () => {
        const kw = btn.dataset.kw;
        navigator.clipboard.writeText(kw);
        showToast(`Copied "${kw}" to clipboard!`);
      });
    });

    const exportBtn = container.querySelector('#btnExportCsv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8," 
          + "Keyword,Intent,Volume,KD,CPC,AIScore,Cluster\n"
          + keywordsList.map(k => `"${k.keyword}","${k.intent}",${k.volume},${k.kd},"${k.cpc}",${k.aiScore},"${k.cluster}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ai_seo_opportunities.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Opportunities exported as CSV!");
      });
    }
  }

  function showToast(msg) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg } }));
  }

  render();
}
