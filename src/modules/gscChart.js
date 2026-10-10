// Google Search Console Analytics Card Component
import { GSC_TIMEFRAMES, DEFAULT_PROJECTS } from '../data/mockData.js';

export function renderGscChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let currentTimeframe = '3m';
  let activeProperty = DEFAULT_PROJECTS[0].domain;

  function render() {
    const data = GSC_TIMEFRAMES[currentTimeframe];
    const width = 540;
    const height = 180;
    const padding = { top: 20, right: 30, bottom: 30, left: 40 };

    const maxImp = Math.max(...data.impressionsSeries) * 1.15;
    const minImp = 0;
    const xStep = (width - padding.left - padding.right) / (data.impressionsSeries.length - 1);

    const points = data.impressionsSeries.map((val, idx) => {
      const x = padding.left + idx * xStep;
      const y = height - padding.bottom - ((val - minImp) / (maxImp - minImp)) * (height - padding.top - padding.bottom);
      return { x, y, val, date: data.dates[idx], clicks: data.clicksSeries[idx] };
    });

    const pathD = generateSmoothPath(points);
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    container.innerHTML = `
      <div class="gsc-card">
        <!-- GSC Brand & Property Header -->
        <div class="gsc-card-header">
          <div class="gsc-brand-title">
            <svg class="gsc-logo-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span class="gsc-title-text">Google Search Console</span>
            <span class="gsc-domain-pill">${activeProperty}</span>
          </div>
          <div class="gsc-header-actions">
            <span class="gsc-live-indicator"><span class="live-dot"></span> Verified Property</span>
          </div>
        </div>

        <!-- Time Range Filters -->
        <div class="gsc-timeframe-bar">
          ${Object.entries(GSC_TIMEFRAMES).map(([key, item]) => `
            <button class="gsc-time-btn ${currentTimeframe === key ? 'is-active' : ''}" data-tf="${key}">
              ${currentTimeframe === key ? '✓ ' : ''}${item.label}
            </button>
          `).join('')}
        </div>

        <!-- Metric KPI Cards -->
        <div class="gsc-metrics-grid">
          <div class="gsc-metric-card gsc-card-impressions">
            <div class="gsc-metric-top">
              <span class="metric-checkbox">✓</span>
              <span class="metric-label">Total impressions</span>
              <span class="metric-help-icon" title="Search result appearances in Google">?</span>
            </div>
            <div class="gsc-metric-value">${data.impressions}</div>
          </div>

          <div class="gsc-metric-card gsc-card-clicks">
            <div class="gsc-metric-top">
              <span class="metric-checkbox empty">□</span>
              <span class="metric-label">Total clicks</span>
              <span class="metric-help-icon" title="Organic search clicks into your website">?</span>
            </div>
            <div class="gsc-metric-value">${data.clicks}</div>
          </div>
        </div>

        <!-- Chart Section with Floating Growth Badge -->
        <div class="gsc-chart-container">
          <div class="gsc-growth-floating-badge" id="gscGrowthBadge">
            <span class="growth-arrow">↑</span> ${data.growth}
          </div>

          <div class="chart-y-axis-label">Impressions</div>

          <svg class="gsc-svg-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gscAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8a5cf6" stop-opacity="0.38"/>
                <stop offset="70%" stop-color="#8a5cf6" stop-opacity="0.08"/>
                <stop offset="100%" stop-color="#8a5cf6" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="gscStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="50%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#c084fc"/>
              </linearGradient>
            </defs>

            <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
            <line x1="${padding.left}" y1="${height - padding.bottom - 40}" x2="${width - padding.right}" y2="${height - padding.bottom - 40}" stroke="rgba(0,0,0,0.05)" stroke-dasharray="3,3"/>
            <line x1="${padding.left}" y1="${height - padding.bottom - 80}" x2="${width - padding.right}" y2="${height - padding.bottom - 80}" stroke="rgba(0,0,0,0.05)" stroke-dasharray="3,3"/>
            <line x1="${padding.left}" y1="${height - padding.bottom - 120}" x2="${width - padding.right}" y2="${height - padding.bottom - 120}" stroke="rgba(0,0,0,0.05)" stroke-dasharray="3,3"/>

            <text x="${padding.left - 8}" y="${height - padding.bottom + 4}" fill="#71717a" font-size="9" text-anchor="end">0</text>
            <text x="${padding.left - 8}" y="${height - padding.bottom - 40 + 4}" fill="#71717a" font-size="9" text-anchor="end">1K</text>
            <text x="${padding.left - 8}" y="${height - padding.bottom - 80 + 4}" fill="#71717a" font-size="9" text-anchor="end">2K</text>
            <text x="${padding.left - 8}" y="${height - padding.bottom - 120 + 4}" fill="#71717a" font-size="9" text-anchor="end">3K</text>

            <path d="${areaD}" fill="url(#gscAreaGrad)" class="chart-area-path"/>
            <path d="${pathD}" fill="none" stroke="url(#gscStrokeGrad)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" class="chart-stroke-path"/>

            ${points.map((pt, i) => `
              <circle cx="${pt.x}" cy="${pt.y}" r="4" 
                      class="chart-point-dot" 
                      data-idx="${i}" 
                      data-date="${pt.date}" 
                      data-val="${pt.val}"
                      data-clicks="${pt.clicks}"
                      fill="#8a5cf6" 
                      stroke="#ffffff" 
                      stroke-width="2"/>
            `).join('')}
          </svg>

          <div class="gsc-x-axis-row" style="padding-left: ${padding.left}px; padding-right: ${padding.right}px;">
            ${data.dates.map(date => `<span class="x-date-label">${date}</span>`).join('')}
          </div>

          <div class="gsc-chart-tooltip" id="gscChartTooltip" style="display: none;">
            <div class="tooltip-date" id="tipDate">Aug 24</div>
            <div class="tooltip-metric">
              <span class="tip-dot purple"></span>
              <span>Impressions: <strong id="tipImp">49,600</strong></span>
            </div>
            <div class="tooltip-metric">
              <span class="tip-dot blue"></span>
              <span>Clicks: <strong id="tipClicks">1,905</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;

    bindChartEvents();
  }

  function generateSmoothPath(points) {
    if (!points.length) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.y ? p2.x : p1.x} ${p2.y}`;
    }
    return d;
  }

  function bindChartEvents() {
    container.querySelectorAll('.gsc-time-btn[data-tf]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTimeframe = btn.dataset.tf;
        render();
      });
    });

    const tooltip = container.querySelector('#gscChartTooltip');
    const tipDate = container.querySelector('#tipDate');
    const tipImp = container.querySelector('#tipImp');
    const tipClicks = container.querySelector('#tipClicks');

    container.querySelectorAll('.chart-point-dot').forEach(dot => {
      dot.addEventListener('mouseenter', () => {
        const date = dot.dataset.date;
        const val = Number(dot.dataset.val).toLocaleString();
        const clicks = Number(dot.dataset.clicks).toLocaleString();

        tipDate.textContent = date;
        tipImp.textContent = val;
        tipClicks.textContent = clicks;

        tooltip.style.display = 'block';
        const rect = dot.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        tooltip.style.left = `${rect.left - containerRect.left + 10}px`;
        tooltip.style.top = `${rect.top - containerRect.top - 50}px`;
      });

      dot.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  render();
}
