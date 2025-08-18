// Simple quiz engine
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

let current = 0;
let answers = {};
let grouped = []; // indexes of each step group for progress segments
let stepSize = 0;

function chunkIntoSteps(total, steps=4){
  const per = Math.ceil(total/steps);
  const groups = [];
  for(let i=0;i<steps;i++){
    const start = i*per;
    const end = Math.min(start+per-1, total-1);
    groups.push([start, end]);
  }
  return groups;
}

function setProgress(){
  const segs = $$('#progress4 .seg .fill');
  const [start,end] = grouped.find(g => current >= g[0] && current <= g[1]) || grouped[grouped.length-1];
  const segIndex = grouped.findIndex(g => current >= g[0] && current <= g[1]);
  segs.forEach((el,i)=>{
    if(i < segIndex){
      el.style.setProperty('--p', '100%');
    }else if(i === segIndex){
      const span = (current - start) / (Math.max(1, end - start + 1));
      el.style.setProperty('--p', `${Math.min(100, Math.round(span*100))}%`);
    }else{
      el.style.setProperty('--p', '0%');
    }
  });
}

function renderQuestion(){
  const q = QUESTIONS[current];
  const wrap = $('#question-wrap');
  
  // Hide Next button immediately when quiz starts
  const actionsElement = document.querySelector('.actions');
  if (actionsElement) {
    actionsElement.classList.add('quiz-mode');
  }
  
  wrap.innerHTML = `
    <div class="q-title">${q.title}</div>
    <div class="options">
      ${q.options.map(opt => `
        <div class="option" data-value="${opt.value}">${opt.label}</div>
      `).join('')}
    </div>
  `;

  // Event delegation fix (handles first click reliably)
  wrap.querySelector('.options').addEventListener('click', (e)=>{
    const tile = e.target.closest('.option');
    if(!tile) return;
    const val = tile.dataset.value;
    if(q.multi){
      tile.classList.toggle('selected');
      const selected = [...wrap.querySelectorAll('.option.selected')].map(n=>n.dataset.value);
      answers[q.key] = selected;
      // Auto-advance for multi-select after selection
      if(selected.length > 0) {
        setTimeout(() => next(), 800); // 800ms delay for selection animation
      }
    }else{
      wrap.querySelectorAll('.option').forEach(n=>n.classList.remove('selected'));
      tile.classList.add('selected');
      answers[q.key] = val;
      // Auto-advance for single-select immediately
      setTimeout(() => next(), 600); // 600ms delay for selection animation
    }
  }, { once:false });
  setProgress();
}

function showResults(){
  $('#quiz-card').classList.add('hidden');
  $('#results').classList.remove('hidden');
  
  // Save answers to localStorage for results page
  try {
    localStorage.setItem('hm_answers', JSON.stringify(answers));
  } catch (error) {
    console.error('Error saving answers:', error);
  }
  
  // Hide the hero taglines on results screen
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.display = 'none';
  }

  // Build calc bars (5 rows, different colors, animate sequentially)
  const rows = [
    {label:'Analyzing your background', color:['#C9A86A','#E0C27B']},
    {label:'Matching remote paths', color:['#E0C27B','#A67C2E']},
    {label:'Estimating earnings ceiling', color:['#A67C2E','#C9A86A']},
    {label:'Preparing step-by-step plan', color:['#C9A86A','#E0C27B']},
    {label:'Finalizing recommendations', color:['#E0C27B','#A67C2E']},
  ];
  const perf = document.getElementById('calc-bars');
  perf.innerHTML = rows.map((r,i)=>`
      <div class="calc-row">
        <div class="label">${r.label}</div>
        <div class="track"><div class="bar" id="bar${i}"></div></div>
        <div class="pct" id="pct${i}">0%</div>
      </div>
  `).join('');
  // animate each row sequentially
  rows.forEach((r,i)=>{
    const bar = document.getElementById('bar'+i);
    const pct = document.getElementById('pct'+i);
    // gradient background
    bar.style.background = `linear-gradient(90deg, ${r.color[0]}, ${r.color[1]})`;
    let p = 0;
    setTimeout(()=>{
      const t = setInterval(()=>{
        p += 2 + Math.random()*2;
        if(p>=100){p=100; clearInterval(t); if(i===rows.length-1){ showPaywall(); } }
        bar.style.width = p+'%';
        pct.textContent = Math.round(p)+'%';
      }, 25);
    }, 450*i);
  });
}

function showPaywall(){
  // After a short pause, move to paywall
  setTimeout(()=>{
    $('#results').classList.add('hidden');
    $('#paywall').classList.remove('hidden');
  }, 600);
}

function init(){
  // Ensure first question is age (even if questions.js was edited)
  const ageIndex = QUESTIONS.findIndex(q => q.key==='age');
  if(ageIndex > 0){
    const [ageQ] = QUESTIONS.splice(ageIndex,1);
    QUESTIONS.unshift(ageQ);
  }
  grouped = chunkIntoSteps(QUESTIONS.length, 4);
  renderQuestion();

  $('#payBtn').addEventListener('click', ()=>{
    // Navigate to Stripe Payment Link
    window.location.href = 'https://buy.stripe.com/test_4gM5kC40A7Ju8IH7Ws7N600';
  });
}

document.addEventListener('DOMContentLoaded', init);

/* Animated counter and enhanced quiz functionality */
let joinedCount = 1000;
let counterInterval;

// Animated counter for "joined today"
let counterTimer = null; // Global timer reference to prevent duplicates

function startJoinedCounter(){
  // Clear any existing timer
  if (counterTimer) {
    clearTimeout(counterTimer);
    counterTimer = null;
  }
  
  const counter = document.getElementById('joinedCounter');
  if(!counter) return;
  
  let current = 1000;
  const maxTarget = 1120; // Increased cap for better visual flow
  
  const updateCounter = () => {
    const increment = Math.floor(Math.random() * 8) + 2; // Random +2 to +9
    current += increment;
    
    if(current >= maxTarget) {
      // Soft reset near 1000 (no big visual jump)
      current = 1000 + Math.floor(Math.random() * 20);
    }
    
    counter.textContent = current.toLocaleString() + '+';
    
    // Trigger glow pulse animation
    triggerCounterGlow();
    
    // Random interval between 3-4 seconds (3000-4000ms)
    const nextInterval = Math.floor(Math.random() * 1000) + 3000;
    counterTimer = setTimeout(updateCounter, nextInterval);
  };
  
  updateCounter();
}

// Money rain animation
function triggerMoneyRain() {
  const container = document.createElement('div');
  container.className = 'money-rain';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;
  
  document.body.appendChild(container);
  
  // Create more dollar bills than diamonds (70% dollars, 30% diamonds)
  const totalParticles = 80;
  const dollarCount = Math.floor(totalParticles * 0.7);
  const diamondCount = totalParticles - dollarCount;
  
  for (let i = 0; i < totalParticles; i++) {
    const particle = document.createElement('div');
    const isDollar = i < dollarCount;
    particle.textContent = isDollar ? '💵' : '💎';
    particle.style.cssText = `
      position: absolute;
      font-size: ${isDollar ? '24px' : '20px'};
      left: ${Math.random() * 100}%;
      top: -50px;
      animation: moneyFall ${Math.random() * 2 + 4}s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    
    // Add slight spin to some items
    if (Math.random() > 0.5) {
      particle.style.animation += `, moneySpin ${Math.random() * 2 + 1}s linear infinite`;
    }
    
    container.appendChild(particle);
  }
  
  // Extended cleanup duration (+2 seconds)
  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 6000); // Extended from 4000ms to 6000ms
}

// Social proof count-up animation
function animateSocialProof() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show final number immediately for users who prefer reduced motion
    const numberElement = document.getElementById('socialProofNumber');
    if (numberElement) {
      numberElement.textContent = '285,000';
    }
    return;
  }
  
  const startNumber = 284920;
  const endNumber = 285000;
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth ease-out
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentNumber = Math.floor(startNumber + (endNumber - startNumber) * easeOutProgress);
    
    const numberElement = document.getElementById('socialProofNumber');
    if (numberElement) {
      numberElement.textContent = currentNumber.toLocaleString('en-US');
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Premium results session validation and display
function checkPremiumResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (sessionId) {
    // User has a valid session, show premium results
    showPremiumResults(sessionId);
  } else {
    // No session, redirect to quiz or show message
    handleNoSession();
  }
}

function showPremiumResults(sessionId) {
  // Hide all other sections
  document.getElementById('quiz-card').classList.add('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('paywall').classList.add('hidden');
  
  // Show premium results
  const premiumResults = document.getElementById('premium-results');
  premiumResults.classList.remove('hidden');
  
  // Update personalized title
  const name = localStorage.getItem('hm_name') || 'friend';
  const titleElement = document.getElementById('premiumResultsTitle');
  if (titleElement) {
    titleElement.textContent = `${name.charAt(0).toUpperCase() + name.slice(1)}, your remote income plan is ready`;
  }
  
  // Set up premium CTA link with session_id
  const ctaLink = document.getElementById('premiumCtaLink');
  if (ctaLink) {
    // For now, use a placeholder URL - will be wired to actual premium portal
    ctaLink.href = `/claim?session_id=${sessionId}`;
  }
  
  // Start social proof count-up animation
  setTimeout(() => {
    animatePremiumSocialProof();
  }, 300);
}

function animatePremiumSocialProof() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show final number immediately for users who prefer reduced motion
    const numberElement = document.getElementById('premiumSocialProofNumber');
    if (numberElement) {
      numberElement.textContent = '285,000';
    }
    return;
  }
  
  const startNumber = 284920;
  const endNumber = 285000;
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth ease-out
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentNumber = Math.floor(startNumber + (endNumber - startNumber) * easeOutProgress);
    
    const numberElement = document.getElementById('premiumSocialProofNumber');
    if (numberElement) {
      numberElement.textContent = currentNumber.toLocaleString('en-US');
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

function handleNoSession() {
  // Hide premium results if somehow visible
  document.getElementById('premium-results').classList.add('hidden');
  
  // Show quiz card if not already visible
  if (document.getElementById('quiz-card').classList.contains('hidden')) {
    document.getElementById('quiz-card').classList.remove('hidden');
  }
  
  // Could add a small message here if needed
  console.log('No valid session found, showing quiz');
}

// Handle return from successful Stripe payment
function checkPaidReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const isPaid = urlParams.get('paid');
  
  if (isPaid === '1') {
    // User has successfully paid, show results immediately
    showPaidResults();
  }
}

function showPaidResults() {
  // Hide paywall and quiz sections
  document.getElementById('quiz-card').classList.add('hidden');
  document.getElementById('paywall').classList.add('hidden');
  
  // Show results section
  const resultsSection = document.getElementById('results');
  resultsSection.classList.remove('hidden');
  
  // Smooth scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Trigger existing celebration animations
  setTimeout(() => {
    // Start the existing results animation sequence
    const rows = [
      {label:'Analyzing your background', color:['#C9A86A','#E0C27B']},
      {label:'Matching remote paths', color:['#E0C27B','#A67C2E']},
      {label:'Estimating earnings ceiling', color:['#A67C2E','#C9A86A']},
      {label:'Preparing step-by-step plan', color:['#C9A86A','#E0C27B']},
      {label:'Finalizing recommendations', color:['#E0C27B','#A67C2E']},
    ];
    const perf = document.getElementById('calc-bars');
    perf.innerHTML = rows.map((r,i)=>`
        <div class="calc-row">
          <div class="label">${r.label}</div>
          <div class="track"><div class="bar" id="bar${i}"></div></div>
          <div class="pct" id="pct${i}">0%</div>
        </div>
    `).join('');
    
    // Animate each row sequentially
    rows.forEach((r,i)=>{
      const bar = document.getElementById('bar'+i);
      const pct = document.getElementById('pct'+i);
      bar.style.background = `linear-gradient(90deg, ${r.color[0]}, ${r.color[1]})`;
      let p = 0;
      setTimeout(()=>{
        const t = setInterval(()=>{
          p += 2 + Math.random()*2;
          if(p>=100){p=100; clearInterval(t); if(i===rows.length-1){ showPaywall(); } }
          bar.style.width = p+'%';
          pct.textContent = Math.round(p)+'%';
        }, 25);
      }, 450*i);
    });
  }, 100);
}

// Enhanced showPaywall with money rain
const originalShowPaywall = showPaywall;
function showPaywall() {
  // After a short pause, move to paywall
  setTimeout(() => {
    $('#results').classList.add('hidden');
    $('#paywall').classList.remove('hidden');
    
    // Update title with personalized name
    updatePaywallTitle();
    
    // Trigger money rain
    triggerMoneyRain();
    
    // Start social proof count-up animation
    setTimeout(() => {
      animateSocialProof();
    }, 800);
  }, 600);
}

// Override original showPaywall
window.showPaywall = showPaywall;



// Simple auto-advance setup - minimal and safe
function setupAutoAdvance() {
  // Wait for quiz to be ready
  setTimeout(() => {
    const wrap = document.getElementById('question-wrap');
    if (!wrap) return;
    
    // Add click handler to options container
    wrap.addEventListener('click', (e) => {
      const option = e.target.closest('.option');
      if (!option) return;
      
      // Wait for selection to complete, then auto-advance
      setTimeout(() => {
        const selected = wrap.querySelector('.option.selected');
        if (selected) {
          // Add ripple effect
          selected.classList.add('ripple');
          setTimeout(() => selected.classList.remove('ripple'), 300);
          
          // Auto-advance after effect
          setTimeout(() => {
            if (typeof next === 'function') {
              next();
            }
          }, 200);
        }
      }, 100);
    });
    
    // Keyboard support
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const option = e.target.closest('.option');
        if (option) {
          option.click();
        }
      }
    });
  }, 300);
}

// Initialize enhanced functionality
function initEnhanced() {
  // Start the joined counter
  startJoinedCounter();
  
  // Set up auto-advance
  setupAutoAdvance();
  
  // Hide Next button during quiz (add quiz-mode class)
  setTimeout(() => {
    const actionsElement = document.querySelector('.actions');
    if (actionsElement) {
      actionsElement.classList.add('quiz-mode');
    }
  }, 1000);
  
  // Check if user is returning from successful payment
  checkPremiumResults();
  
  // Check if user is returning from Stripe payment
  checkPaidReturn();
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', initEnhanced);

/* HM popups and personalization system */
const HM_FACTS = [
  "Creators who post 3–5 times per week grow 2–4× faster in the first 30 days.",
  "Sticking to 1–2 clear topics builds authority and can triple conversions.",
  "Simple short-form videos (talking head or voice-over) drive reach the fastest, even with basic edits.",
  "Faceless creators who nail hooks and scripts routinely hit $10k+/month from content alone."
];

const HM_QUICK_CHECK = "Are you the kind of person who finishes what you start, or do you give up easily?";

let hmFactIndices = [];
let currentFactIndex = 0;

// Fixed popup breakpoints: after questions 5, 10, 14, 19, and 20
function getFixedPopupIndices() {
  // Convert 1-based question numbers to 0-based indices
  // "After question N" means show popup when advancing past question N
  return [5, 10, 14, 19, 20]; // These are the question numbers where popups should appear
}

// Show fact popup
function showFactPopup() {
  if (currentFactIndex >= HM_FACTS.length + 1) return; // +1 for the quick check
  
  let factText, modalTitle;
  
  if (currentFactIndex === HM_FACTS.length) {
    // Last popup - show Quick check
    modalTitle = "Quick check";
    factText = HM_QUICK_CHECK;
  } else {
    // Regular fact popup
    modalTitle = "Did you know?";
    factText = HM_FACTS[currentFactIndex];
  }
  
  document.getElementById('hmFactTitle').textContent = modalTitle;
  document.getElementById('hmFactText').textContent = factText;
  document.getElementById('hmFactModal').classList.remove('hidden');
  
  // Focus trap
  const modal = document.getElementById('hmFactModal');
  const firstBtn = modal.querySelector('.hm-modal__btn');
  firstBtn.focus();
}

// Handle fact popup response
function handleFactResponse(response) {
  // Save to localStorage
  const factKey = `hm_fact_${currentFactIndex}`;
  localStorage.setItem(factKey, response);
  
  // Close modal
  document.getElementById('hmFactModal').classList.add('hidden');
  
  // Move to next fact
  currentFactIndex++;
  
  // Don't call next() here - let the user continue naturally
  // The popup was shown after they answered a question, so they're already on the next question
}

// Show name capture modal
function showNameModal() {
  const existingName = localStorage.getItem('hm_name');
  if (existingName) {
    // Name already captured, proceed to results
    showResults();
    return;
  }
  
  document.getElementById('hmNameModal').classList.remove('hidden');
  document.getElementById('hmNameInput').focus();
}

// Handle name submission
function handleNameSubmit() {
  const nameInput = document.getElementById('hmNameInput');
  const name = nameInput.value.trim();
  
  if (name) {
    localStorage.setItem('hm_name', name);
  } else {
    localStorage.setItem('hm_name', 'friend');
  }
  
  // Close modal
  document.getElementById('hmNameModal').classList.add('hidden');
  
  // Proceed to results
  showResults();
}

// Update paywall title with personalized name
function updatePaywallTitle() {
  const name = localStorage.getItem('hm_name') || 'friend';
  const titleElement = document.getElementById('paywallTitle');
  if (titleElement) {
    titleElement.innerHTML = `${name.charAt(0).toUpperCase() + name.slice(1)}, Your <span class="gold-remote">Remote</span> Income Plan Is Ready`;
  }
}

// Enhanced next function with fact popups
function next() {
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
    
    // Check if we should show a fact popup
    // We want to show popup after completing certain questions
    // Since current is now the new question number, we check if we just completed a question that should trigger a popup
    const justCompletedQuestion = current - 1;
    if (hmFactIndices.includes(justCompletedQuestion) && currentFactIndex < HM_FACTS.length + 1) {
      // Small delay to let the question render first
      setTimeout(showFactPopup, 300);
    }
  } else {
    // Last question answered, show name modal before results
    showNameModal();
  }
}

// Initialize HM system
function initHM() {
  // Use fixed popup indices: after questions 5, 10, 14, 19, and 20
  hmFactIndices = getFixedPopupIndices();
  
  // Set up event listeners for modals
  // Fact modal cannot be closed by backdrop or Escape - requires Yes/No choice
  document.getElementById('hmFactModal').addEventListener('click', (e) => {
    // Do nothing on backdrop click - user must choose Yes or No
  });
  
  document.getElementById('hmNameModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('hm-modal__backdrop')) {
      handleNameSubmit(); // Submit with current input value
    }
  });
  
  // Fact modal buttons
  document.querySelectorAll('#hmFactModal .hm-modal__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const response = btn.dataset.response;
      handleFactResponse(response);
    });
  });
  
  // Name modal continue button
  document.getElementById('hmNameContinue').addEventListener('click', handleNameSubmit);
  
  // Name input enter key
  document.getElementById('hmNameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  });
  
  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nameModal = document.getElementById('hmNameModal');
      
      // Only allow Escape to close name modal, not fact modal
      if (!nameModal.classList.contains('hidden')) {
        handleNameSubmit();
      }
    }
  });
  
  // Initialize ticket system and animations
  initializeTicketSelection();
  initializeAnimationObserver();
}

// Override original functions
window.next = next;
window.showPaywall = showPaywall;

// Initialize HM system after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for original init to complete
  setTimeout(initHM, 100);
});

// Ticket functionality for 4-tier system with Continue buttons
function initializeTicketSelection() {
  const tickets = document.querySelectorAll('.ticket:not(.ticket-locked)');
  const ticketButtons = document.querySelectorAll('.ticket-btn');
  
  // Handle Continue button clicks for payment
  ticketButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const ticket = button.closest('.ticket');
      const paylink = ticket.dataset.paylink;
      
      if (paylink) {
        // Open Stripe Payment Link in new tab
        window.open(paylink, '_blank');
      }
    });
  });

  // Handle Epic ticket (locked)
  const epicTicket = document.querySelector('.ticket-epic');
  if (epicTicket) {
    epicTicket.addEventListener('click', () => {
      // Show tooltip message
      showEpicTooltip();
    });
  }
}

// Show Epic ticket tooltip
function showEpicTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'epic-tooltip';
  tooltip.textContent = 'Only on HustleMap Premium';
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(21, 28, 36, 0.95);
    color: #E0C27B;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    z-index: 10000;
    pointer-events: none;
    border: 1px solid rgba(224, 194, 123, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  `;
  
  document.body.appendChild(tooltip);
  
  // Position tooltip near Epic ticket
  const epicTicket = document.querySelector('.ticket-epic');
  const rect = epicTicket.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.top - 40) + 'px';
  
  // Remove tooltip after 2 seconds
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }, 2000);
}

// Intersection Observer for animation performance
function initializeAnimationObserver() {
  const animatedElements = document.querySelectorAll('.brand--h, .brand--m, .pill, .progress4 .fill, .ticket, .hm-modal__content, .btn.big');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('animate-pause');
      } else {
        entry.target.classList.add('animate-pause');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// Trigger counter glow pulse when joined number updates
function triggerCounterGlow() {
  const joinedBadge = document.querySelector('.pill:contains("joined")') || 
                     document.querySelector('.pill:contains("1,000")');
  if (joinedBadge) {
    joinedBadge.style.animation = 'none';
    joinedBadge.offsetHeight; // Trigger reflow
    joinedBadge.style.animation = 'counterGlow 0.2s ease-out';
  }
}

// Add micro-spark effect to completed progress bars
function addProgressSpark(progressBar) {
  if (progressBar) {
    progressBar.classList.add('completed');
    setTimeout(() => {
      progressBar.classList.remove('completed');
    }, 120);
  }
}

// Update the existing progress bar logic to trigger sparks
function updateProgress(percent) {
  const progressBar = document.querySelector('.progress4 .fill');
  if (progressBar) {
    progressBar.style.setProperty('--p', percent + '%');
    
    // Add spark effect when progress reaches 100%
    if (percent >= 100) {
      setTimeout(() => addProgressSpark(progressBar), 50);
    }
  }
}

// Payment handling is now done directly through ticket Continue buttons
// No separate payment function needed
