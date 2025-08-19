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
  
  // Clean up any existing event listeners by cloning the element
  const oldOptions = wrap.querySelector('.options');
  if (oldOptions) {
    const newOptions = oldOptions.cloneNode(true);
    oldOptions.parentNode.replaceChild(newOptions, oldOptions);
  }
  
  wrap.innerHTML = `
    <div class="q-title">${q.title}</div>
    <div class="options">
      ${q.options.map(opt => `
        <div class="option" data-value="${opt.value}">${opt.label}</div>
      `).join('')}
    </div>
  `;

  // Single event handler for option selection
  wrap.querySelector('.options').addEventListener('click', (e) => {
    const tile = e.target.closest('.option');
    if (!tile) return;
    
    const val = tile.dataset.value;
    
    if (q.multi) {
      // Multi-select: toggle selection
      tile.classList.toggle('selected');
      const selected = [...wrap.querySelectorAll('.option.selected')].map(n => n.dataset.value);
      answers[q.key] = selected;
      
      // Auto-advance for multi-select after selection (with lock protection)
      if (selected.length > 0) {
        setTimeout(() => advanceToNextQuestion(), 800);
      }
    } else {
      // Single-select: clear others, select this one, advance
      wrap.querySelectorAll('.option').forEach(n => n.classList.remove('selected'));
      tile.classList.add('selected');
      answers[q.key] = val;
      
      // Auto-advance for single-select (with lock protection)
      setTimeout(() => advanceToNextQuestion(), 600);
    }
  }, { once: false });
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
// Animated counter for "joined today" - Slow growth version
let counterTimer = null; // Single timer reference for self-scheduling

function startJoinedCounter(){
  // Clear any existing timer
  if (counterTimer) {
    clearInterval(counterTimer);
    counterTimer = null;
  }
  
  const counter = document.getElementById('hmJoinedCount');
  if(!counter) return;
  
  // Parse the initial value from DOM, stripping non-digits
  let current = parseInt(counter.textContent.replace(/[^\d]/g, '')) || 1005;
  
  const updateCounter = () => {
    // Add random increment between 3 and 7 (inclusive)
    const increment = Math.floor(Math.random() * 5) + 3;
    current += increment;
    
    // Format: en-US thousands separator + exactly one "+"
    counter.textContent = current.toLocaleString('en-US') + '+ joined today';
    
    // Trigger subtle count bump animation
    triggerCounterGlow();
  };
  
  // Use setInterval for consistent 3-second timing
  counterTimer = setInterval(updateCounter, 3000);
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



// Keyboard support for quiz options (no auto-advance)
function setupKeyboardSupport() {
  setTimeout(() => {
    const wrap = document.getElementById('question-wrap');
    if (!wrap) return;
    
    // Only keyboard support - no click handling
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
  // Check if user is landing directly on paywall section
  if (location.hash === '#paywall') {
    // Wait for DOM and original init to complete, then show paywall
    setTimeout(() => {
      showPaywall();
      // Smooth scroll to paywall section
      const paywallSection = document.getElementById('paywall');
      if (paywallSection) {
        paywallSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500); // Wait for original init to complete
    return; // Don't start quiz or counter when landing on paywall
  }
  
  // Start the joined counter
  startJoinedCounter();
  
  // Set up keyboard support for quiz options
  setupKeyboardSupport();
  
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
  
  // Show modal
  const modal = document.getElementById('hmFactModal');
  modal.classList.remove('hidden');
  
  // Focus trap
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

// Single source of truth for advancing questions
let isAdvancing = false; // Re-entry protection lock

function advanceToNextQuestion() {
  // Prevent re-entry while transition is in progress
  if (isAdvancing) {
    console.log('Advance blocked - already in progress');
    return;
  }
  
  // Set lock for 400ms to prevent multiple advances
  isAdvancing = true;
  
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
    
    // Check if we should show a fact popup
    const justCompletedQuestion = current - 1;
    if (hmFactIndices.includes(justCompletedQuestion) && currentFactIndex < HM_FACTS.length + 1) {
      // Small delay to let the question render first
      setTimeout(showFactPopup, 300);
    }
    
    // Clear lock after question renders
    setTimeout(() => {
      isAdvancing = false;
    }, 400);
  } else {
    // Last question answered, show name modal before results
    showNameModal();
    // Clear lock immediately for final question
    isAdvancing = false;
  }
}

// Legacy next function (redirects to new function)
function next() {
  advanceToNextQuestion();
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
  initializeCountdownTimer();
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
        // Open Stripe Payment Link in new tab with security attributes
        window.open(paylink, '_blank', 'noopener,noreferrer');
      }
    });
  });


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

// Trigger counter bump animation when joined number updates
function triggerCounterGlow() {
  const joinedBadge = document.getElementById('hmJoinedCount');
  if (joinedBadge) {
    joinedBadge.style.animation = 'none';
    joinedBadge.offsetHeight; // Trigger reflow
    joinedBadge.style.animation = 'countBump 0.2s ease-out';
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

// Countdown Timer Functionality
function initializeCountdownTimer() {
  const countdownTime = document.getElementById('countdownTime');

  
  if (!countdownTime) return;
  
  // Get or create deadline in localStorage
  let deadline = localStorage.getItem('countdownDeadline');
  if (!deadline) {
    // Set deadline to 60 minutes from now on first visit
    deadline = Date.now() + (60 * 60 * 1000);
    localStorage.setItem('countdownDeadline', deadline.toString());
  }
  
  deadline = parseInt(deadline);
  
  function updateCountdown() {
    const now = Date.now();
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) {
      // Timer expired
      countdownTime.textContent = '00:00';
      countdownTime.setAttribute('aria-live', 'off');
      

      
      return;
    }
    
    // Calculate minutes and seconds
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Format time as MM:SS
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    countdownTime.textContent = timeString;
    
    // Continue countdown
    setTimeout(updateCountdown, 1000);
  }
  
  // Start the countdown
  updateCountdown();
}
