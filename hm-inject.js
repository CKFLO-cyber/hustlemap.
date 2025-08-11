
// HustleMap injected logic (non-intrusive)
// - Animated "Did you know?" interstitials with Yes/No
// - Friendly name capture (modal) and final personalization
// It will NOT block your Next button or alter your layout.

(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Modal refs
  const modal = $("#hmModal");
  const mTitle = $("#hmModalTitle");
  const mText  = $("#hmModalText");
  const btnOk  = $("#hmBtnOk");
  const btnYes = $("#hmBtnYes");
  const btnNo  = $("#hmBtnNo");

  if(!modal) return;

  const state = {
    nextClicks: 0,
    name: localStorage.getItem("hm_name") || "",
    answers: {}
  };

  const FACTS = [
    "Creators who batch content 1 afternoon/week publish 2–3× more and grow faster.",
    "Most people quit at 80%. 30 focused minutes/day beat 2 distracted hours.",
    "Blocking time in your calendar increases consistency in 30–60 days."
  ];

  function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

  function showModal({title="Did you know?", text="", mode="info", onYes, onNo, onOk}){
    mTitle.textContent = title;
    mText.textContent  = text;

    // Toggle buttons
    btnYes.classList.toggle("hm-hidden", mode !== "yn");
    btnNo.classList.toggle("hm-hidden",  mode !== "yn");
    btnOk.classList.toggle("hm-hidden",  mode === "yn");

    modal.classList.remove("hm-hidden");

    // Clean old handlers
    btnOk.onclick = btnYes.onclick = btnNo.onclick = null;

    if (mode === "yn"){
      btnYes.onclick = () => { modal.classList.add("hm-hidden"); onYes && onYes(); };
      btnNo.onclick  = () => { modal.classList.add("hm-hidden"); onNo  && onNo();  };
    } else {
      btnOk.onclick  = () => { modal.classList.add("hm-hidden"); onOk  && onOk();  };
    }
  }

  // Name capture (modal), only if not present in page
  function askNameIfMissing(){
    if (state.name && state.name.trim().length >= 2) return;

    // Small prompt for name
    showModal({
      title: "What’s your name?",
      text: "We’ll personalize your result.",
      mode: "info",
      onOk: () => {
        // Transform modal into an input quickly
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Your name";
        input.style.cssText = "width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#e9f6ff;margin-top:6px";
        mText.after(input);
        btnOk.textContent = "Save";
        btnOk.onclick = () => {
          const v = input.value.trim();
          if(!v){ input.focus(); return; }
          state.name = v;
          localStorage.setItem("hm_name", v);
          modal.classList.add("hm-hidden");
        };
      }
    });
  }

  // Interstitials after specific Next clicks (2 and 5)
  function attachNextWatcher(){
    // Delegate click handler without interfering
    document.addEventListener("click", (e) => {
      const target = e.target;
      // Heuristic: any button with text 'Next' or id/class contains 'next'
      const isNext = (
        (target.tagName === "BUTTON" && /next/i.test(target.textContent)) ||
        (target.id && /next/i.test(target.id)) ||
        (target.className && /next/i.test(target.className))
      );
      if(!isNext) return;

      state.nextClicks++;

      if (state.nextClicks === 2 || state.nextClicks === 5){
        const fact = FACTS[(state.nextClicks===2?0:1) % FACTS.length];
        // show after the click (non-blocking)
        setTimeout(()=>{
          showModal({ title: "Did you know?", text: fact, mode: "info" });
        }, 120);
      }

      // Near the end (8th Next) ask commitment
      if (state.nextClicks === 8){
        setTimeout(()=>{
          showModal({
            title: "Quick check",
            text: "Are you the kind of person who finishes what you start?",
            mode: "yn",
            onYes: ()=>{ state.answers.finisher = "yes"; },
            onNo:  ()=>{ state.answers.finisher = "no";  }
          });
        }, 140);
      }
    }, true); // capture phase so we don't miss it
  }

  // Personalize paywall title when it appears
  function personalizePaywall(){
    const iv = setInterval(()=>{
      const paywall = document.querySelector('#paywall, [id*="pay"]');
      if(!paywall) return;
      // prefer explicit target
      let h = paywall.querySelector('#payTitle, h2, h1');
      if(!h) return;
      if (!state.name) state.name = localStorage.getItem("hm_name") || "";
      const nm = cap(state.name) || "friend";
      const custom = `${nm}, planul tau pentru a face bani de acasa este gata`;
      if(h.textContent !== custom){
        h.textContent = custom;
      }
    }, 600);
    // Keep running; harmless
  }

  // Startup
  document.addEventListener("DOMContentLoaded", ()=>{
    askNameIfMissing();
    attachNextWatcher();
    personalizePaywall();
  });
})();
