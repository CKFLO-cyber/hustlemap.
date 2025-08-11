// Simple quiz engine with segmented progress and crisp option cards
let state = {
  started: false,
  index: 0,
  answers: []
};

const startBtn = document.getElementById('startBtn');
const nextBtn  = document.getElementById('nextBtn');
const quizEl   = document.getElementById('quiz');
const qTitle   = document.getElementById('qTitle');
const optionsEl= document.getElementById('options');
const qNumEl   = document.getElementById('qNum');

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function updateSegments() {
  const total = QUESTIONS.length;
  const perSeg = Math.ceil(total/4);
  const current = state.index; // 0-based
  const seg1 = Math.min(current, perSeg);
  const seg2 = Math.max(0, Math.min(current - perSeg, perSeg));
  const seg3 = Math.max(0, Math.min(current - 2*perSeg, perSeg));
  const seg4 = Math.max(0, Math.min(current - 3*perSeg, perSeg));

  const toPct = (val) => Math.max(0, Math.min(100, (val / perSeg) * 100));

  document.getElementById('seg1').style.width = toPct(seg1) + '%';
  document.getElementById('seg2').style.width = toPct(seg2) + '%';
  document.getElementById('seg3').style.width = toPct(seg3) + '%';
  document.getElementById('seg4').style.width = toPct(seg4) + '%';
}

// Render current question
function render() {
  const q = QUESTIONS[state.index];
  qNumEl.textContent = (state.index + 1).toString();
  qTitle.textContent = q.title;

  optionsEl.innerHTML = '';
  nextBtn.disabled = true;

  q.options.forEach((label, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = label;
    div.onclick = () => {
      // single-select
      Array.from(document.querySelectorAll('.option')).forEach(el=>el.classList.remove('selected'));
      div.classList.add('selected');
      state.answers[state.index] = label;
      nextBtn.disabled = false;
    };
    optionsEl.appendChild(div);
  });

  updateSegments();
}

startBtn.addEventListener('click', () => {
  state.started = true;
  show(quizEl); // keep hero visible as requested
  render();
});

nextBtn.addEventListener('click', () => {
  if(state.index < QUESTIONS.length - 1){
    state.index++;
    render();
  } else {
    // End — for now just alert results
    alert('Thanks! Results calculation demo. Answers saved: ' + state.answers.length);
  }
});

// year
document.getElementById('y').textContent = new Date().getFullYear();
