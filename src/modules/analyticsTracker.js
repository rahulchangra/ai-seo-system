// Pillar 3: Track Performance - Google Search Console Intelligence Suite
import { RANKING_QUERIES } from '../data/mockData.js';

export function renderAnalyticsTracker(containerId, onOptimizeQuery) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let queryFilter = 'all';

  function render() {
    const filteredQueries = RANKING_QUERIES.filter(q => {
      if (queryFilter === 'climbing') return q.change.startsWith('+');
      if (queryFilter === 'quickwin') return q.status === 'Quick Win' || q.status === 'Opportunity';
      if (queryFilter === 'refresh') return q.status === 'Needs Refresh';
      return true;
    });

    container.innerHTML = `
      <div class="pillar-workspace">
        <!-- Pillar Header -->
        <div class="pillar-top-header">
          <div class="pillar-title-block">
            <div class="pillar-badge pillar-badge-green">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 19h4V5H4v14zm6 0h4V9h-4v10zm6 0h4v-6h-4v6z"/></svg>
              Pillar 03 • Performance & Rank Movements
            </div>
            <h2 class="pillar-heading">equlix.com — GSC Performance Hub</h2>
            <p class="pillar-subheading">Live Google Search Console metrics for equlix.com. Detecting rank shifts across trading, forex &amp; crypto queries, fixing CTR decay, and capturing AI Overview positions.</p>
          </div>

          <div class="sync-status-box">
            <span class="live-dot pulse"></span>
            <span>GSC API Live • sc-domain:equlix.com</span>
          </div>
        </div>

        <!-- 4 Core GSC KPI Cards -->
        <div class="tracker-kpi-grid">
          <div class="kpi-card kpi-purple">
            <div class="kpi-header">
              <span class="kpi-title">Total Impressions</span>
              <span class="kpi-trend positive">+44.8% ↑</span>
            </div>
            <div class="kpi-val">18.4K</div>
            <div class="kpi-sub">vs 12.7K in previous 28-day cycle</div>
          </div>

          <div class="kpi-card kpi-blue">
            <div class="kpi-header">
              <span class="kpi-title">Total Clicks</span>
              <span class="kpi-trend positive">+38.2% ↑</span>
            </div>
            <div class="kpi-val">620</div>
            <div class="kpi-sub">vs 449 in previous 28-day cycle</div>
          </div>

          <div class="kpi-card kpi-teal">
            <div class="kpi-header">
              <span class="kpi-title">Average CTR</span>
              <span class="kpi-trend positive">+0.3% ↑</span>
            </div>
            <div class="kpi-val">3.37%</div>
            <div class="kpi-sub">Brand queries driving strong CTR above average</div>
          </div>

          <div class="kpi-card kpi-orange">
            <div class="kpi-header">
              <span class="kpi-title">Average Position</span>
              <span class="kpi-trend positive">↑3.2 (Improving) ↑</span>
            </div>
            <div class="kpi-val">20.1</div>
            <div class="kpi-sub">6 trading queries tracked, 2 on Google Page 1-2</div>
          </div>
        </div>

        <!-- AI Insights & Actionable SERP Recommendations -->
        <div class="ai-insights-banner">
          <div class="insights-banner-title">
            <span class="sparkle">✦</span>
            <h4>equlix.com — AI Diagnostic Alerts</h4>
          </div>
          <div class="insights-grid">
            <div class="insight-item">
              <div class="insight-badge high-impact">High Impact Anomaly</div>
              <h5>Forex Page CTR is Critically Low</h5>
              <p>Query <em>"online forex trading app india"</em> has <strong>5,600 impressions</strong> but only 1.2% CTR at position 11.4. Just below page 1! Rewriting the meta title with "India's #1" + adding breadcrumb schema can unlock ~200 extra clicks/month.</p>
              <button class="btn-insight-action" data-action="title-fix" data-kw="online forex trading app india">⚡ Auto-Generate High-CTR Meta Title</button>
            </div>
            <div class="insight-item">
              <div class="insight-badge quick-win">Reputation Alert</div>
              <h5>"Legit or Scam" Query Losing Ground</h5>
              <p>Query <em>"equlix app review legit or scam"</em> dropped 3 positions. This is a critical trust query. Adding Trustpilot widget, regulatory badges &amp; FAQPage schema targeting this question will stabilize and improve ranking.</p>
              <button class="btn-insight-action" data-action="schema-inject" data-kw="equlix app review legit or scam">⚡ Inject Trust Schema &amp; FAQ</button>
            </div>
          </div>
        </div>

        <!-- Ranking Queries Table -->
        <div class="ranking-queries-card">
          <div class="table-toolbar">
            <div class="toolbar-title-group">
              <h3 class="table-title">Top Ranking Queries & Positions</h3>
              <span class="table-subtitle">Live keyword movements tracked over the last 90 days</span>
            </div>

            <div class="query-filter-tabs">
              <button class="q-filter-btn ${queryFilter === 'all' ? 'is-active' : ''}" data-filter="all">All Queries</button>
              <button class="q-filter-btn ${queryFilter === 'climbing' ? 'is-active' : ''}" data-filter="climbing">Top Climbing ↗</button>
              <button class="q-filter-btn ${queryFilter === 'quickwin' ? 'is-active' : ''}" data-filter="quickwin">Quick Wins (Top 10)</button>
              <button class="q-filter-btn ${queryFilter === 'refresh' ? 'is-active' : ''}" data-filter="refresh">Needs Refresh</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="ranking-table">
              <thead>
                <tr>
                  <th>Target Search Query</th>
                  <th>Google Position</th>
                  <th>Clicks</th>
                  <th>Impressions</th>
                  <th>CTR</th>
                  <th>AI Recommendation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredQueries.map(q => `
                  <tr>
                    <td class="col-query-name">
                      <strong>${q.query}</strong>
                      <span class="query-status-chip ${getStatusClass(q.status)}">${q.status}</span>
                    </td>
                    <td class="col-pos">
                      <div class="rank-pos-box">
                        <span class="pos-num">#${q.position}</span>
                        <span class="pos-change ${q.change.startsWith('+') ? 'up' : 'down'}">${q.change}</span>
                      </div>
                    </td>
                    <td><strong>${q.clicks.toLocaleString()}</strong></td>
                    <td>${q.impressions.toLocaleString()}</td>
                    <td><span class="ctr-badge">${q.ctr}</span></td>
                    <td class="col-rec">
                      <p class="rec-text">${q.recommendation}</p>
                    </td>
                    <td>
                      <button class="btn-optimize-query" data-kw="${q.query}">
                        Send to Studio
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function getStatusClass(status) {
    if (status === 'Dominating') return 'status-green';
    if (status === 'Climbing') return 'status-purple';
    if (status === 'Quick Win') return 'status-teal';
    if (status === 'Opportunity') return 'status-blue';
    return 'status-orange';
  }

  function bindEvents() {
    container.querySelectorAll('.q-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        queryFilter = btn.dataset.filter;
        render();
      });
    });

    container.querySelectorAll('.btn-optimize-query').forEach(btn => {
      btn.addEventListener('click', () => {
        const kw = btn.dataset.kw;
        if (onOptimizeQuery) {
          onOptimizeQuery(kw);
        }
      });
    });

    container.querySelectorAll('.btn-insight-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const kw = btn.dataset.kw;
        if (action === 'title-fix') {
          showToast(`Generated high-CTR title variations for "${kw}"!`);
        } else {
          showToast(`Injected Google AI Overview schema markup for "${kw}"!`);
        }
      });
    });
  }

  function showToast(msg) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg } }));
  }

  render();
}
