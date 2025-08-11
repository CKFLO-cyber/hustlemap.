const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

let current = 0;
let answers = {};
let grouped = [];

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
      ${q.options.map(opt => `<div class="option" data-value="${opt.value}">${opt.label}</div>`).join('')}
    </div>
  `;
  const nextBtn = $('#nextBtn');
  nextBtn.disabled = true;

  wrap.querySelector('.options').addEventListener('click', (e)=>{
    const tile = e.target.closest('.option');
    if(!tile) return;
    wrap.querySelectorAll('.option').forEach(n=>n.classList.remove('selected'));
    tile.classList.add('selected');
    answers[q.key] = tile.dataset.value;
    nextBtn.disabled = false;
  });

  setProgress();
  setTimeout(()=>{ $('#quiz-card').scrollIntoView({behavior:'smooth', block:'start'}); }, 100);
}

function next(){
  const nextBtn = $('#nextBtn');
  if(nextBtn.disabled) return;
  if(current < QUESTIONS.length - 1){
    current++;
    renderQuestion();
  }else{
    showResults();
  }
}

function showResults(){
  $('#quiz-card').classList.add('hidden');
  $('#results').classList.remove('hidden');

  const rows = [
    {label:'Analyzing your background', color:['#7aa7ff','#3d7bff']},
    {label:'Matching remote paths', color:['#ffd166','#f4a261']},
    {label:'Estimating earnings ceiling', color:['#2af598','#00d4ff']},
    {label:'Preparing step-by-step plan', color:['#f86a6a','#f0a3a3']},
    {label:'Finalizing recommendations', color:['#b38bff','#7a5cff']},
  ];
  const perf = $('#calc-bars');
  perf.innerHTML = rows.map((r,i)=>`
    <div class="calc-row">
      <div class="label">${r.label}</div>
      <div class="track"><div class="bar" id="bar${i}"></div></div>
      <div class="pct" id="pct${i}">0%</div>
    </div>
  `).join('');

  rows.forEach((r,i)=>{
    const bar = $('#bar'+i);
    const pct = $('#pct'+i);
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
  setTimeout(()=>{
    $('#results').classList.add('hidden');
    $('#paywall').classList.remove('hidden');
  }, 600);
}

function ensureAgeFirst(){
  const idx = QUESTIONS.findIndex(q=>q.key==='age');
  if(idx>0){
    const [ageQ] = QUESTIONS.splice(idx,1);
    QUESTIONS.unshift(ageQ);
  }
}

function init(){
  ensureAgeFirst();
  grouped = chunkIntoSteps(QUESTIONS.length, 4);
  renderQuestion();
  $('#nextBtn').addEventListener('click', next);

  // Joined counter animation
  const el = document.getElementById('hmJoinedCount');
  if(el){
    let value = 1000;
    const fmt = n => n.toLocaleString('en-US');
    el.textContent = fmt(value);

    const firstTarget = 1005 + Math.floor(Math.random()*3);
    let first = setInterval(()=>{
      value++;
      el.textContent = fmt(value);
      if(value >= firstTarget){ clearInterval(first); }
    }, 700);

    setInterval(()=>{
      const inc = 1 + Math.floor(Math.random()*2);
      value += inc;
      if(value > 1007) value = 1000;
      el.textContent = fmt(value);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', init);


// === Interstitials + Name capture (lightweight) ===
const HM_POPUPS = [
  "Creators who schedule 30 minutes daily are 3x more likely to monetize.",
  "Short videos + 1 long-form weekly is the fastest path to inbound leads.",
  "Reusing 1 post into 5 formats saves ~6 hours/week.",
  "Most beginners quit at day 10. Consistency beats intensity."
];
const HM_ASK = "Are you the type who finishes what you start?";
const HM_TRIGGERS = new Set([4, 11]); // show after these question indexes (1-based)

const elPopup = document.getElementById('hmPopup');
const elPopupText = document.getElementById('hmPopupText');
const btnYes = document.getElementById('hmYes');
const btnNo = document.getElementById('hmNo');

function hmShowFact() {
  if(!elPopup) return;
  elPopupText.textContent = HM_POPUPS[Math.floor(Math.random()*HM_POPUPS.length)];
  btnNo.style.display = 'none';
  btnYes.textContent = 'OK';
  elPopup.classList.remove('hidden');
  btnYes.onclick = () => elPopup.classList.add('hidden');
}

function hmShowAsk(cb){
  if(!elPopup) return cb && cb();
  elPopupText.textContent = HM_ASK;
  btnNo.style.display = '';
  btnYes.textContent = 'Yes';
  elPopup.classList.remove('hidden');
  const close = (ans)=>{ localStorage.setItem('hm_finisher', ans); elPopup.classList.add('hidden'); cb && cb(); }
  btnYes.onclick = () => close('yes');
  btnNo.onclick  = () => close('no');
}

// Name capture
let HM_NAME = (localStorage.getItem('hm_name')||'').trim();
const elName = document.getElementById('hmName');
const elNameInput = document.getElementById('hmNameInput');
const elNameOk = document.getElementById('hmNameOk');

function hmAskName(cb){
  if(HM_NAME){ return cb&&cb(); }
  if(!elName) return cb&&cb();
  elName.classList.remove('hidden');
  setTimeout(()=>{ try{elNameInput.focus();}catch(e){} }, 50);
  elNameOk.onclick = ()=>{
    HM_NAME = (elNameInput.value||'').trim() || 'Friend';
    localStorage.setItem('hm_name', HM_NAME);
    elName.classList.add('hidden');
    cb && cb();
  };
}

// Patch next() to show interstitials and ask name before results
const _next = next;
next = function(){
  // run original
  _next();

  // after rendering question, check trigger
  try{
    if (typeof current !== 'undefined' && HM_TRIGGERS.has(current)) {
      setTimeout(hmShowFact, 80);
    }
    // if finished, the original next() will call showResults(); we intercept by observing card visibility
    // We also update paywall title when it appears
  }catch(e){}
};

// Hook into showResults to ask for name and final ask
const _showResults = showResults;
showResults = function(){
  hmAskName(()=>{
    hmShowAsk(()=>{
      // update paywall title with name once results/paywall visible
      setTimeout(()=>{
        const t = document.querySelector('#paywall h2, #paywallTitle');
        if(t){
          t.innerHTML = HM_NAME ? HM_NAME + ", your remote income plan is ready" : "Your personalized plan is ready";
        }
      }, 50);
      _showResults();
    });
  });
};
