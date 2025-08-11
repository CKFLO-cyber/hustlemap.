/* Minimal quiz engine inspired by Breeze flow */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const state = {
  step: 0,
  answers: [],
  started: false,
};

const heroStart = $('#startBtn');
const quizEl = $('#quiz');
const calcEl = $('#calculating');
const payEl = $('#paywall');
const trendCanvas = $('#trendChart');

heroStart.addEventListener('click', () => startQuiz());

function startQuiz(){
  window.scrollTo({ top: document.body.offsetHeight, behavior:'smooth' });
  state.started = true;
  $('#app').classList.add('started');
  renderStep();
  quizEl.classList.remove('hidden');
}

function renderProgress(){
  const total = QUIZ.length;
  const current = Math.min(state.step+1, total);
  return `<div class="progress">${Array.from({length:4}).map((_,i)=>{
    const pct = Math.min(100, Math.max(0, (current/total)*100 - i*25*100/100));
    return `<div class="dot"><span style="transform:translateX(-${100-pct}%)"></span></div>`
  }).join('')}</div>`;
}

function renderStep(){
  const step = QUIZ[state.step];
  if(!step) return;
  quizEl.innerHTML = renderProgress() + (() => {
    if(step.type === 'interstitial'){
      return `
        <div class="q-title">
          <img alt="" src="assets/info.svg"/>
          <div>
            <h2>${step.big || 'Did you know?'}</h2>
            <p class="hint">${step.text || ''}</p>
          </div>
        </div>
        <div class="controls">
          <button class="stickyNext" id="next">Next</button>
        </div>
      `;
    }
    if(step.type === 'inputName'){
      return `
        <div class="q-title">
          <img alt="" src="assets/user.svg"/>
          <div>
            <h2>Hey there, what should we call you?</h2>
            <p class="hint">Please enter your name to continue</p>
          </div>
        </div>
        <div class="grid">
          <input id="nameField" class="option" placeholder="Type your name…" style="padding:16px 18px;font-weight:500;background:#0f1320;border-radius:12px;border:1px solid #222a42;color:#e6e9ef">
        </div>
        <div class="controls">
          <button class="stickyNext" id="next" disabled>Continue</button>
        </div>
      `;
    }
    // default question
    const mult = step.type === 'multi';
    const opts = step.options.map((opt,i)=>`
      <button class="option" data-i="${i}">${opt}</button>
    `).join('');
    return `
      <div class="q-title">
        <img alt="" src="assets/leaf.svg"/>
        <div>
          <h2>${step.title}</h2>
          ${mult ? `<p class="hint">Choose as many as you like</p>`:''}
        </div>
      </div>
      <div class="grid">${opts}</div>
      <div class="controls">
        <button class="stickyNext" id="next" disabled>Next</button>
      </div>
    `;
  })();

  const stepData = QUIZ[state.step];

  if(stepData.type === 'inputName'){
    const field = $('#nameField');
    const btn = $('#next');
    field.addEventListener('input', () => {
      btn.disabled = field.value.trim().length < 2;
    });
    btn.addEventListener('click', () => {
      state.answers.push({ name: field.value.trim() });
      toNext();
    });
    return;
  }

  if(stepData.type === 'interstitial'){
    $('#next').addEventListener('click', toNext);
    return;
  }

  const mult = stepData.type === 'multi';
  const selected = new Set();
  $$('.option').forEach(el => {
    el.addEventListener('click', () => {
      const idx = +el.dataset.i;
      if(mult){
        if(selected.has(idx)) { selected.delete(idx); el.classList.remove('selected'); }
        else { selected.add(idx); el.classList.add('selected'); }
        $('#next').disabled = selected.size === 0;
      }else{
        $$('.option').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        selected.clear(); selected.add(idx);
        $('#next').disabled = false;
      }
    });
  });
  $('#next').addEventListener('click', () => {
    const ans = Array.from(selected).map(i => stepData.options[i]);
    state.answers.push({ q: stepData.title, a: mult ? ans : ans[0] });
    toNext();
  });
}

function toNext(){
  state.step++;
  if(state.step >= QUIZ.length){
    startCalculating();
  }else{
    renderStep();
    window.scrollTo({ top: $('#quiz').offsetTop - 24, behavior:'smooth' });
  }
}

function startCalculating(){
  quizEl.classList.add('hidden');
  calcEl.classList.remove('hidden');
  // animate bars
  const targets = [87, 92, 66, 95];
  const meters = calcEl.querySelectorAll('.meter');
  meters.forEach((m,idx)=>{
    const span = m.querySelector('.bar span');
    const val = m.querySelector('.value');
    let p = 0;
    const goal = targets[idx];
    const timer = setInterval(()=>{
      p += 2 + Math.random()*3;
      if(p>goal){ p=goal; clearInterval(timer); }
      span.style.setProperty('--p', p + '%');
      val.textContent = Math.round(p) + '%';
    }, 60);
  });

  // after 4 seconds -> pay screen
  setTimeout(() => {
    calcEl.classList.add('hidden');
    showPaywall();
  }, 4200);
}

function showPaywall(){
  payEl.classList.remove('hidden');
  drawTrend();
  startCountdown(15*60); // 15 minutes
  $('#buyBtn').addEventListener('click', (e)=>{
    e.preventDefault();
    const selected = document.querySelector('.plan.selected');
    const price = selected?.dataset.price || '1';
    // Link to your payment page (Stripe/Gumroad/etc.).
    const name = state.answers.find(a=>a.name)?.name || 'friend';
    const url = `https://buy.stripe.com/test_123?amount=${price}&name=${encodeURIComponent(name)}`;
    window.location.href = url;
  });
  $$('.plan').forEach(p => p.addEventListener('click', ()=>{
    $$('.plan').forEach(x=>x.classList.remove('selected'));
    p.classList.add('selected');
  }));
}

function startCountdown(total){
  const el = $('#countdown');
  function tick(){
    if(total<=0) return;
    total--;
    const m = Math.floor(total/60).toString().padStart(2,'0');
    const s = (total%60).toString().padStart(2,'0');
    el.textContent = `${m}:${s}`;
    requestAnimationFrame(()=>setTimeout(tick,1000));
  }
  tick();
}

function drawTrend(){
  const c = trendCanvas.getContext('2d');
  const w = trendCanvas.width, h = trendCanvas.height;
  c.clearRect(0,0,w,h);
  // grid
  c.globalAlpha = .14;
  c.strokeStyle = '#9fb1d3';
  for(let i=0;i<6;i++){
    const y = 20 + i*((h-40)/5);
    c.beginPath(); c.moveTo(40,y); c.lineTo(w-20,y); c.stroke();
  }
  c.globalAlpha = 1;
  // curves
  function curve(points, color){
    c.strokeStyle = color; c.lineWidth = 4;
    c.beginPath();
    c.moveTo(points[0][0], points[0][1]);
    for(let i=1;i<points.length;i++){
      const [x,y] = points[i];
      c.lineTo(x,y);
    }
    c.stroke();
  }
  curve([[40,h-40],[w*0.35,h-60],[w*0.7,h-100],[w-30,60]], '#19c2ff');
  curve([[40,60],[w*0.35,90],[w*0.7,130],[w-30,h-50]], '#a88eff');
}

// footer year
document.getElementById('y').textContent = new Date().getFullYear();
