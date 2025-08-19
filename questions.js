// You can edit this list. First item will always be the age group.
const QUESTIONS = [
  {
    key: 'age',
    title: 'What is your age?',
    options: [
      {label:'18–25', value:'18-25'},
      {label:'26–35', value:'26-35'},
      {label:'36–49', value:'36-49'},
      {label:'50+', value:'50+'},
    ]
  },
  { key:'experience', title:'Experience selling online?', options:[
      {label:'None', value:'none'},
      {label:'Some attempts', value:'some'},
      {label:'Consistent sales', value:'pro'}
    ]
  },
  { key:'time', title:'How much time can you invest daily?', options:[
      {label:'30 minutes', value:'30'},
      {label:'1 hour', value:'60'},
      {label:'2+ hours', value:'120'}
    ]
  },
  { key:'skills', title:'Pick your strongest skill', options:[
      {label:'Writing', value:'writing'},
      {label:'Design', value:'design'},
      {label:'Video/Editing', value:'video'},
      {label:'Sales/DMs', value:'sales'}
    ]
  },
  { key:'audience', title:'Do you have any audience or followers?', options:[
      {label:'No audience', value:'none'},
      {label:'Small ( <1k )', value:'1k'},
      {label:'Growing (1k–10k)', value:'10k'},
      {label:'Established (10k+)', value:'10kplus'}
    ]
  },
  { key:'tools', title:'Comfort with AI tools?', options:[
      {label:'Beginner', value:'beg'},
      {label:'Intermediate', value:'int'},
      {label:'Advanced', value:'adv'}
    ]
  },
  { key:'offers', title:'What would you enjoy building first?', options:[
      {label:'Service / Freelance', value:'service'},
      {label:'Digital Product', value:'product'},
      {label:'Affiliate / Curation', value:'affiliate'}
    ]
  },
  { key:'money', title:'What is your 90‑day income goal?', options:[
      {label:'€500–€1k', value:'500-1k'},
      {label:'€1k–€3k', value:'1-3k'},
      {label:'€3k–€10k', value:'3-10k'}
    ]
  },
  { key:'cold', title:'Are you comfortable sending cold DMs/emails?', options:[
      {label:'Yes', value:'yes'},
      {label:'No', value:'no'},
      {label:'With a script', value:'script'}
    ]
  },
  { key:'learn', title:'How do you prefer learning?', options:[
      {label:'Short checklists', value:'check'},
      {label:'Video mini-lessons', value:'video'},
      {label:'Templates & prompts', value:'tpl'}
    ]
  },
  // add until 20 to mirror previous flow
  { key:'platform', title:'Pick a platform you like most', options:[
      {label:'Instagram', value:'ig'},
      {label:'TikTok', value:'tt'},
      {label:'LinkedIn', value:'li'},
      {label:'Twitter/X', value:'tw'}
    ]
  },
  { key:'niche', title:'Choose a niche you enjoy', options:[
      {label:'Fitness/Wellness', value:'fit'},
      {label:'Money/Career', value:'money'},
      {label:'Self‑Improvement', value:'self'},
      {label:'Tech/AI', value:'tech'}
    ]
  },
  { key:'client', title:'Preferred work style', options:[
      {label:'Solo & flexible', value:'solo'},
      {label:'I like clients', value:'clients'},
      {label:'Team projects', value:'team'}
    ]
  },
  { key:'deadline', title:'Which pace suits you?', options:[
      {label:'Slow & steady', value:'slow'},
      {label:'Balanced', value:'balanced'},
      {label:'Sprint mode', value:'sprint'}
    ]
  },
  { key:'budget', title:'Budget for tools in month 1', options:[
      {label:'€0–€20', value:'0-20'},
      {label:'€20–€50', value:'20-50'},
      {label:'€50+', value:'50+'}
    ]
  },
  { key:'experience2', title:'Any previous freelance/service delivery?', options:[
      {label:'Yes', value:'yes'},
      {label:'No', value:'no'}
    ]
  },
  { key:'writing', title:'Comfort writing 5 DMs/day?', options:[
      {label:'Easy', value:'easy'},
      {label:'Doable', value:'doable'},
      {label:'Prefer not', value:'nope'}
    ]
  },
  { key:'camera', title:'Comfort on camera?', options:[
      {label:'Love it', value:'love'},
      {label:'Okay', value:'ok'},
      {label:'Prefer not', value:'not'}
    ]
  },
  { key:'asset', title:'Which asset would you build first?', options:[
      {label:'Lead magnet', value:'lead'},
      {label:'Offer page', value:'offer'},
      {label:'Portfolio', value:'portfolio'}
    ]
  },
  { key:'commit', title:'Ready to execute daily for 30 days?', options:[
      {label:'Absolutely', value:'yes'},
      {label:'Probably', value:'prob'},
      {label:'Not sure', value:'ns'}
    ]
  }
];
