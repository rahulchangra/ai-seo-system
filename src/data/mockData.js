// AI SEO System - Core Data Models & Integrations
// Active Project: equlix.com — Secure Trading Platform (Stocks, Forex, Crypto)

export const DEFAULT_PROJECTS = [
  { id: 'proj-1', domain: 'equlix.com', label: 'Equlix (Production)', gscStatus: 'Active', totalImp: '18.4K', totalClicks: '620' },
  { id: 'proj-2', domain: 'equlix.com/blog', label: 'Equlix Blog', gscStatus: 'Active', totalImp: '7.2K', totalClicks: '210' },
  { id: 'proj-3', domain: 'equlix.com/landing', label: 'Equlix Campaigns', gscStatus: 'Pending', totalImp: '2.1K', totalClicks: '58' }
];

export const AI_TOOLS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT / GPT-4o',
    provider: 'OpenAI',
    role: 'Structural Framing & FAQ Schema',
    color: '#10a37f',
    latency: '180ms',
    status: 'Connected',
    tokensUsed: '142,800',
    description: 'Generates semantic topic structures, entity definitions, and structured JSON-LD FAQ schemas.',
    configKey: 'openai_api_key',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M22.28 9.87c-.16-.62-.48-1.2-.95-1.65-.65-.63-1.53-.98-2.45-.98-.44 0-.87.08-1.28.24-.34-.91-.98-1.67-1.81-2.16-.83-.49-1.8-.71-2.77-.63-.8.07-1.56.36-2.22.84-.71-.85-1.74-1.37-2.85-1.45-1.12-.08-2.22.29-3.09 1.04-.87.75-1.42 1.83-1.53 2.99-.44.22-.84.53-1.16.92-.61.73-.93 1.66-.9 2.61.02.96.39 1.88 1.04 2.58-.1.45-.12.92-.05 1.38.13.93.59 1.78 1.28 2.41.69.63 1.58.98 2.51.98.39 0 .78-.06 1.15-.19.34.86.95 1.59 1.74 2.07.79.48 1.71.72 2.64.67.76-.04 1.5-.3 2.14-.74.69.83 1.69 1.34 2.78 1.43 1.09.09 2.17-.25 3.03-.97.86-.72 1.42-1.77 1.55-2.91.46-.2.88-.5 1.21-.89.63-.73.97-1.67.96-2.64-.01-.97-.39-1.9-1.06-2.61.1-.47.11-.96.03-1.44z"/></svg>`
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    role: 'Long-Form E-E-A-T Prose Engine',
    color: '#d97706',
    latency: '210ms',
    status: 'Connected',
    tokensUsed: '286,400',
    description: 'Produces authoritative, natural pillar prose with high information density, human cadence, and zero generic fluff.',
    configKey: 'anthropic_api_key',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2L14.4 9.6H22L15.8 14.1L18.2 21.7L12 17.2L5.8 21.7L8.2 14.1L2 9.6H9.6L12 2Z"/></svg>`
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonnet',
    provider: 'Perplexity AI',
    role: 'Live SERP & AI Overview Citations',
    color: '#22b8cf',
    latency: '145ms',
    status: 'Connected',
    tokensUsed: '98,200',
    description: 'Mines live web citations in real-time, extracts competitor topic gaps, and verifies factual search claims.',
    configKey: 'perplexity_api_key',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>`
  },
  {
    id: 'notion',
    name: 'Notion Database',
    provider: 'Notion Labs',
    role: 'Editorial Pipeline & Topic Backlog',
    color: '#ffffff',
    latency: '95ms',
    status: 'Connected',
    tokensUsed: 'Synced',
    description: 'Stores topic backlogs, tracks editorial review states, and organizes semantic clusters in real-time databases.',
    configKey: 'notion_token',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.472-.84c1.12-.093 1.306-.466 1.026-1.026L18.258 1.41C17.885.85 17.232.477 16.019.57L2.407 1.597c-.933.093-1.4.56-1.027 1.306l3.079 1.305zm.933 3.544v13.526c0 1.213.653 1.68 1.866 1.587l13.714-.933c1.213-.093 1.493-.84 1.493-1.867V5.981c0-.933-.467-1.306-1.4-1.213l-14.274.98c-1.027.093-1.4.56-1.4 1.504zm13.34 1.493c.094.56-.28 1.027-.933 1.027h-.746l-4.572 6.716 4.385.093c.654 0 .934.373.934.933v.746c0 .56-.467.934-1.027.934H11.55c-.56 0-.84-.374-.747-.934.093-.56.467-1.026.933-1.026l3.733-5.599h-3.36c-.653 0-1.026-.373-1.026-.933v-.747c0-.56.466-.933 1.026-.933l4.759-.28c.56 0 .933.373.84.887z"/></svg>`
  },
  {
    id: 'looker',
    name: 'Looker Studio / GSC',
    provider: 'Google',
    role: 'Automated Search Console Analytics',
    color: '#4285f4',
    latency: '110ms',
    status: 'Connected',
    tokensUsed: 'Live Stream',
    description: 'Blends Google Search Console performance data with automated CTR anomaly detection and rank movement alerts.',
    configKey: 'gsc_property_id',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 19h4V5H4v14zm6 0h4V9h-4v10zm6 0h4v-6h-4v6z"/></svg>`
  },
  {
    id: 'semrush',
    name: 'Semrush Intelligence',
    provider: 'Semrush Inc.',
    role: 'SERP Difficulty & Keyword Metrics',
    color: '#ff642d',
    latency: '160ms',
    status: 'Connected',
    tokensUsed: 'API v3',
    description: 'Extracts keyword difficulty (KD%), search volume, competitive SERP overlap, and backlink audit records.',
    configKey: 'semrush_api_key',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-6h2v6zm0-8h-2V7h2v3z"/></svg>`
  },
  {
    id: 'midjourney',
    name: 'Midjourney / Visual AI',
    provider: 'Midjourney Inc.',
    role: 'Header Art & Infographic Generator',
    color: '#9333ea',
    latency: '340ms',
    status: 'Connected',
    tokensUsed: 'v6.1 Engine',
    description: 'Generates branded blog headers, editorial illustrations, and social media visual assets from AI prompts.',
    configKey: 'midjourney_webhook',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 13.5l4-3 5 4 9-7-3 12H6L3 13.5z"/></svg>`
  },
  {
    id: 'make',
    name: 'Make.com Orchestrator',
    provider: 'Celonis / Make',
    role: 'Autonomous Webhook Pipeline Runner',
    color: '#6d28d9',
    latency: '80ms',
    status: 'Connected',
    tokensUsed: 'Webhooks 200',
    description: 'Connects all AI APIs with webhooks, automates scheduled scrapers, and auto-pushes drafts to CMS/WordPress.',
    configKey: 'make_webhook_url',
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19.5 3h-15C3.12 3 2 4.12 2 5.5v13C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-13C22 4.12 20.88 3 19.5 3zM12 17.5L6.5 12 12 6.5l1.41 1.41L9.33 12l4.08 4.09L12 17.5zm5.5-4.09L13.41 12l4.09-4.09L18.91 9.32 14.83 13.41 18.91 17.5 17.5 13.41z"/></svg>`
  }
];

// equlix.com — Real Google Search Console Data (Simulated from actual site metrics)
export const GSC_TIMEFRAMES = {
  '24h': {
    label: '24 hours',
    impressions: '1.2K',
    impressionsRaw: 1240,
    clicks: '38',
    clicksRaw: 38,
    ctr: '3.07%',
    position: '18.4',
    growth: '+12.3% today',
    dates: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
    impressionsSeries: [62, 88, 142, 210, 295, 258, 185],
    clicksSeries: [2, 3, 5, 8, 10, 7, 3]
  },
  '7d': {
    label: '7 days',
    impressions: '4.6K',
    impressionsRaw: 4620,
    clicks: '142',
    clicksRaw: 142,
    ctr: '3.07%',
    position: '19.2',
    growth: '+28.6% vs last week',
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    impressionsSeries: [410, 520, 680, 760, 890, 740, 620],
    clicksSeries: [12, 16, 22, 24, 30, 22, 16]
  },
  '28d': {
    label: '28 days',
    impressions: '18.4K',
    impressionsRaw: 18400,
    clicks: '620',
    clicksRaw: 620,
    ctr: '3.37%',
    position: '20.1',
    growth: '+44.8% vs last month',
    dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    impressionsSeries: [3200, 4100, 5400, 5700],
    clicksSeries: [105, 142, 188, 185]
  },
  '3m': {
    label: '3 months',
    impressions: '42.8K',
    impressionsRaw: 42800,
    clicks: '1.38K',
    clicksRaw: 1380,
    ctr: '3.22%',
    position: '21.4',
    growth: '↑ 42.8K impressions',
    dates: ['Jul 1', 'Jul 15', 'Jul 29', 'Aug 12', 'Aug 26', 'Sep 9', 'Sep 23'],
    impressionsSeries: [2100, 3800, 5200, 7100, 8900, 7800, 7900],
    clicksSeries: [64, 115, 168, 228, 290, 255, 260]
  },
  '12m': {
    label: '12 months',
    impressions: '98.6K',
    impressionsRaw: 98600,
    clicks: '3.2K',
    clicksRaw: 3200,
    ctr: '3.24%',
    position: '22.8',
    growth: '+192% Year-over-Year',
    dates: ['Q1', 'Q2', 'Q3', 'Q4'],
    impressionsSeries: [8200, 18400, 32800, 39200],
    clicksSeries: [260, 598, 1060, 1282]
  }
};

// equlix.com — Keyword Research: Trading Platform SEO Opportunities
export const SEED_KEYWORDS = [
  {
    keyword: 'equlix trading platform review',
    volume: 1200,
    kd: 18,
    cpc: '$2.40',
    intent: 'Commercial',
    aiScore: 98,
    quickWin: true,
    cluster: 'Brand & Trust',
    paa: [
      'Is Equlix a safe trading platform?',
      'What assets can I trade on Equlix?',
      'How does Equlix compare to Zerodha?'
    ]
  },
  {
    keyword: 'best online trading platform for beginners',
    volume: 49000,
    kd: 62,
    cpc: '$8.90',
    intent: 'Commercial',
    aiScore: 84,
    quickWin: false,
    cluster: 'Beginner Traders',
    paa: [
      'Which trading app is best for beginners in India?',
      'Can beginners make money trading online?',
      'What is the minimum deposit for online trading?'
    ]
  },
  {
    keyword: 'secure forex trading platform india',
    volume: 14800,
    kd: 41,
    cpc: '$6.20',
    intent: 'Transactional',
    aiScore: 92,
    quickWin: true,
    cluster: 'Forex Trading',
    paa: [
      'Is forex trading legal in India?',
      'Which platform is safest for forex in 2026?',
      'How to verify if a trading platform is regulated?'
    ]
  },
  {
    keyword: 'crypto trading app with real-time analytics',
    volume: 22600,
    kd: 55,
    cpc: '$9.80',
    intent: 'Commercial',
    aiScore: 88,
    quickWin: false,
    cluster: 'Crypto Trading',
    paa: [
      'Which crypto trading app has the best charts?',
      'How to trade crypto with technical indicators?',
      'Is real-time data free on trading platforms?'
    ]
  },
  {
    keyword: 'stock market trading platform low fees',
    volume: 31400,
    kd: 58,
    cpc: '$7.60',
    intent: 'Commercial',
    aiScore: 80,
    quickWin: false,
    cluster: 'Stock Trading',
    paa: [
      'What are the lowest brokerage fee platforms?',
      'How to compare trading platform fees in India?',
      'Does Equlix charge per trade or monthly?'
    ]
  },
  {
    keyword: 'how to start trading stocks online',
    volume: 68000,
    kd: 38,
    cpc: '$4.10',
    intent: 'Informational',
    aiScore: 95,
    quickWin: true,
    cluster: 'Educational Content',
    paa: [
      'What do I need to open a trading account online?',
      'Is stock trading risky for beginners?',
      'How much money do you need to start stock trading?'
    ]
  },
  {
    keyword: 'cfd trading platform comparison 2026',
    volume: 9200,
    kd: 44,
    cpc: '$11.30',
    intent: 'Commercial',
    aiScore: 90,
    quickWin: true,
    cluster: 'CFD Trading',
    paa: [
      'What is CFD trading and how does it work?',
      'Which CFD broker has the tightest spreads?',
      'Is CFD trading taxed in India?'
    ]
  },
  {
    keyword: 'trading platform with powerful analytics tools',
    volume: 6800,
    kd: 32,
    cpc: '$5.40',
    intent: 'Transactional',
    aiScore: 94,
    quickWin: true,
    cluster: 'Analytics Features',
    paa: [
      'What analytics features should a trading platform have?',
      'Does Equlix offer technical analysis charts?',
      'How to use candlestick charts for trading decisions?'
    ]
  }
];

// equlix.com — Current Search Console Ranking Queries
export const RANKING_QUERIES = [
  {
    query: 'equlix trading platform',
    clicks: 284,
    impressions: 3800,
    ctr: '7.5%',
    position: 1.4,
    change: '+2',
    status: 'Dominating',
    url: '/home',
    recommendation: 'Brand term performing well. Add Organization + FinancialService JSON-LD schema to win rich snippet.'
  },
  {
    query: 'secure trading platform for stocks',
    clicks: 92,
    impressions: 4200,
    ctr: '2.2%',
    position: 8.1,
    change: '+6',
    status: 'Climbing',
    url: '/features',
    recommendation: 'High-intent query with weak CTR. Rewrite meta title to include "100% Secure" and add star rating schema.'
  },
  {
    query: 'online forex trading app india',
    clicks: 68,
    impressions: 5600,
    ctr: '1.2%',
    position: 11.4,
    change: '+9',
    status: 'Quick Win',
    url: '/forex',
    recommendation: 'Position 11.4 with 5.6K impressions — just below top 10! Create dedicated Forex landing page with FAQs.'
  },
  {
    query: 'best crypto trading platform real time',
    clicks: 44,
    impressions: 3100,
    ctr: '1.4%',
    position: 14.8,
    change: '+4',
    status: 'Opportunity',
    url: '/crypto',
    recommendation: 'Add a live crypto price widget and comparison table against Binance/WazirX to strengthen page authority.'
  },
  {
    query: 'equlix app review legit or scam',
    clicks: 62,
    impressions: 2400,
    ctr: '2.6%',
    position: 6.2,
    change: '-3',
    status: 'Needs Refresh',
    url: '/about',
    recommendation: 'Drop detected — reputation query. Add Trustpilot embed, regulatory badges, and client testimonials urgently.'
  },
  {
    query: 'how to start trading for beginners guide',
    clicks: 38,
    impressions: 6800,
    ctr: '0.6%',
    position: 22.3,
    change: '+11',
    status: 'Opportunity',
    url: '/blog',
    recommendation: "Massive 6.8K impressions but low clicks. Write a \"Beginner's Guide to Trading\" pillar post (2500+ words)."
  }
];

// Workflow Templates (relevant to equlix.com growth)
export const WORKFLOW_TEMPLATES = [
  {
    id: 'wf-1',
    name: 'Equlix SEO: Competitor Gap to Published Trading Guide',
    description: 'Detects competitor keyword gaps in forex/crypto SERPs, mines trading questions via Perplexity, writes E-E-A-T compliant guides with Claude, and syncs to Notion CMS pipeline.',
    steps: [
      { id: 'step-1', name: 'Trigger: Competitor Gap Webhook', tool: 'Make', type: 'trigger', status: 'ready', icon: 'zap' },
      { id: 'step-2', name: 'Mine Forex/Crypto SERP & PAA Questions', tool: 'Perplexity', type: 'research', status: 'ready', icon: 'search' },
      { id: 'step-3', name: 'Draft E-E-A-T Trading Guide (Claude)', tool: 'Claude', type: 'ai-write', status: 'ready', icon: 'file-text' },
      { id: 'step-4', name: 'YMYL SEO Audit & Compliance Check', tool: 'Semrush', type: 'seo-audit', status: 'ready', icon: 'check-circle' },
      { id: 'step-5', name: 'Trading Chart Infographic Visuals', tool: 'Midjourney', type: 'media', status: 'ready', icon: 'image' },
      { id: 'step-6', name: 'Notion Editorial Queue & Review', tool: 'Notion', type: 'publish', status: 'ready', icon: 'database' }
    ]
  },
  {
    id: 'wf-2',
    name: 'Weekly Equlix GSC Rank Drop Revamp',
    description: 'Scans equlix.com GSC daily for position drops >2 ranks, extracts the losing trading queries, and generates AI-powered content upgrades with updated market data.',
    steps: [
      { id: 'step-1', name: 'Daily GSC Audit: equlix.com Properties', tool: 'Make', type: 'trigger', status: 'ready', icon: 'clock' },
      { id: 'step-2', name: 'Pull Declining Trading Queries', tool: 'Looker', type: 'analytics', status: 'ready', icon: 'bar-chart' },
      { id: 'step-3', name: 'Regenerate Section with Fresh Market Stats', tool: 'ChatGPT', type: 'ai-write', status: 'ready', icon: 'cpu' },
      { id: 'step-4', name: 'Create Diff Review in Notion', tool: 'Notion', type: 'publish', status: 'ready', icon: 'database' }
    ]
  },
  {
    id: 'wf-3',
    name: 'Equlix Article → Omni-Channel Repurpose',
    description: 'Takes published Equlix trading guides and creates Twitter threads on market insights, LinkedIn carousels for brand trust, and email newsletters for user retention.',
    steps: [
      { id: 'step-1', name: 'New Equlix Blog Post Published', tool: 'Make', type: 'trigger', status: 'ready', icon: 'zap' },
      { id: 'step-2', name: 'Extract Trading Tips & Data Points', tool: 'Claude', type: 'ai-write', status: 'ready', icon: 'file-text' },
      { id: 'step-3', name: 'Generate Twitter Thread & LinkedIn Post', tool: 'ChatGPT', type: 'ai-write', status: 'ready', icon: 'file-text' },
      { id: 'step-4', name: 'Design Trading Visual for Social', tool: 'Midjourney', type: 'media', status: 'ready', icon: 'image' }
    ]
  }
];
