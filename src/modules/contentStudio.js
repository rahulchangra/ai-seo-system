// Pillar 2: Create Better Content - AI Writing Studio & Live SEO Auditor
export function renderContentStudio(containerId, initialKeyword = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  let currentKeyword = initialKeyword || 'how to build ai seo system';
  let selectedModel = 'claude';
  let contentType = 'pillar';
  let isGenerating = false;
  let activeRepurposeTab = 'twitter';
  let activeViewTab = 'content'; // 'content' | 'serp' | 'schema'

  // Generated article state
  let articleData = generateArticleContent(currentKeyword);

  function render() {
    container.innerHTML = `
      <div class="pillar-workspace">
        <!-- Pillar Header -->
        <div class="pillar-top-header">
          <div class="pillar-title-block">
            <div class="pillar-badge pillar-badge-blue">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              Pillar 02 • Content Generation & Audit
            </div>
            <h2 class="pillar-heading">AI Content Studio & SEO Auditor</h2>
            <p class="pillar-subheading">Generate authoritative E-E-A-T pillar articles with Claude 3.5 & GPT-4o, audit keyword densities in real-time, and repurpose for social channels.</p>
          </div>

          <div class="model-selector-pills">
            <button class="model-pill ${selectedModel === 'claude' ? 'is-active' : ''}" data-model="claude">
              <span class="model-dot claude"></span> Claude 3.5 Sonnet
            </button>
            <button class="model-pill ${selectedModel === 'chatgpt' ? 'is-active' : ''}" data-model="chatgpt">
              <span class="model-dot chatgpt"></span> GPT-4o
            </button>
            <button class="model-pill ${selectedModel === 'perplexity' ? 'is-active' : ''}" data-model="perplexity">
              <span class="model-dot perplexity"></span> Perplexity Sonnet
            </button>
          </div>
        </div>

        <!-- Studio Two-Column Grid: Config & Live Editor + SEO Score -->
        <div class="studio-main-grid">
          <!-- Left Column: Controls & Configuration -->
          <div class="studio-sidebar-panel">
            <div class="panel-section-card">
              <h4 class="panel-card-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Article Configuration
              </h4>

              <div class="form-group">
                <label class="form-label" for="studioKeywordInput">Primary Target Keyword</label>
                <div class="input-with-action">
                  <input type="text" id="studioKeywordInput" class="form-control" value="${currentKeyword}" placeholder="Enter primary keyword..." />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Article Format</label>
                <select id="selContentType" class="form-control">
                  <option value="pillar" ${contentType === 'pillar' ? 'selected' : ''}>Comprehensive Pillar Guide (~2,500 words)</option>
                  <option value="howto" ${contentType === 'howto' ? 'selected' : ''}>Actionable How-To Breakdown (~1,500 words)</option>
                  <option value="comparison" ${contentType === 'comparison' ? 'selected' : ''}>Product & Stack Comparison vs (~2,000 words)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Tone & Persona</label>
                <div class="tone-toggle-row">
                  <button class="tone-btn is-active" data-tone="authoritative">Authoritative</button>
                  <button class="tone-btn" data-tone="conversational">Conversational</button>
                  <button class="tone-btn" data-tone="technical">Technical</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Semantic Entities Injected</label>
                <div class="entity-tags-box" id="entityTagsBox">
                  <span class="entity-tag">Make.com automation</span>
                  <span class="entity-tag">Google Search Console</span>
                  <span class="entity-tag">Claude 3.5</span>
                  <span class="entity-tag">Topic Clusters</span>
                  <span class="entity-tag">E-E-A-T score</span>
                </div>
              </div>

              <button class="btn-generate-article" id="btnGenerateArticle" ${isGenerating ? 'disabled' : ''}>
                ${isGenerating ? `
                  <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Writing with ${selectedModel === 'claude' ? 'Claude 3.5' : 'GPT-4o'}...
                ` : `
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Generate AI SEO Article
                `}
              </button>
            </div>

            <!-- Real-time SEO Score Card -->
            <div class="panel-section-card seo-score-card">
              <div class="score-card-header">
                <div>
                  <div class="score-card-label">Live Content Score</div>
                  <h3 class="score-card-grade">Rank-Ready • Grade A+</h3>
                </div>
                <div class="score-circle-display">
                  <span class="score-circle-val">${articleData.score}</span>
                  <span class="score-circle-sub">/100</span>
                </div>
              </div>

              <div class="score-checklist">
                <div class="check-item passed">
                  <span class="check-icon">✓</span>
                  <span class="check-text">Keyword in H1 & Meta Title</span>
                  <span class="check-badge">Optimal</span>
                </div>
                <div class="check-item passed">
                  <span class="check-icon">✓</span>
                  <span class="check-text">Keyword Density: 1.42%</span>
                  <span class="check-badge">18 mentions</span>
                </div>
                <div class="check-item passed">
                  <span class="check-icon">✓</span>
                  <span class="check-text">Heading Structure: H1, 4x H2, 8x H3</span>
                  <span class="check-badge">Passed</span>
                </div>
                <div class="check-item passed">
                  <span class="check-icon">✓</span>
                  <span class="check-text">Readability: Flesch 74.8 (Engaging)</span>
                  <span class="check-badge">Grade 8</span>
                </div>
                <div class="check-item passed">
                  <span class="check-icon">✓</span>
                  <span class="check-text">Google AI Overview Citation Schema</span>
                  <span class="check-badge">Injected</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Content Output & Repurposing Engine -->
          <div class="studio-content-panel">
            <div class="content-view-tabs-header">
              <div class="view-tabs-left">
                <button class="view-tab-btn ${activeViewTab === 'content' ? 'is-active' : ''}" data-view="content">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/></svg>
                  Full Article
                </button>
                <button class="view-tab-btn ${activeViewTab === 'serp' ? 'is-active' : ''}" data-view="serp">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  SERP Snippet Preview
                </button>
                <button class="view-tab-btn ${activeViewTab === 'schema' ? 'is-active' : ''}" data-view="schema">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  JSON-LD Schema
                </button>
              </div>

              <div class="view-tabs-right">
                <button class="btn-tool-action" id="btnPushNotion" title="Send directly to Notion Database">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Push to Notion
                </button>
                <button class="btn-tool-action" id="btnCopyArticle" title="Copy markdown to clipboard">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy MD
                </button>
                <button class="btn-tool-action" id="btnDownloadArticle" title="Download markdown file">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </button>
              </div>
            </div>

            <!-- Tab 1: Full Article View (Editable canvas!) -->
            ${activeViewTab === 'content' ? `
              <div class="article-reader-card">
                <div class="article-meta-bar">
                  <span class="meta-pill">Target: <strong>${currentKeyword}</strong></span>
                  <span class="meta-pill">Length: <strong>2,480 words</strong></span>
                  <span class="meta-pill">Read Time: <strong>9 min</strong></span>
                  <span class="meta-pill-model">${selectedModel === 'claude' ? 'Claude 3.5 Sonnet' : 'GPT-4o'} Powered</span>
                </div>

                <div class="article-content-body" id="articleBody">
                  <h1 class="art-h1" contenteditable="true" id="artTitleEditor">${articleData.title}</h1>
                  
                  <div class="art-key-takeaways">
                    <div class="takeaways-header">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#ff2e93"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <strong>Executive Summary & Quick Takeaways (Google AI Overview Optimized)</strong>
                    </div>
                    <ul>
                      <li>An AI SEO System coordinates keyword intent, neural generative synthesis, structured schema markup, and Google Search Console rank tracking.</li>
                      <li>Using Claude 3.5 Sonnet for long-form drafting eliminates generic robotic phrasing, maximizing real engagement and lower bounce rates.</li>
                      <li>Automation orchestrators like Make.com eliminate manual publishing bottlenecks by syncing directly with Notion databases and CMS endpoints.</li>
                    </ul>
                  </div>

                  <p class="art-p" contenteditable="true">${articleData.intro}</p>

                  <h2 class="art-h2">1. The 8-Tool Modern AI SEO Stack Architecture</h2>
                  <p class="art-p">Traditional SEO relies on fragmented point solutions. The modern AI SEO framework combines 8 specialized engines into an autonomous pipeline:</p>
                  
                  <div class="art-stack-comparison-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Engine</th>
                          <th>Role in Pipeline</th>
                          <th>Primary Output</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Perplexity Sonnet</strong></td>
                          <td>SERP & Real-Time Research</td>
                          <td>Extracts sources cited by Google AI Overviews</td>
                        </tr>
                        <tr>
                          <td><strong>Claude 3.5 Sonnet</strong></td>
                          <td>Long-Form Drafting</td>
                          <td>Authoritative prose cadence and human-grade entity depth</td>
                        </tr>
                        <tr>
                          <td><strong>Semrush</strong></td>
                          <td>KD & Competitor Overlap</td>
                          <td>Identifies low-hanging fruit and SERP difficulty</td>
                        </tr>
                        <tr>
                          <td><strong>Make.com</strong></td>
                          <td>Webhook Orchestration</td>
                          <td>Coordinates API payloads across systems on autopilot</td>
                        </tr>
                        <tr>
                          <td><strong>Notion Database</strong></td>
                          <td>Editorial Queue</td>
                          <td>Stores drafts, metadata, and publication statuses</td>
                        </tr>
                        <tr>
                          <td><strong>Looker Studio / GSC</strong></td>
                          <td>Performance Tracking</td>
                          <td>Monitors CTR inflection points and page decay</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 class="art-h2">2. Step-by-Step Implementation Pipeline</h2>
                  <p class="art-p">To build this system yourself without writing custom backend code, deploy this three-stage pipeline:</p>
                  
                  <h3 class="art-h3">Stage 2.1: Semantic Intent Mining with Perplexity</h3>
                  <p class="art-p">Query target search intent using Google AI Overview citation formulas. High-probability target queries have structured comparison vectors, implementation guides, and procedural frameworks.</p>

                  <h3 class="art-h3">Stage 2.2: Dual-Pass Drafting with Claude 3.5</h3>
                  <p class="art-p">Prompt Claude with strict structural directives: include entity definitions in paragraph one, embed bulleted key takeaways, and ensure every section addresses an explicit user pain point.</p>

                  <h2 class="art-h2">3. Frequently Asked Questions</h2>
                  <div class="art-faq-box">
                    <div class="faq-q">Q: How does Google evaluate AI generated content in 2026?</div>
                    <div class="faq-a">A: Google assesses content on human helpfulness and E-E-A-T rather than generation method. Unique insights, data accuracy, and practical utility outrank generic boilerplate.</div>
                    
                    <div class="faq-q">Q: What is the API compute cost per 2,500 word article?</div>
                    <div class="faq-a">A: Using API pay-as-you-go models, generating an in-depth article with Claude 3.5 Sonnet costs approximately $0.08 in tokens.</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Tab 2: SERP Snippet Preview -->
            ${activeViewTab === 'serp' ? `
              <div class="serp-preview-card">
                <h4 class="serp-card-title">Google SERP Snippet Preview</h4>
                <div class="serp-google-box">
                  <div class="serp-url-row">
                    <span class="serp-favicon">🌐</span>
                    <span class="serp-domain">https://nexusgrowth.io</span>
                    <span class="serp-breadcrumb"> › blog › ai-seo</span>
                  </div>
                  <h3 class="serp-headline">${articleData.title}</h3>
                  <p class="serp-desc">${articleData.metaDesc}</p>
                </div>

                <div class="serp-character-stats">
                  <div class="char-stat">
                    <span>Title Length:</span>
                    <strong>${articleData.title.length} / 60 chars</strong>
                    <span class="status-chip optimal">Optimal</span>
                  </div>
                  <div class="char-stat">
                    <span>Meta Description:</span>
                    <strong>${articleData.metaDesc.length} / 160 chars</strong>
                    <span class="status-chip optimal">Optimal</span>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Tab 3: JSON-LD Schema -->
            ${activeViewTab === 'schema' ? `
              <div class="schema-code-card">
                <div class="schema-code-header">
                  <span>Structured Data (Article + FAQPage Schema)</span>
                  <button class="btn-copy-code" id="btnCopySchema">Copy Schema</button>
                </div>
                <pre class="schema-code-pre"><code>${escapeHtml(articleData.schemaJson)}</code></pre>
              </div>
            ` : ''}

            <!-- Multi-Channel Repurposing Section -->
            <div class="repurposing-engine-card">
              <div class="repurpose-header">
                <div class="repurpose-title-group">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff2a85" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  <h4>1-Click Omni-Channel Repurposing Engine</h4>
                </div>
                <span class="repurpose-badge">Automated Extraction</span>
              </div>

              <div class="repurpose-nav-tabs">
                <button class="repurpose-nav-btn ${activeRepurposeTab === 'twitter' ? 'is-active' : ''}" data-repurpose="twitter">
                  🧵 X / Twitter Viral Thread (5 Tweets)
                </button>
                <button class="repurpose-nav-btn ${activeRepurposeTab === 'linkedin' ? 'is-active' : ''}" data-repurpose="linkedin">
                  💼 LinkedIn Authority Post
                </button>
                <button class="repurpose-nav-btn ${activeRepurposeTab === 'newsletter' ? 'is-active' : ''}" data-repurpose="newsletter">
                  📩 Email Newsletter
                </button>
                <button class="repurpose-nav-btn ${activeRepurposeTab === 'midjourney' ? 'is-active' : ''}" data-repurpose="midjourney">
                  🎨 Midjourney Art Prompt
                </button>
              </div>

              <div class="repurpose-output-box">
                <div class="output-top-bar">
                  <span class="output-platform-badge">${getRepurposePlatformTitle(activeRepurposeTab)}</span>
                  <button class="btn-copy-repurpose" id="btnCopyRepurpose">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy to Clipboard
                  </button>
                </div>
                <div class="repurpose-text-display" id="repurposeTextDisplay">
                  ${articleData.repurposed[activeRepurposeTab]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function getRepurposePlatformTitle(tab) {
    if (tab === 'twitter') return 'X / Twitter Thread';
    if (tab === 'linkedin') return 'LinkedIn Long-Form Post';
    if (tab === 'newsletter') return 'Newsletter Edition';
    return 'Midjourney v6.1 Visual Prompt';
  }

  function generateArticleContent(kw) {
    const formattedKw = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${formattedKw}: The 2026 Autonomous SEO Architecture`,
      metaDesc: `Build an autonomous AI SEO system using ChatGPT, Claude, Perplexity & Make. Step-by-step workflow with zero coding required.`,
      score: 96,
      intro: `Modern search engine algorithms, powered by multimodal LLMs and Google AI Overviews, reward comprehensive information gain and authoritative topical breadth. This system architecture demonstrates how to connect modern generative models with automated SERP intelligence to publish high-ranking content at 10x velocity.`,
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "headline": `${formattedKw}: The 2026 Autonomous SEO Architecture`,
            "author": { "@type": "Person", "name": "AI SEO System Admin" },
            "datePublished": "2026-10-11T02:00:00+00:00",
            "publisher": { "@type": "Organization", "name": "Nexus Growth" }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does Google evaluate AI generated content in 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Google assesses content on helpfulness, accuracy, and E-E-A-T rather than generation method."
                }
              }
            ]
          }
        ]
      }, null, 2),
      repurposed: {
        twitter: `1/5 Most people think AI SEO is just spamming generic ChatGPT articles.\n\nThat's why 95% of sites saw traffic decay this year.\n\nHere is how we built an autonomous 8-tool AI SEO stack that drives 94.4K Google impressions without manual bottlenecks: 🧵👇\n\n2/5 🔎 Perplexity Sonnet for Live Intent:\nWe query live search to map Google AI Overview citation targets.\n\n3/5 ✍️ Claude 3.5 Sonnet for Depth:\nClaude writes with natural human cadence and zero repetitive filler.\n\n4/5 ⚙️ Make.com for Webhooks:\nEvery completed draft syncs automatically to Notion and CMS backends.\n\n5/5 Set up your own stack in the Workflow Automator tab! 🚀`,
        linkedin: `94,400 Google Impressions in 90 Days.\n\nZero outsourced agencies.\nZero manual copy-pasting.\n\nHere is what changed in our organic growth engine:\n\nMost teams treat AI like a glorified copywriter. The real winners build connected AI SEO Systems:\n\n1. Perplexity for real-time SERP gap intelligence\n2. Claude 3.5 Sonnet for natural, authoritative prose\n3. Semrush for keyword difficulty and backlink vectors\n4. Make.com + Notion for full workflow automation\n5. Looker Studio + Google Search Console for live CTR optimization\n\nWhen these tools communicate via webhooks, your content velocity multiplies 10x with zero quality degradation.`,
        newsletter: `Subject: Inside our Autonomous AI SEO Stack (94.4K Impressions Breakdown) 📈\n\nHey Reader,\n\nOver the last 90 days, we deployed an autonomous AI SEO stack connecting ChatGPT, Claude 3.5, Perplexity, and Make.com.\n\nThe results?\n- 94.4K Total Impressions (+71% MoM)\n- 3.1K Clicks\n- Average ranking position jumped from 24.8 to 8.2\n\nInside this week's guide, we walk through the exact Make.com blueprints and prompts to replicate this system for your own site.\n\n[Explore the Full Guide →]`,
        midjourney: `/imagine prompt: high-tech futuristic holographic digital dashboard displaying glowing cybernetic Google Search Console analytics charts, upward trending purple laser graphs, connected neural nodes labeled with AI icons, sleek glassmorphism UI, volumetric cinematic lighting, 8k resolution, octane render --ar 16:9 --style raw --v 6.1`
      }
    };
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindEvents() {
    container.querySelectorAll('.model-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        selectedModel = pill.dataset.model;
        render();
      });
    });

    container.querySelectorAll('.tone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });

    container.querySelectorAll('.view-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        activeViewTab = tab.dataset.view;
        render();
      });
    });

    container.querySelectorAll('.repurpose-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeRepurposeTab = btn.dataset.repurpose;
        render();
      });
    });

    const kwInput = container.querySelector('#studioKeywordInput');
    const genBtn = container.querySelector('#btnGenerateArticle');

    if (genBtn) {
      genBtn.addEventListener('click', () => {
        const kw = kwInput.value.trim() || 'how to build ai seo system';
        currentKeyword = kw;
        isGenerating = true;
        render();

        setTimeout(() => {
          articleData = generateArticleContent(kw);
          isGenerating = false;
          render();
          showToast(`Generated complete SEO article for "${kw}"!`);
        }, 1100);
      });
    }

    const pushNotionBtn = container.querySelector('#btnPushNotion');
    if (pushNotionBtn) {
      pushNotionBtn.addEventListener('click', () => {
        pushNotionBtn.disabled = true;
        pushNotionBtn.textContent = 'Pushing to Notion...';
        setTimeout(() => {
          pushNotionBtn.disabled = false;
          pushNotionBtn.innerHTML = `✓ Synced to Notion Database`;
          showToast(`Draft "${articleData.title.slice(0, 30)}..." pushed to Notion Editorial Queue!`);
          setTimeout(() => {
            pushNotionBtn.textContent = 'Push to Notion';
          }, 3000);
        }, 900);
      });
    }

    const copyBtn = container.querySelector('#btnCopyArticle');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = `# ${articleData.title}\n\n${articleData.intro}\n\nTarget Keyword: ${currentKeyword}\nSEO Score: ${articleData.score}/100`;
        navigator.clipboard.writeText(text);
        showToast('Article copied to clipboard as Markdown!');
      });
    }

    const downloadBtn = container.querySelector('#btnDownloadArticle');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const text = `# ${articleData.title}\n\n${articleData.intro}\n\nGenerated via AI SEO System`;
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentKeyword.replace(/\s+/g, '_')}_article.md`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Article downloaded as .md file!');
      });
    }

    const copyRepurposeBtn = container.querySelector('#btnCopyRepurpose');
    if (copyRepurposeBtn) {
      copyRepurposeBtn.addEventListener('click', () => {
        const text = articleData.repurposed[activeRepurposeTab];
        navigator.clipboard.writeText(text);
        showToast(`Copied ${getRepurposePlatformTitle(activeRepurposeTab)} to clipboard!`);
      });
    }

    const copySchemaBtn = container.querySelector('#btnCopySchema');
    if (copySchemaBtn) {
      copySchemaBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(articleData.schemaJson);
        showToast('JSON-LD Schema copied to clipboard!');
      });
    }
  }

  function showToast(msg) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg } }));
  }

  render();
}
