let step = 0;
let answers = [];
const quizCard = document.getElementById('quizCard');
const interstitial = document.getElementById('interstitial');
const calcCard = document.getElementById('calcCard');
const paywall = document.getElementById('paywall');
const finalCard = document.getElementById('final');

const qTitle = document.getElementById('qTitle');
const optionsWrap = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const segments = document.getElementById('segments');
const continueBtn = document.getElementById('continueBtn');

function buildSegments() {
  segments.innerHTML = '';
  for (let i=0;i<4;i++){
    const d = document.createElement('div');
    const iEl = document.createElement('i');
    d.appendChild(iEl);
    segments.appendChild(d);
  }
}

function setSegmentsProgress(idx) {
  const fills = segments.querySelectorAll('i');
  const total = QUESTIONS.length;
  const stage = Math.floor((idx / total) * 4);
  fills.forEach((f,i)=>{
    f.style.width = (i < stage ? '100%' : (i === stage ? '45%' : '0%'));
  });
}

function renderQuestion(i){
  const q = QUESTIONS[i];
  if(!q){ return showCalc(); }
  if(q.type === 'fact'){
    interstitial.classList.remove('hidden');
    quizCard.classList.add('hidden');
    document.getElementById('factText').textContent = q.text;
    return;
  }
  quizCard.classList.remove('hidden');
  interstitial.classList.add('hidden');
  qTitle.textContent = q.title;
  optionsWrap.innerHTML = '';
  q.options.forEach(opt => {
    const el = document.createElement('div');
    el.className = 'option';
    el.textContent = opt;
    el.dataset.value = opt;
    optionsWrap.appendChild(el);
  });
  nextBtn.disabled = true;
  setSegmentsProgress(i);
  window.scrollTo({top:quizCard.offsetTop - 20, behavior:'smooth'});
}

optionsWrap.addEventListener('click', (e)=>{
  const opt = e.target.closest('.option');
  if(!opt) return;
  optionsWrap.querySelectorAll('.option').forEach(o=>o.classList.remove('active'));
  opt.classList.add('active');
  nextBtn.disabled = false;
});

nextBtn.addEventListener('click', ()=>{
  const active = optionsWrap.querySelector('.option.active');
  if(!active) return;
  answers.push(active.dataset.value);
  step += 1;
  renderQuestion(step);
});

continueBtn?.addEventListener('click', ()=>{
  step += 1;
  renderQuestion(step);
});

function showCalc(){
  quizCard.classList.add('hidden');
  interstitial.classList.add('hidden');
  calcCard.classList.remove('hidden');

  const rows = calcCard.querySelectorAll('.calc-row');
  let r = 0;
  function animRow(){
    if(r >= rows.length){ 
      setTimeout(showPaywall, 800); 
      return; 
    }
    const fill = rows[r].querySelector('.fill');
    const pct = rows[r].querySelector('.pct');
    const target = parseInt(fill.dataset.target,10) || 100;
    let cur = 0;
    const timer = setInterval(()=>{
      cur += 2;
      if(cur > target) cur = target;
      fill.style.width = cur + '%';
      pct.textContent = cur + '%';
      if(cur === target){
        clearInterval(timer);
        r += 1;
        setTimeout(animRow, 300);
      }
    }, 30);
  }
  animRow();
}

function pickPath() {
  const a = answers.join(' ').toLowerCase();
  if(a.includes('writing')) return PATHS.writer;
  if(a.includes('camera') || a.includes('ugc')) return PATHS.camera;
  if(a.includes('automation') || a.includes('tools')) return PATHS.builder;
  return PATHS.writer;
}

function showPaywall(){
  calcCard.classList.add('hidden');
  paywall.classList.remove('hidden');
  buildSegments();
  paywall.querySelector('.segments').classList.add('done');
  const path = pickPath();
  document.getElementById('resultsTitle').textContent =
    `Your best match: ${path.name}`;
  window._pickedPath = path;
}

document.getElementById('unlockForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if(!email) return;
  paywall.classList.add('hidden');
  finalCard.classList.remove('hidden');
  const qs = document.getElementById('quickStart');
  const p = window._pickedPath || PATHS.writer;
  qs.innerHTML = `
    <div class="step"><b>Why this:</b> ${p.why}</div>
    ${p.todo.map((t,i)=>`<div class="step"><b>Day ${i+1}:</b> ${t}</div>`).join('')}
    <div class="step">💌 We sent your full PDF + bonus bundle to <b>${email}</b>.</div>
  `;
});

document.addEventListener('DOMContentLoaded', ()=>{
  buildSegments();
  renderQuestion(0);
});
