// Results page logic
let userName = '';
let userAnswers = {};

// Check access control and initialize page
function initResultsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const isPaid = urlParams.get('paid');
  const isDemo = urlParams.get('demo');
  
  // Check if user has access (paid or demo)
  if (isPaid === '1' || isDemo === '1') {
    // User has access, load and display results
    loadUserData();
    if (userName && Object.keys(userAnswers).length > 0) {
      showResults();
    } else {
      showError();
    }
  } else {
    // No access, show paywall fallback
    showPaywallFallback();
  }
}

// Load user data from localStorage
function loadUserData() {
  try {
    userName = localStorage.getItem('hm_name') || '';
    const answersStr = localStorage.getItem('hm_answers');
    if (answersStr) {
      userAnswers = JSON.parse(answersStr);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Show results content
function showResults() {
  // Update title with user's name
  const titleElement = document.getElementById('results-title');
  if (titleElement) {
    if (userName) {
      titleElement.textContent = `${userName}, your Remote Income Plan is ready`;
    } else {
      titleElement.textContent = 'Your Remote Income Plan is ready';
    }
  }
  
  // Start social count animation
  animateSocialCount();
  
  // Generate content based on user answers
  generatePathsContent();
  generateStepsContent();
  generateOffersContent();
  
  // Show results
  document.getElementById('results-content').classList.remove('hidden');
  
  // Set up materials CTA
  setupMaterialsCTA();
}

// Animate social count
function animateSocialCount() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show final number immediately for users who prefer reduced motion
    const countElement = document.getElementById('social-count');
    if (countElement) {
      countElement.textContent = '285,000';
    }
    return;
  }
  
  const startNumber = 284920;
  const endNumber = 285000;
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  
  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth ease-out
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentNumber = Math.floor(startNumber + (endNumber - startNumber) * easeOutProgress);
    
    const countElement = document.getElementById('social-count');
    if (countElement) {
      countElement.textContent = currentNumber.toLocaleString('en-US');
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateCount);
    }
  }
  
  requestAnimationFrame(updateCount);
}

// Generate paths content based on user answers
function generatePathsContent() {
  const pathsContent = document.getElementById('paths-content');
  if (!pathsContent) return;
  
  // Generate recommendations based on answers (simplified logic)
  const paths = generateRecommendations(userAnswers);
  
  const pathsHTML = paths.map(path => `
    <div class="path-item">
      <div class="path-header">
        <div class="path-name">${path.name}</div>
        <div class="path-meta">
          <span class="path-badge">${path.fit}</span>
          <span class="path-badge">${path.difficulty}</span>
          <span class="path-badge">${path.income}</span>
        </div>
      </div>
      <p class="path-description">${path.description}</p>
    </div>
  `).join('');
  
  pathsContent.innerHTML = pathsHTML;
}

// Generate steps content
function generateStepsContent() {
  const stepsContent = document.getElementById('steps-content');
  if (!stepsContent) return;
  
  const stepsHTML = `
    <div class="steps-grid">
      <div class="step-group">
        <h4>Week 1-7: Foundation</h4>
        <ul class="step-list">
          <li>Day 1: Choose your primary platform</li>
          <li>Day 2: Set up your profile and bio</li>
          <li>Day 3: Research 10 competitors in your niche</li>
          <li>Day 4: Create your first piece of content</li>
          <li>Day 5: Engage with 20 people in your niche</li>
          <li>Day 6: Plan your content calendar</li>
          <li>Day 7: Create 2 more pieces of content</li>
        </ul>
      </div>
      
      <div class="step-group">
        <h4>Week 8-14: Growth</h4>
        <ul class="step-list">
          <li>Day 8: Start daily engagement routine</li>
          <li>Day 9: Create your first lead magnet</li>
          <li>Day 10: Set up basic tracking</li>
          <li>Day 11: Create 3 pieces of content</li>
          <li>Day 12: Reach out to 5 potential clients</li>
          <li>Day 13: Optimize based on engagement</li>
          <li>Day 14: Plan your first offer</li>
        </ul>
      </div>
      
      <div class="step-group">
        <h4>Week 15-21: Monetization</h4>
        <ul class="step-list">
          <li>Day 15: Create your first service offer</li>
          <li>Day 16: Set up payment processing</li>
          <li>Day 17: Create sales materials</li>
          <li>Day 18: Launch your first offer</li>
          <li>Day 19: Follow up with prospects</li>
          <li>Day 20: Optimize your offer</li>
          <li>Day 21: Scale what's working</li>
        </ul>
      </div>
      
      <div class="step-group">
        <h4>Week 22-30: Scale</h4>
        <ul class="step-list">
          <li>Day 22: Analyze your results</li>
          <li>Day 23: Double down on winners</li>
          <li>Day 24: Create your next offer</li>
          <li>Day 25: Build your team</li>
          <li>Day 26: Automate processes</li>
          <li>Day 27: Expand to new platforms</li>
          <li>Day 28: Create passive income streams</li>
          <li>Day 29: Plan your next quarter</li>
          <li>Day 30: Celebrate and plan ahead</li>
        </ul>
      </div>
    </div>
  `;
  
  stepsContent.innerHTML = stepsHTML;
}

// Generate offers content
function generateOffersContent() {
  const offersContent = document.getElementById('offers-content');
  if (!offersContent) return;
  
  const offersHTML = `
    <ul class="offer-list">
      <li>Content creation services (€200-500 per piece)</li>
      <li>Social media management (€500-1500/month)</li>
      <li>Consulting calls (€100-300/hour)</li>
      <li>Digital products (€50-200)</li>
      <li>Affiliate partnerships (20-40% commission)</li>
    </ul>
    
    <h4>Quick-start Scripts</h4>
    
    <div class="script-box">
      <h5>Cold DM Template</h5>
      <p>"Hey [Name]! I noticed you're working on [specific project]. I've been helping [similar businesses] achieve [specific result] and thought you might be interested in a quick chat. Would love to share what's working for others in your space."</p>
    </div>
    
    <div class="script-box">
      <h5>Email Outreach</h5>
      <p>"Subject: Quick question about [their business] Hi [Name], I came across [specific detail about their business] and was impressed by [specific achievement]. I'm reaching out because I've been helping similar companies [specific benefit] and wondered if you'd be open to a 15-minute call to discuss how this might apply to your situation."</p>
    </div>
    
    <div class="script-box">
      <h5>LinkedIn Connection Request</h5>
      <p>"Hi [Name], I've been following your work in [industry] and really appreciate your insights on [specific topic]. I'm also working in this space and would love to connect and potentially collaborate. Looking forward to staying in touch!"</p>
    </div>
  `;
  
  offersContent.innerHTML = offersHTML;
}

// Generate recommendations based on user answers
function generateRecommendations(answers) {
  // Simplified recommendation logic based on quiz answers
  const recommendations = [
    {
      name: 'Content Creation',
      fit: 'High Match',
      difficulty: 'Beginner',
      income: '€2k-10k/mo',
      description: 'Based on your writing skills and comfort with daily content creation, this path leverages your natural abilities and can scale quickly.'
    },
    {
      name: 'Digital Services',
      fit: 'Medium Match',
      difficulty: 'Intermediate',
      income: '€3k-15k/mo',
      description: 'Your experience with tools and comfort with client work makes this a solid option for consistent income.'
    },
    {
      name: 'Affiliate Marketing',
      fit: 'Good Match',
      difficulty: 'Beginner',
      income: '€1k-8k/mo',
      description: 'Your ability to create content and engage with audiences makes this a great passive income stream.'
    }
  ];
  
  return recommendations;
}

// Set up materials CTA
function setupMaterialsCTA() {
  const materialsCTA = document.getElementById('materials-cta');
  if (materialsCTA) {
    materialsCTA.addEventListener('click', (e) => {
      e.preventDefault();
      
      // For now, show a placeholder message
      alert('Materials portal coming soon! This will contain your prompts, checklists, and frameworks.');
      
      // Optionally clear localStorage
      // localStorage.removeItem('hm_answers');
    });
  }
}

// Show paywall fallback
function showPaywallFallback() {
  document.getElementById('paywall-fallback').classList.remove('hidden');
}

// Show error message
function showError() {
  document.getElementById('error-message').classList.remove('hidden');
}

// Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', initResultsPage);



