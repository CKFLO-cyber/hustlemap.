const QUESTIONS = [
  { key:'age', title:'What is your age?', options:[
    {label:'18–25', value:'18-25'},
    {label:'26–35', value:'26-35'},
    {label:'36–49', value:'36-49'},
    {label:'50+', value:'50+'}
  ]},
  { key:'experience', title:'Experience selling online?', options:[
    {label:'None', value:'none'},
    {label:'Some attempts', value:'some'},
    {label:'Consistent sales', value:'pro'}
  ]},
  { key:'time', title:'How much time can you invest daily?', options:[
    {label:'30 minutes', value:'30'},
    {label:'1–2 hours', value:'60-120'},
    {label:'3–4 hours', value:'180-240'},
    {label:'5+ hours', value:'300+'}
  ]},
  { key:'skills', title:'Pick your strongest skill', options:[
    {label:'Writing', value:'writing'},
    {label:'Design', value:'design'},
    {label:'Video/Editing', value:'video'},
    {label:'Sales/DMs', value:'sales'}
  ]},
  { key:'audience', title:'Do you have any audience or followers?', options:[
    {label:'No audience', value:'none'},
    {label:'< 1k', value:'1k'},
    {label:'1k–10k', value:'10k'},
    {label:'10k+', value:'10k+'}
  ]},
  { key:'tools', title:'Comfort with AI tools?', options:[
    {label:'Beginner', value:'beg'},
    {label:'Intermediate', value:'int'},
    {label:'Advanced', value:'adv'}
  ]},
  { key:'offers', title:'What would you enjoy building first?', options:[
    {label:'Service / Freelance', value:'service'},
    {label:'Digital Product', value:'product'},
    {label:'Affiliate / Curation', value:'affiliate'}
  ]},
  { key:'money', title:'What is your 90-day income goal?', options:[
    {label:'€500–€1k', value:'500-1k'},
    {label:'€1k–€3k', value:'1-3k'},
    {label:'€3k–€10k', value:'3-10k'}
  ]},
  { key:'cold', title:'Are you comfortable sending cold DMs/emails?', options:[
    {label:'Yes', value:'yes'},
    {label:'No', value:'no'},
    {label:'With a script', value:'script'}
  ]},
  { key:'learn', title:'How do you prefer learning?', options:[
    {label:'Short checklists', value:'check'},
    {label:'Video mini-lessons', value:'video'},
    {label:'Templates & prompts', value:'tpl'}
  ]},

  ,{ key:'mindset', title:'Which statement fits you best?', options:[
    {label:'I need clear step-by-step tasks', value:'structured'},
    {label:'Give me targets and I’ll improvise', value:'flex'}
  ]},
  { key:'platform', title:'Where would you rather build?', options:[
    {label:'Instagram/TikTok', value:'shortform'},
    {label:'YouTube/Podcasts', value:'longform'},
    {label:'LinkedIn/Twitter', value:'text'}
  ]},
  { key:'offerType', title:'Which offer sounds easier to start?', options:[
    {label:'Services (done-for-you / freelancing)', value:'service'},
    {label:'Digital products (guides, templates)', value:'product'},
    {label:'Affiliate / referrals', value:'affiliate'}
  ]},
  { key:'skill', title:'Pick your strongest skill area', options:[
    {label:'Writing & communication', value:'writing'},
    {label:'Design / video / editing', value:'creative'},
    {label:'Ops / research / tech', value:'ops'}
  ]},
  { key:'collab', title:'Do you want to work with clients?', options:[
    {label:'Yes, I like client work', value:'client-yes'},
    {label:'Prefer no clients', value:'client-no'},
    {label:'Mixed is fine', value:'client-mixed'}
  ]},
  { key:'risk', title:'How do you feel about short-term risk?', options:[
    {label:'Low risk / slower growth', value:'low'},
    {label:'Medium risk / balanced', value:'med'},
    {label:'Higher risk / faster growth', value:'high'}
  ]},
  { key:'pace', title:'What work pace keeps you motivated?', options:[
    {label:'Slow & steady', value:'steady'},
    {label:'Sprints with breaks', value:'sprints'},
    {label:'All‑in for 30 days', value:'allin'}
  ]},
  { key:'support', title:'What would help you most?', options:[
    {label:'Templates & scripts', value:'templates'},
    {label:'Accountability checklist', value:'accountability'},
    {label:'Examples & case studies', value:'examples'}
  ]},
  { key:'automation', title:'Are you open to using AI/automation tools?', options:[
    {label:'Yes', value:'yes'},
    {label:'No', value:'no'},
    {label:'Curious but need guidance', value:'maybe'}
  ]},
  { key:'goal', title:'What is your first income goal?', options:[
    {label:'€100–€300/month', value:'100-300'},
    {label:'€300–€1k/month', value:'300-1k'},
    {label:'€1k–€3k+/month', value:'1k-3k'}
  ]}
];