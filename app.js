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
  wrap.innerHTML = `
    <div class="q-title">${q.title}</div>
    <div class="options">
      ${q.options.map(opt => `
        <div class="option" data-value="${opt.value}">${opt.label}</div>
      `).join('')}
    </div>
  `;
  $('#nextBtn').disabled = true;

  // Event delegation fix (handles first click reliably)
  wrap.querySelector('.options').addEventListener('click', (e)=>{
    const tile = e.target.closest('.option');
    if(!tile) return;
    const val = tile.dataset.value;
    if(q.multi){
      tile.classList.toggle('selected');
      const selected = [...wrap.querySelectorAll('.option.selected')].map(n=>n.dataset.value);
      answers[q.key] = selected;
      $('#nextBtn').disabled = selected.length === 0;
    }else{
      wrap.querySelectorAll('.option').forEach(n=>n.classList.remove('selected'));
      tile.classList.add('selected');
      answers[q.key] = val;
      $('#nextBtn').disabled = false;
    }
  }, { once:false });
  setProgress();
}

function next(){
  if($('#nextBtn').disabled) return;
  if(current < QUESTIONS.length-1){
    current++;
    renderQuestion();
  }else{
    showResults();
  }
}

function showResults(){
  $('#quiz-card').classList.add('hidden');
  $('#results').classList.remove('hidden');

  // Build calc bars (5 rows, different colors, animate sequentially)
  const rows = [
    {label:'Analyzing your background', color:['#7aa7ff','#3d7bff']},
    {label:'Matching remote paths', color:['#ffd166','#f4a261']},
    {label:'Estimating earnings ceiling', color:['#2af598','#00d4ff']},
    {label:'Preparing step-by-step plan', color:['#f86a6a','#f0a3a3']},
    {label:'Finalizing recommendations', color:['#b38bff','#7a5cff']},
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

  $('#nextBtn').addEventListener('click', next);
  $('#payBtn').addEventListener('click', ()=>{
    const email = $('#emailInput').value.trim();
    if(!email){
      alert('Please enter your email to receive your bundle after payment.');
      return;
    }
    // Demo payment action
    alert('Demo: payment modal would open here. Email saved: '+email+'\\n(One-time €14.99; no subscription)');
  });
}

document.addEventListener('DOMContentLoaded', init);

/* HM popups and personalization system */
const HM_FACTS = [
  "Creators who batch content one afternoon per week publish 2–3× more and grow faster.",
  "Most people quit at 80%. 30 focused minutes/day beat 2 distracted hours.",
  "Blocking a 30-minute daily slot increases consistency within 30–60 days.",
  "A simple offer + 20 helpful DMs often converts faster than a 'perfect' website."
];

let hmFactIndices = [];
let currentFactIndex = 0;

// Choose 4 random fact breakpoints between questions 3 and (n-2)
function pickRandomFactsIndices(totalQuestions) {
  const minIndex = 2; // Start from question 3 (index 2)
  const maxIndex = totalQuestions - 3; // End before last 2 questions
  
  if (maxIndex <= minIndex) {
    // Fallback if not enough questions
    return [2, 3, 4, 5].slice(0, Math.min(4, totalQuestions - 2));
  }
  
  const availableIndices = [];
  for (let i = minIndex; i <= maxIndex; i++) {
    availableIndices.push(i);
  }
  
  // Fisher-Yates shuffle to get 4 random unique indices
  const shuffled = [...availableIndices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, 4).sort((a, b) => a - b);
}

// Show fact popup
function showFactPopup() {
  if (currentFactIndex >= HM_FACTS.length) return;
  
  const factText = HM_FACTS[currentFactIndex];
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
    titleElement.textContent = `${name.charAt(0).toUpperCase() + name.slice(1)}, your remote income plan is ready`;
  }
}

// Enhanced next function with fact popups
const originalNext = next;
function next() {
  if ($('#nextBtn').disabled) return;
  
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
    
    // Check if we should show a fact popup
    if (hmFactIndices.includes(current) && currentFactIndex < HM_FACTS.length) {
      // Small delay to let the question render first
      setTimeout(showFactPopup, 300);
    }
  } else {
    // Last question answered, show name modal before results
    showNameModal();
  }
}

// Enhanced showPaywall with personalization
const originalShowPaywall = showPaywall;
function showPaywall() {
  // After a short pause, move to paywall
  setTimeout(() => {
    $('#results').classList.add('hidden');
    $('#paywall').classList.remove('hidden');
    
    // Update title with personalized name
    updatePaywallTitle();
  }, 600);
}

// Initialize HM system
function initHM() {
  // Choose random fact indices once per session
  hmFactIndices = pickRandomFactsIndices(QUESTIONS.length);
  
  // Set up event listeners for modals
  document.getElementById('hmFactModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('hm-modal__backdrop')) {
      handleFactResponse('no'); // Default to 'no' if clicked outside
    }
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
      const factModal = document.getElementById('hmFactModal');
      const nameModal = document.getElementById('hmNameModal');
      
      if (!factModal.classList.contains('hidden')) {
        handleFactResponse('no');
      } else if (!nameModal.classList.contains('hidden')) {
        handleNameSubmit();
      }
    }
  });
}

// Override original functions
window.next = next;
window.showPaywall = showPaywall;

// Initialize HM system after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for original init to complete
  setTimeout(initHM, 100);
});
