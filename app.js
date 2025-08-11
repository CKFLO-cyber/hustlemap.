// ------ simple state ------
const el = (sel) => document.querySelector(sel);
const els = (sel) => [...document.querySelectorAll(sel)];

const COLORS = ["#4ee38a","#6fd2ff","#aef39b","#9bb7ff"];
const PROGRESS = els("#progress .fill");
PROGRESS.forEach((p,i)=> p.style.background = `linear-gradient(90deg, ${COLORS[i%COLORS.length]}, #0ff0)`);

let answers = [];
let step = 0;
let userName = localStorage.getItem("hm_name") || "";
let email = "";

const nameInput = el("#nameInput");
if (userName) nameInput.value = userName;
nameInput.addEventListener("input", (e)=>{
  userName = e.target.value.trim();
  localStorage.setItem("hm_name", userName);
});

// badges counter
(function runJoinedCounter(){
  const target = el("#joined");
  let base = 1000 + Math.floor(Math.random()*40); // start ~1,000
  function show(n){
    target.textContent = n.toLocaleString("en-US") + " +";
  }
  show(base);
  setInterval(()=>{
    // random jump between 2 and 12
    base += 2 + Math.floor(Math.random()*11);
    show(base);
  }, 3000);
})();

// setup progress
function setProgress(index, total){
  const segSize = 100 / Math.ceil(total/4);
  PROGRESS.forEach(p=>p.style.width="0%");
  // fill segments up to current question
  let perc = (index/total) * 100;
  // distribute across 4 segs
  const part = perc/4;
  PROGRESS.forEach((p,i)=>{
    const w = Math.max(0, Math.min(25, perc - 25*i));
    p.style.width = `${w}%`;
  });
}

// render a question
function renderQuestion(){
  const q = QUESTIONS[step];
  setProgress(step, QUESTIONS.length);
  el("#qTitle").textContent = q.text;
  const answersWrap = el("#answers");
  answersWrap.innerHTML = "";
  q.options.forEach(opt=>{
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = opt;
    btn.addEventListener("click", ()=>{
      els(".answer").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      answers[step] = opt;
    });
    answersWrap.appendChild(btn);
  });
}

function next(){
  const q = QUESTIONS[step];
  if (!answers[step]){
    alert("Please choose an option."); return;
  }
  step++;
  // intermezzo modals after certain steps
  if (step === Math.floor(QUESTIONS.length/3) || step === Math.floor(QUESTIONS.length*2/3)){
    showFact();
    return;
  }
  if (step < QUESTIONS.length){
    renderQuestion();
  } else {
    // final quick modal yes/no
    finalCommitment();
  }
}

el("#nextBtn").addEventListener("click", next);

// modal helpers
const modal = el("#modal");
const modalText = el("#modalText");
const modalClose = el("#modalClose");
const modalChoices = el("#modalChoices");

function showModal(txt, withChoices=false){
  modalText.textContent = txt;
  modalChoices.classList.toggle("hidden", !withChoices);
  modal.classList.remove("hidden");
}
function hideModal(){ modal.classList.add("hidden"); }

modalClose.addEventListener("click", ()=>{
  hideModal();
  if (step < QUESTIONS.length){
    renderQuestion();
  } else {
    showResults();
  }
});

function showFact(){
  const fact = FACTS[Math.floor(Math.random()*FACTS.length)];
  showModal(fact,false);
}

function finalCommitment(){
  showModal("Are you the kind of person who finishes what you start?", true);
  modalChoices.onclick = (e)=>{
    const c = e.target?.dataset?.choice;
    if (!c) return;
    answers.push(c === "yes" ? "Finisher" : "Gives up sometimes");
    modalChoices.onclick = null;
    hideModal();
    showResults();
  };
}

// results animation
function showResults(){
  el("#quiz").classList.add("hidden");
  el("#results").classList.remove("hidden");

  const barsWrap = el("#calc-bars");
  barsWrap.innerHTML = "";
  const rows = [
    "Analyzing your background",
    "Studying your strengths",
    "Assessing remote fit",
    "Building your plan"
  ];
  const colors = COLORS;
  rows.forEach((r,i)=>{
    const row = document.createElement("div"); row.className="row";
    row.innerHTML = `<div class="lbl">${r}</div><div class="bar"><span style="background:linear-gradient(90deg, ${colors[i%colors.length]}, #68b4ff)"></span></div><div class="lbl" id="p${i}">0%</div>`;
    barsWrap.appendChild(row);
  });

  // sequential fill
  let i=0;
  function fillNext(){
    if (i>=rows.length){ setTimeout(showPaywall, 600); return; }
    const bar = barsWrap.querySelectorAll(".bar > span")[i];
    const pct = el("#p"+i);
    let w=0;
    const iv = setInterval(()=>{
      w += 3 + Math.floor(Math.random()*5);
      if (w>=100){ w=100; clearInterval(iv); i++; setTimeout(fillNext, 300); }
      bar.style.width = w + "%";
      pct.textContent = w + "%";
    }, 70);
  }
  fillNext();
}

function cap(str){
  return str ? str.charAt(0).toUpperCase()+str.slice(1) : "";
}

// paywall
function showPaywall(){
  el("#results").classList.add("hidden");
  el("#paywall").classList.remove("hidden");
  const nm = cap(userName) || "friend";
  el("#payTitle").textContent = `${nm}, your personalized plan is ready`;
}

// CTA (dummy)
el("#payBtn").addEventListener("click", ()=>{
  email = el("#emailInput").value.trim();
  const nm = cap(userName) || "friend";
  alert(`Thanks, ${nm}! Demo checkout: we would charge €14.99 and unlock your plan here, plus email the bundle to ${email || "(no email)"}.\n\n(Stripe integration pending.)`);
});

// kick off
renderQuestion();
setProgress(0, QUESTIONS.length);
