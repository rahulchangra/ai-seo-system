// Authentic Workshop Modal (Matching ₹9 Offer & Ad Creative)
import { WORKSHOP_DETAILS } from '../data/mockData.js';

export function setupWorkshopModal() {
  const modalContainer = document.getElementById('workshopModalContainer');
  if (!modalContainer) return;

  let isBooked = false;
  let attendeeData = null;

  // Render modal HTML
  function render() {
    modalContainer.innerHTML = `
      <div class="modal-backdrop" id="modalBackdrop">
        <div class="modal-dialog">
          <button class="modal-close-btn" id="btnCloseModal">✕</button>

          ${!isBooked ? `
            <!-- Workshop Pitch & Registration -->
            <div class="modal-content-grid">
              <!-- Left: Value Proposition & Details -->
              <div class="modal-left-col">
                <div class="modal-brand-badge">
                  <span class="brand-be10x">be<strong>10x</strong></span>
                  <span class="badge-sub">AI TOOLS WORKSHOP</span>
                </div>

                <h2 class="modal-main-title">Build Your Own <span class="gradient-text">AI SEO SYSTEM ↗</span></h2>
                <p class="modal-tagline">Learn how to connect multiple AI tools into a complete SEO workflow for real results.</p>

                <!-- 3 Highlights from Image -->
                <div class="modal-pills-row">
                  <div class="highlight-pill">
                    <span class="pill-icon">🛠</span>
                    <span>15+ AI Tools</span>
                  </div>
                  <div class="highlight-pill">
                    <span class="pill-icon">💻</span>
                    <span>3-Hour Live Workshop</span>
                  </div>
                  <div class="highlight-pill">
                    <span class="pill-icon">&lt;/&gt;</span>
                    <span>No Coding Required</span>
                  </div>
                </div>

                <!-- Live Countdown Urgency -->
                <div class="modal-urgency-box">
                  <div class="urgency-top">
                    <span class="live-dot pulse"></span>
                    <span class="urgency-text">Next Live Batch: <strong>Sunday, 11:00 AM IST</strong></span>
                  </div>
                  <div class="countdown-timer-display" id="modalCountdown">
                    <span class="time-block">02<small>h</small></span> :
                    <span class="time-block">44<small>m</small></span> :
                    <span class="time-block">18<small>s</small></span>
                    <span class="seats-left-pill">Only 4 seats left at ₹9</span>
                  </div>
                </div>

                <!-- Curriculum Hours -->
                <div class="modal-curriculum">
                  <h4 class="curriculum-title">What You Will Master in 3 Hours:</h4>
                  ${WORKSHOP_DETAILS.curriculum.map(c => `
                    <div class="curriculum-item">
                      <div class="curr-hour-badge">${c.hour}</div>
                      <div>
                        <strong class="curr-title">${c.title}</strong>
                        <ul class="curr-points">
                          ${c.topics.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Free Bonuses Worth ₹14,999 -->
                <div class="modal-bonuses-box">
                  <div class="bonuses-header">
                    <span>🎁 Bonuses Included Free (Worth ₹14,999):</span>
                  </div>
                  <div class="bonuses-list">
                    ${WORKSHOP_DETAILS.bonuses.map(b => `
                      <div class="bonus-tag">
                        <span>✓ ${b.title}</span>
                        <strong class="bonus-val">${b.value}</strong>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Right: Checkout / Fast Registration Card -->
              <div class="modal-right-col">
                <div class="checkout-card">
                  <div class="checkout-price-banner">
                    <div class="price-left">
                      <span class="price-strikethrough">₹1,999</span>
                      <span class="price-final">₹9</span>
                      <span class="price-save">99.5% OFF</span>
                    </div>
                    <div class="price-badge">Instant Access</div>
                  </div>

                  <form class="checkout-form" id="checkoutForm">
                    <div class="form-group">
                      <label class="form-label" for="regName">Full Name</label>
                      <input type="text" id="regName" class="form-control" placeholder="Rahul Sharma" required />
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="regEmail">Work or Personal Email</label>
                      <input type="email" id="regEmail" class="form-control" placeholder="rahul@example.com" required />
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="regPhone">WhatsApp Number (For Ticket & Zoom Link)</label>
                      <input type="tel" id="regPhone" class="form-control" placeholder="+91 98765 43210" required />
                    </div>

                    <div class="payment-method-row">
                      <span class="pay-label">Supported Instant Methods:</span>
                      <div class="pay-icons">
                        <span class="pay-chip">GPay</span>
                        <span class="pay-chip">PhonePe</span>
                        <span class="pay-chip">Paytm</span>
                        <span class="pay-chip">UPI</span>
                        <span class="pay-chip">Cards</span>
                      </div>
                    </div>

                    <button type="submit" class="btn-checkout-cta" id="btnPay">
                      Join 3 Hours AI Tools Workshop For Just ₹9 →
                    </button>

                    <div class="checkout-guarantee">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#00e599"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                      <span>100% Satisfaction Guarantee • Rated 4.9/5 by 48,200+ Professionals</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ` : `
            <!-- Ticket Confirmed State -->
            <div class="ticket-confirmed-view">
              <div class="ticket-conf-header">
                <div class="conf-icon">✓</div>
                <h3>Seat Reserved Successfully!</h3>
                <p>Welcome to the AI SEO System Masterclass. Your admission pass details are below:</p>
              </div>

              <div class="virtual-ticket-card">
                <div class="ticket-header-band">
                  <div class="ticket-brand">be<strong>10x</strong> • AI SEO WORKSHOP</div>
                  <span class="ticket-id">PASS #AI-SEO-${Math.floor(Math.random() * 89999 + 10000)}</span>
                </div>
                <div class="ticket-details-grid">
                  <div>
                    <label>Attendee:</label>
                    <h4>${attendeeData?.name || 'Rahul Sharma'}</h4>
                  </div>
                  <div>
                    <label>Date & Time:</label>
                    <h4>Sunday, 11:00 AM IST</h4>
                  </div>
                  <div>
                    <label>Format:</label>
                    <h4>Interactive 3-Hour Live Zoom Session</h4>
                  </div>
                  <div>
                    <label>Status:</label>
                    <span class="ticket-status-confirmed">CONFIRMED (₹9 Paid)</span>
                  </div>
                </div>
                <div class="ticket-footer">
                  <div class="ticket-qr-placeholder">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="#ffffff"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 5h2v2h-2v-2zm5 2h3v2h-3v-2zm-3-5h2v2h-2v-2zm-2 5h2v2h-2v-2zm5-2h2v2h-2v-2z"/></svg>
                    <span>Scan at Check-In</span>
                  </div>
                  <div class="ticket-bonuses-ready">
                    <p>✓ All 3 Bonuses unlocked in your inbox (${attendeeData?.email || 'email'}).</p>
                    <button class="btn-cal-add" id="btnAddCalendar">📅 Add to Google Calendar</button>
                  </div>
                </div>
              </div>

              <button class="btn-outline-back" id="btnBackToApp">
                ← Return to AI SEO Dashboard
              </button>
            </div>
          `}
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const backdrop = modalContainer.querySelector('#modalBackdrop');
    const closeBtn = modalContainer.querySelector('#btnCloseModal');

    const closeModal = () => {
      modalContainer.classList.remove('is-open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    const form = modalContainer.querySelector('#checkoutForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = modalContainer.querySelector('#regName').value;
        const email = modalContainer.querySelector('#regEmail').value;
        const phone = modalContainer.querySelector('#regPhone').value;

        const payBtn = modalContainer.querySelector('#btnPay');
        payBtn.disabled = true;
        payBtn.innerHTML = `
          <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          Processing ₹9 via UPI Gateway...
        `;

        setTimeout(() => {
          attendeeData = { name, email, phone };
          isBooked = true;
          render();
          showToast(`Seat booked! Confirmation sent to ${email} & WhatsApp.`);
        }, 1200);
      });
    }

    const backBtn = modalContainer.querySelector('#btnBackToApp');
    if (backBtn) {
      backBtn.addEventListener('click', closeModal);
    }

    const calBtn = modalContainer.querySelector('#btnAddCalendar');
    if (calBtn) {
      calBtn.addEventListener('click', () => {
        const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Build+Your+Own+AI+SEO+System+Workshop&details=3-Hour+Live+Workshop+covering+ChatGPT,+Claude,+Perplexity,+Make+and+Google+Search+Console&location=Zoom`;
        window.open(calUrl, '_blank');
      });
    }
  }

  function showToast(msg) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg } }));
  }

  // Open modal trigger
  window.addEventListener('open-workshop-modal', () => {
    isBooked = false;
    render();
    modalContainer.classList.add('is-open');
  });

  render();
}
