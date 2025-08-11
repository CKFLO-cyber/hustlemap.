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
// mini-animatie 1,000 -> 1,005
const joinedEl = document.getElementById('hmJoinedCount');
if (joinedEl) {
  let n = 1000, target = 1005;
  const t = setInterval(() => {
    n++;
    joinedEl.textContent = n.toLocaleString();
    if (n >= target) clearInterval(t);
  }, 800);
}
