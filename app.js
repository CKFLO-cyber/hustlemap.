
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];

const state = {
  i: 0,
  answers: {},
  name: "",
  email: "",
  steps: []
};

function buildSteps(){
  const steps = [];
  QUESTIONS.forEach((q,idx)=>{
    steps.push({kind:'q', q});
    if([4,8,12,16].includes(idx)){ // after Q5,Q9,Q13,Q17
      steps.push({kind:'info', text: DID_YOU_KNOW[(idx/4)%DID_YOU_KNOW.length|0]});
    }
  });
  steps.push({kind:'name'});
  steps.push({kind:'calc'});
  steps.push({kind:'pay'});
  steps.push({kind:'result'});
  state.steps = steps;
}

function renderDots(){
  const wrap = $("#progressDots"); wrap.innerHTML='';
  for(let i=0;i<4;i++){ const d=document.createElement('div'); d.className='dot'; d.innerHTML='<span></span>'; wrap.appendChild(d); }
  updateDots();
}
function updateDots(){
  const totalQ = QUESTIONS.length;
  const per = Math.ceil(totalQ/4);
  const answered = Object.keys(state.answers).length;
  const dots = $$(".dot");
  dots.forEach((d,i)=>{
    const span = d.firstChild;
    const start = i*per;
    if(answered >= start+per) span.style.width='100%';
    else if(answered > start) span.style.width = Math.max(8, Math.min(100, (answered-start)/per*100))+'%';
    else span.style.width='0%';
  });
}

function start(){
  buildSteps();
  renderDots();
  next(); // start immediately
  // playful joined counter
  const joined = $("#joined");
  let n = 1000 + Math.floor(Math.random()*60);
  setInterval(()=>{ n+=1+Math.floor(Math.random()*3); joined.textContent = `${n}+ joined today`;}, 3500);
  $("#y").textContent = new Date().getFullYear();
  // return from payment
  const params = new URLSearchParams(location.search);
  if(params.get('paid')==='1'){ state.i = state.steps.findIndex(s=>s.kind==='result'); return render(); }
  // auto-scroll
  setTimeout(()=>{ $("#quizCard").scrollIntoView({behavior:'smooth', block:'start'}); }, 400);
}
document.addEventListener('DOMContentLoaded', start);

function next(){
  const step = state.steps[state.i];
  if(!step) return;
  if(step.kind==='q') renderQuestion(step.q);
  else if(step.kind==='info') renderInfo(step.text);
  else if(step.kind==='name') renderName();
  else if(step.kind==='calc') renderCalc();
  else if(step.kind==='pay') renderPay();
  else if(step.kind==='result') renderResults();
}
function goNext(){ state.i++; updateDots(); next(); }

function renderQuestion(q){
  const area = $("#contentArea");
  area.innerHTML = `
    <div class="step-title"><span class="leaf"></span>${q.title}</div>
    <div class="options">${q.options.map(opt=>`<div class="option">${opt}</div>`).join("")}</div>
    <div class="actions"><button class="next-btn" id="nbtn" disabled>Next</button></div>
  `;
  $$(".option", area).forEach(el=>{
    el.addEventListener('click',()=>{
      $$(".option", area).forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
      state.answers[q.id] = el.textContent.trim();
      $("#nbtn").disabled = false;
    });
  });
  $("#nbtn").addEventListener('click', goNext);
}

function renderInfo(text){
  const area = $("#contentArea");
  area.innerHTML = `
    <div class="info-card">
      <h3 class="info-title">Did you know?</h3>
      <p class="info-body">${text}</p>
      <div class="actions"><button class="next-btn">Next</button></div>
    </div>`;
  $(".next-btn", area).addEventListener('click', goNext);
}

function renderName(){
  const area = $("#contentArea");
  area.innerHTML = `
    <div class="step-title"><span class="leaf"></span>Last step before we compute your results</div>
    <div class="two-col">
      <div>
        <input class="name-input" id="name" placeholder="Your first name" />
        <div class="name-note">We’ll personalize your plan with your name.</div>
      </div>
      <div>
        <input class="email-input" id="email" type="email" placeholder="Your email (to deliver your bundle)" />
        <label class="consent"><input type="checkbox" id="consent" /> I agree to receive my bundle via email.</label>
      </div>
    </div>
    <div class="actions"><button class="next-btn" id="goCalc" disabled>Calculate</button></div>
  `;
  const name = $("#name"), email=$("#email"), consent=$("#consent"), btn=$("#goCalc");
  function validate(){
    const okName = (name.value.trim().length>=2);
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const okC = consent.checked;
    btn.disabled = !(okName && okEmail && okC);
  }
  name.addEventListener('input', validate);
  email.addEventListener('input', validate);
  consent.addEventListener('change', validate);
  btn.addEventListener('click', ()=>{
    state.name = name.value.trim();
    state.email = email.value.trim();
    try{ localStorage.setItem('hm_email', state.email); localStorage.setItem('hm_name', state.name); }catch(e){}
    goNext();
  });
}

function renderCalc(){
  const area = $("#contentArea");
  area.innerHTML = `
    <div class="calc">
      <h2>Calculating your results…</h2>
      ${["Analyzing your skills & experience","Matching you with profitable online paths","Estimating time & effort to first wins","Preparing your content & offer blueprint","Building your 30-day action plan"].map((t,i)=>`
        <div class="bar"><span id="b${i}"></span></div>
      `).join("")}
      <div class="name-note">This takes about 3–5 seconds.</div>
    </div>`;
  let d=200;
  for(let i=0;i<5;i++){ setTimeout(()=>{ $(`#b${i}`).style.width=(86+Math.random()*12)+'%'; }, d); d+=700; }
  setTimeout(()=> goNext(), d+400);
}

function renderPay(){
  const area = $("#contentArea");
  const name = state.name || "there";
  area.innerHTML = `
    <div class="paywall">
      <h2>${name}, your personalized plan is ready</h2>
      <p class="info-body">Unlock your results + instant bonuses:</p>
      <ul class="info-body">
        <li>Your top 3 Remote income paths (fit, difficulty, income ceiling)</li>
        <li>Offer & pricing suggestions you can sell today</li>
        <li>30-day step-by-step plan (daily 30-minute actions)</li>
        <li>20+ creator prompts (hooks, scripts, emails)</li>
        <li>Repurpose checklist (1 post → 5 formats)</li>
        <li>Bonus: “First €1k online” quickstart PDF</li>
      </ul>
      <div class="price-wrap">
        <span class="badge">One-time</span>
        <span class="badge">€14.99</span>
        <span class="badge">Instant access</span>
      </div>
      <button class="pay-btn" id="pay">Unlok my Remoute Income Path — €14.99</button>
      <div class="pay-sub">One-time payment. Instant access. No subscription.</div>
      <div class="pay-sub">Includes your results + bonus bundle via email.</div>
    </div>
  `;
  $("#pay").addEventListener('click', (e)=>{
    e.preventDefault();
    // simulate payment success (?paid=1) — replace with Stripe success URL later
    try{ localStorage.setItem('hm_paid','1'); }catch(e){}
    const url = new URL(location.href); url.searchParams.set('paid','1'); location.href = url.toString();
  });
}

function renderResults(){
  const area = $("#contentArea");
  const plan = buildPlan(state.answers);
  const name = state.name || "Your";
  area.innerHTML = `
    <div class="result">
      <div class="info-card">
        <h2 style="margin:0 0 8px">${name} best Remote Income Path</h2>
        <p class="info-body" style="margin:0 0 10px">Top opportunities based on your answers:</p>
        <ol class="info-body">${plan.top.map(x=>`<li><b>${x.title}</b> — ${x.why}</li>`).join("")}</ol>
      </div>

      <div class="kpi" style="margin-top:10px">
        <div class="kcard"><b>Daily time plan</b><div>${plan.daily}</div></div>
        <div class="kcard"><b>Tool stack</b><div>${plan.tools}</div></div>
      </div>

      <div class="week"><b>Week 1</b><div>${plan.w1}</div></div>
      <div class="week"><b>Week 2</b><div>${plan.w2}</div></div>
      <div class="week"><b>Week 3</b><div>${plan.w3}</div></div>
      <div class="week"><b>Week 4</b><div>${plan.w4}</div></div>

      <div class="kpi" style="margin-top:10px">
        <div class="kcard"><b>KPIs</b><div>${plan.kpis}</div></div>
        <div class="kcard"><b>If you’re below target</b><div>${plan.fix}</div></div>
      </div>
    </div>
  `;
}

/*** Scoring & plan builder ***/
function buildPlan(ans){
  const a = Object.fromEntries(Object.entries(ans).map(([k,v])=>[+k,v]));
  const t = a[4]||""; // time
  const budget = a[5]||"";
  const strength = a[6]||"";
  const camera = a[7]||"";
  const prefer = a[8]||"";
  const techLvl = a[12]||"";
  const product = a[16]||"";

  // scores
  let F=0,C=0,S=0,O=0,T=0;
  if(strength.includes("Writing")){ C+=2; F+=1; }
  if(strength.includes("Design")){ C+=2; }
  if(strength.includes("Tech")){ O+=3; F+=1; }
  if(strength.includes("Sales")){ S+=3; F+=1; }

  if(camera==="Yes"){ C+=2; S+=1; }
  if(camera==="Prefer voice/screen"){ C+=1; F+=1; O+=1; }

  if(product==="Digital"){ C+=2; }
  if(product==="Services"){ F+=2; O+=1; }
  if(product==="Affiliate"){ S+=2; C+=1; }

  if(prefer.includes("Quick")){ S+=2; T+=1; }
  if(prefer.includes("Recurring")){ F+=2; O+=1; }
  if(prefer.includes("brand")){ C+=2; }

  if(techLvl==="Advanced"){ O+=3; }
  if(techLvl==="Intermediate"){ O+=1; F+=1; }

  const ranked = [
    {k:'O',title:'AI Automations for Small Businesses',score:O,why:'you leaned into systems & tools'},
    {k:'C',title:'Content + Digital Products',score:C,why:'you prefer creative formats & owned audience'},
    {k:'F',title:'Productized Freelancing',score:F,why:'you can deliver outcome-focused services fast'},
    {k:'S',title:'Affiliate/Offer + Outbound',score:S,why:'you like closing & quick wins'},
  ].sort((a,b)=>b.score-a.score);

  // time plan
  let daily="";
  if(t.includes("<1")) daily="20’ research • 20’ creation • 10’ publish • 10’ outreach";
  else if(t.includes("1–2")) daily="20’ research • 40’ creation • 20’ publish • 40’ outreach";
  else if(t.includes("3–4")) daily="30’ research • 60’ creation • 30’ publish • 60’ outreach";
  else daily="30’ research • 90’ creation • 30’ publish • 90’ outreach";

  // tools based on budget
  let tools="";
  if(budget.startswith("$0")) tools="Free stack: Notion, Canva, CapCut, MailerLite Free, Gumroad";
  else if(budget.startswith("$50")) tools="Lean stack: Notion, Canva Pro, CapCut Pro, MailerLite, Tally forms";
  else tools="Pro stack: Notion, Canva Pro, Descript, MailerLite/Ghost, Zapier/Make";

  const top = ranked[0].k;
  const camOff = (camera==="No");
  let w1,w2,w3,w4,kpis,fix;

  if(top==='O'){
    w1="Pick 1–2 repeatable problems (booking, leads, reports). Build 2 demo automations (Make/Zapier + Sheets/Notion).";
    w2="Create 2-minute Loom demos + 1-pager offer. Prospect 30 local SMBs. Start 10 DMs/day.";
    w3="Convert the most interested niche into a productized offer (setup + 2 automations). Offer a 14-day check-in.";
    w4="Close 2 retainers (€149–€399/mo). Document SOPs. Add upsell: analytics dashboard.";
    kpis="Day 7: 2 demos built • Day 14: 5 qualified calls • Day 30: 2 paying clients.";
    fix="Reduce scope to one automation with clear outcome; add guaranteed timeline; double DMs to warm leads.";
  } else if(top==='C'){
    w1=(camOff?"Draft 3 carousels + 2 emails + 1 PDF lead magnet.":"Record 3 UGC samples + 2 voiceover clips + 1 lead magnet PDF.")+" Define ICP & pain.";
    w2="Publish 5 short-form posts • 2 carousels • daily email. Create simple checkout for a €19 mini-product.";
    w3="Run weekly ‘offer moment’. Add €49 bundle. Collect 2 testimonials. Start 20 warm DMs/week.";
    w4="Ship 10 more posts. Launch V2 of the mini-product. Try 1 collaboration.";
    kpis="Day 14: 200 subs / 2 sales • Day 30: 5–10 sales.";
    fix="Tighten hooks (benefit-first), add CTA in 100% of posts, repurpose each post into 3 formats.";
  } else if(top==='F'){
    w1="Define a productized offer (scope, price, delivery). Create 3 samples/case snippets. One-page landing.";
    w2="Outbound 20/day (email/DM). 2 follow-up scripts. Offer a 7-day quick win deliverable.";
    w3="Close 2–3 micro-projects (€99–€249). Package a monthly content/ops kit as retainer.";
    w4="Ask for referrals. Turn best work into 2 mini case studies. Raise entry price +20%.";
    kpis="Day 14: 30 replies • Day 30: 2 clients.";
    fix="Narrow your ICP, add guarantee (‘in 7 days or free’), use a shorter pitch with 1 outcome.";
  } else { // 'S'
    w1="Pick an evergreen offer (affiliate/eCom). Build 1 comparison page + 3 short videos.";
    w2="Publish 5 shorts/week. Create 1 review article. Start email capture.";
    w3="Run 3 micro-tests: hook, thumbnail, angle. Double down on the best CTR.";
    w4="Expand 1 product cluster (3 articles + 4 shorts). Add bonus guide to increase AOV.";
    kpis="Day 14: 500 visits • Day 30: 2–5 sales.";
    fix="Increase comparison visuals, add pros/cons table, test 3 new hooks and 2 thumbnails.";
  }

  return {
    top: ranked.slice(0,3),
    daily, tools,
    w1,w2,w3,w4,kpis,fix
  };
}
