
// 20 questions; age buckets simplified
const QUESTIONS = [
  { id: 1,  title: "Choose your age", options: ["18–25","26–35","36–49","50+"] },
  { id: 2,  title: "Experience selling online?", options: ["None","Some attempts","Consistent sales"] },
  { id: 3,  title: "Preferred work style", options: ["Solo & flexible","I like clients","Small team","I like managing people"] },
  { id: 4,  title: "Time available per day", options: ["<1 hour","1–2 hours","3–4 hours","5+ hours"] },
  { id: 5,  title: "Budget to start", options: ["$0–$50","$50–$200","$200–$1000","$1000+"] },
  { id: 6,  title: "Pick your strengths", options: ["Writing","Design/Video","Tech/Automation","Sales/Negotiation"] },
  { id: 7,  title: "Comfort on camera?", options: ["Yes","Prefer voice/screen","No"] },
  { id: 8,  title: "You prefer…", options: ["Quick flips","Recurring income","Building brand long-term"] },
  { id: 9,  title: "Risk tolerance", options: ["Low","Medium","High"] },
  { id: 10, title: "Niche interest", options: ["Fitness","Finance","Beauty","Gaming","Tech","Other"] },
  { id: 11, title: "Writing comfort", options: ["Short posts","Long articles","I prefer video"] },
  { id: 12, title: "Technical skills", options: ["Beginner","Intermediate","Advanced"] },
  { id: 13, title: "Email list?", options: ["No","Yes <1k","Yes >1k"] },
  { id: 14, title: "Social following", options: ["None","<5k","5k–50k","50k+"] },
  { id: 15, title: "Ad spend comfort", options: ["No ads","Small tests","Confident scaling"] },
  { id: 16, title: "Preferred product type", options: ["Digital","Services","Physical","Affiliate"] },
  { id: 17, title: "Client communication", options: ["DMs only","Calls ok","I avoid calls"] },
  { id: 18, title: "Team tools", options: ["Notion","Trello","Asana","ClickUp"] },
  { id: 19, title: "Learning pace", options: ["Fast & messy","Slow & steady","Follow a system"] },
  { id: 20, title: "Revenue target in 90 days", options: ["$500","$1k","$2–5k","$5k+"] }
];

// Interstitial copy
const DID_YOU_KNOW = [
  "Creators who publish consistently build trust faster than those who post in bursts. A simple 3–5 posts/week cadence beats perfection every time.",
  "Your first €1,000 online usually comes from a skill you already have—just packaged better. That's why we start with skills, not platforms.",
  "Email lists convert several times better than social DMs. We'll add a one-page lead magnet + welcome sequence to your plan.",
  "Short-form videos can be repurposed into carousels, emails, and scripts in minutes. You'll get a repeatable 1→5 repurpose routine."
];
