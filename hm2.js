
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const modal = $("#hm2-modal");
  const t = $("#hm2-title");
  const x = $("#hm2-text");
  const bOk  = $("#hm2-ok");
  const bYes = $("#hm2-yes");
  const bNo  = $("#hm2-no");

  const S = {
    name: (localStorage.getItem("hm_name")||"").trim(),
    shownFacts: 0,
    finalAsked: false,
    nextClicks: 0,
  };

  const FACTS = [
    "Cei care își batchează conținutul o dată pe săptămână publică 2–3× mai mult și cresc mai repede.",
    "Majoritatea renunță la 80%. 30 de minute concentrate/zi bat 2 ore distrase.",
    "Blocarea timpului în calendar crește consistența în 30–60 de zile."
  ];

  function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ""; }

  function showModal({title="Did you know?", text="", mode="ok", onOk, onYes, onNo}){
    t.textContent = title;
    x.textContent = text;
    bOk.classList.toggle("hm2-hidden", mode==="yn");
    bYes.classList.toggle("hm2-hidden", mode!=="yn");
    bNo.classList.toggle("hm2-hidden", mode!=="yn");
    modal.classList.add("show");
    modal.style.display = "grid";

    // reset handlers
    bOk.onclick = bYes.onclick = bNo.onclick = null;
    if(mode==="yn"){
      bYes.onclick = ()=>{ modal.style.display="none"; onYes && onYes(); };
      bNo.onclick  = ()=>{ modal.style.display="none"; onNo  && onNo();  };
    }else{
      bOk.onclick  = ()=>{ modal.style.display="none"; onOk && onOk(); };
    }
  }

  function requestNameOnce(){
    if (S.name) return;
    showModal({
      title: "Care este numele tău?",
      text: "Îți personalizăm rezultatul.",
      mode: "ok",
      onOk: () => {
        // Inject a small input
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Numele tău";
        input.style.cssText = "width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#e9f6ff;margin-top:6px";
        x.after(input);
        bOk.textContent = "Salvează";
        bOk.onclick = () => {
          const v = input.value.trim();
          if(!v){ input.focus(); return; }
          S.name = v;
          localStorage.setItem("hm_name", v);
          modal.style.display="none";
        };
      }
    });
  }

  // Watch "Next" button clicks without altering them
  document.addEventListener("click", (e)=>{
    const tgt = e.target;
    const looksLikeNext = (
      (tgt.tagName==="BUTTON" && /next/i.test(tgt.textContent||"")) ||
      (tgt.id && /next/i.test(tgt.id)) ||
      (tgt.className && /next/i.test(tgt.className))
    );
    if(!looksLikeNext) return;
    S.nextClicks++;

    // Drop a fact after a couple of clicks (non-blocking)
    if (S.nextClicks===2 || S.nextClicks===5){
      const fact = FACTS[S.shownFacts % FACTS.length];
      S.shownFacts++;
      setTimeout(()=>{
        showModal({ title:"Știai că…", text: fact, mode:"ok" });
      }, 120);
    }
  }, true);

  // Observe page changes to show final Yes/No just before results/paywall
  const obs = new MutationObserver(()=>{
    if (S.finalAsked) return;
    const results = document.querySelector('#results');
    const pay = document.querySelector('#paywall, [id*="pay"]');
    const visible = (el)=> el && el.offsetParent !== null && getComputedStyle(el).display !== "none";
    if (visible(results) || visible(pay) || S.nextClicks > 10){
      S.finalAsked = true;
      showModal({
        title: "Încă un lucru",
        text: "Ești genul de persoană care duce treaba până la capăt?",
        mode: "yn",
        onYes: ()=>{},
        onNo: ()=>{},
      });
    }
  });
  obs.observe(document.documentElement, {subtree:true, childList:true, attributes:true});

  // Personalize paywall heading periodically
  setInterval(()=>{
    const pay = document.querySelector('#paywall, [id*="pay"]');
    if(!pay) return;
    let h = pay.querySelector('#payTitle, h1, h2');
    if(!h) return;
    const nm = cap(S.name || localStorage.getItem("hm_name") || ""); 
    if(!nm) return;
    const desired = `${nm}, planul tau pentru a face bani de acasa este gata`;
    if (h.textContent !== desired) h.textContent = desired;
  }, 700);

  // Kickoff
  document.addEventListener("DOMContentLoaded", ()=>{
    setTimeout(requestNameOnce, 800);
  });
})();
