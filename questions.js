const QUESTIONS = [
  { title: "Experience selling online?", options: ["None","Some attempts","Consistent sales"] },
  { title: "Preferred work style", options: ["Solo & flexible","Small team","I like clients","I prefer products"] },
  { title: "How many hours/day can you invest?", options: ["30–45 min","1–2 hours","3–4 hours","5+ hours"] },
  { title: "Savings to invest the first month?", options: ["€0–50","€50–200","€200–500","€500+"] },
  { title: "Choose your age", options: ["18–25","26–35","36–50","51+"] },
  { type: "fact", text: "Creators who post 3× per week grow 2–3× faster than weekly posters. Small, consistent actions win." },
  { title: "Pick your strengths", options: ["Writing","Design","Talking on camera","Research","Automation/tech"] },
  { title: "Audience presence", options: ["No audience","< 1k followers","1k–10k","10k+"] },
  { title: "Risk tolerance", options: ["Low","Medium","High"] },
  { title: "You enjoy…", options: ["Teaching","Reviewing products","Building tools","Selling offers"] },
  { type: "fact", text: "Short‑form content converted to email can 3–5× sales with the same traffic." },
  { title: "Monetization preference", options: ["Digital products","Services","Affiliate","UGC/brand deals"] },
  { title: "Niche interest", options: ["Fitness & health","Money & biz","Lifestyle","Tech & AI","Other"] },
  { title: "Consistency level", options: ["Daily","3× per week","Weekly","When I feel like it"] },
  { title: "Timeline goal", options: ["Side income","Replace a job","Build a brand asset"] },
  { type: "fact", text: "Most beginners reach the first €1k within 30–45 days when they ship daily 30‑min tasks." },
  { title: "Comfort with AI tools", options: ["New to it","I use prompts","I automate flows"] },
  { title: "Comfort on camera", options: ["Avoid it","Neutral","Enjoy it"] },
  { title: "Sales comfort", options: ["I hate selling","I can DM sell","I’m okay on calls","Funnels > calls"] },
  { title: "Pick your pace", options: ["Slow & steady","Balanced","Move fast"] },
];

const PATHS = {
  writer: {
    name: "Ghostwriting + Digital Products",
    why: "You said you enjoy writing and can be consistent. This stacks audience growth and compounding products.",
    todo: [
      "Pick a sub‑niche and 3 content pillars.",
      "Post 1 thread/idea + 2 short posts per day (15–20 min).",
      "Create a €9 starter product by day 7; link in bio.",
      "DM 10 leads/day offering a €79 outline or audit.",
      "Week 3: bundle posts → mini eBook; upsell €149 cohort."
    ]
  },
  camera: {
    name: "UGC + Affiliate Sprint",
    why: "You’re comfortable on camera and open to product reviews.",
    todo: [
      "Choose 1 product category and collect 10 brands.",
      "Shoot 5 × 15s hooks in batch (30 min).",
      "Send 10 UGC pitches/day; price €75–€250/video.",
      "Post daily reviews on TikTok/Reels + bio link (affiliate).",
      "Week 4: Turn top scripts into a €19 pack."
    ]
  },
  builder: {
    name: "Automation Micro‑SaaS + Tutorials",
    why: "You like tools and automation. Perfect for a quick utility + content.",
    todo: [
      "Identify a repeatable task. Build a no‑code tool (Bubble/Make).",
      "Publish 3 tutorial posts/week showing the workflow.",
      "Add a €9 template; upsell €39 premium version.",
      "Collect emails with a free checklist (lead magnet).",
      "By day 30: ship v1 and 2 customer interviews."
    ]
  }
};
