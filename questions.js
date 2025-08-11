// EDIT ME: your quiz questions live here.
// type: 'single' | 'multi' | 'interstitial' | 'inputName'
window.QUIZ = [
  { type:'single', title:'Choose your age', options:['18–21','22–25','26–30','31–35','36–40','41–45','46–50','51–55','56–60','61–65','66–70','71+'] },
  { type:'single', title:'What is your current main goal for remote income?', options:['Replace a full‑time job','Start small side‑income','Diversify existing biz','Scale what I already do','Not sure'] },
  { type:'multi', title:'Which strengths describe you best? (choose any)', options:['Writing & communication','Design / visual sense','Coding / technical','Sales / persuasion','Operations / organizing','Research & analysis'] },
  { type:'single', title:'Preferred pace to see results', options:['Fast (2–4 weeks)','Steady (1–3 months)','I can wait (3–6 months)'] },

  { type:'interstitial',
    big:'Did you know?',
    text:'Most creators who hit $1–3k/month did it with one clear offer, one channel, and consistent output for 30–60 days.'
  },

  { type:'single', title:'How many hours/week can you dedicate?', options:['3–5h','6–10h','10–20h','20h+'] },
  { type:'single', title:'What budget can you invest monthly for tools/ads?', options:['€0–50','€50–150','€150–400','€400+'] },
  { type:'single', title:'Comfort on camera?', options:['Love it','Can do it','Prefer not to','No way'] },
  { type:'single', title:'Your audience access right now', options:['0–1000 followers','1k–10k','10k–50k','50k+'] },
  { type:'multi', title:'Pick topics you enjoy', options:['Fitness/Wellness','Money/Business','Tech/AI','Beauty/Fashion','Gaming','Home/DIY','Food','Other'] },

  { type:'interstitial',
    big:'Quick tip',
    text:'Short‑form video + strong CTA turns into daily traffic. We’ll hand you prompts, hooks and scripts inside the plan.'
  },

  { type:'single', title:'Preferred work style', options:['Solo & flexible','Small team','I like clients','I want products only'] },
  { type:'single', title:'Risk tolerance', options:['Low','Medium','High'] },
  { type:'single', title:'Email list right now?', options:['None','< 500','500–5k','5k+'] },
  { type:'single', title:'Do you want to appear as a personal brand?', options:['Yes','Maybe','No'] },
  { type:'single', title:'Experience selling online?', options:['None','Some attempts','Consistent sales'] },

  { type:'interstitial',
    big:'Almost done!',
    text:'We’ll compute fit across 5 paths: UGC/Short‑form, Freelancing, Micro‑SaaS, Content Products, and Affiliate/Review.'
  },

  { type:'single', title:'Pick your dream monthly target', options:['€500–1k','€1–3k','€3–5k','€5k+'] },
  { type:'single', title:'Would you follow a 30‑day execution plan?', options:['Yes','Maybe','No'] },

  { type:'inputName', title:'What should we call you?' }
];
