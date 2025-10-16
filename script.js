
// Questions list with explanations (French)
const QUESTIONS = [
    {
        text: '<div class="code-inline"><pre class="language-cpp"><code>std::string s = "apple";\nstd::string& ref = s;</code></pre></div>Quand on quitte le bloc, est-ce que <code>s</code> est vivant ?',
        answer: 'dead',
        explainGood: 'Correct — `s` est local et est détruit à la fin du bloc ; la référence devient invalide.',
        explainBad: 'Non — `s` est local donc détruit en quittant le bloc. Les références locales ne survivent pas.'
    },
    {
        text: 'Si on a une variable globale : <div class="code-inline"><pre class="language-cpp"><code>std::string global = "banana";</code></pre></div>et on prend une référence dessus dans une fonction, <code>global</code> est-il vivant après la fonction ?',
        answer: 'alive',
        explainGood: 'Exact — une variable globale vit tant que le programme tourne.',
        explainBad: 'Ce n\'est pas correct : une variable globale n\'est pas détruite à la sortie d\'une fonction.'
    },
    {
        text: 'Que se passe-t-il si on écrit: <div class="code-inline"><pre class="language-cpp"><code>std::string& make(){\n    std::string local = "x";\n    return local;\n}</code></pre></div> puis on fait <div class="code-inline"><pre class="language-cpp"><code>auto &r = make();</code></pre></div> ? (la valeur retournée est-elle vivante ?)',
        answer: 'dead',
        explainGood: 'Bonne réponse — `local` est détruit à la fin de make(), donc la référence retournée est pendante (dangling).',
        explainBad: 'Attention : la référence renvoie à une variable locale détruite, provoquant un comportement indéfini.'
    },
    {
        text: 'Si on utilise: <div class="code-inline"><pre class="language-cpp"><code>static std::string s = "date";\nreturn s;</code></pre></div> — la variable <code>s</code> (static) est-elle vivante après la sortie de la fonction ?',
        answer: 'alive',
        explainGood: 'Oui — `static` fait vivre la variable pendant toute la durée du programme.',
        explainBad: 'Non — contrairement aux variables locales, une variable static n\'est pas détruite à la sortie du bloc.'
    },
    {
        text: 'Si on a un objet créé dans un bloc et qu\'on stocke son adresse dans un pointeur d\'un objet externe (p.ex. <div class="code-inline"><pre class="language-cpp"><code>humanB.setWeapon(club);</code></pre></div> où <code>club</code> est local du bloc), l\'adresse est-elle sûre après le bloc ?',
        answer: 'dead',
        explainGood: 'Correct — la variable locale est détruite à la sortie du bloc ; le pointeur devient pendu.',
        explainBad: 'Faux — l\'adresse devient invalide si l\'objet local est détruit.'
    }
];

// State
let state = {
    idx: 0,
    score: 0,
    answers: [],
    timePerQuestion: 60,
    timer: null,
    countdownTimer: null
};

// Elements
const startEl = document.getElementById('start');
const startBtn = document.getElementById('startBtn');
const showRules = document.getElementById('showRules');
const rules = document.getElementById('rules');
const closeRules = document.getElementById('closeRules');
const countdownEl = document.getElementById('countdown');
const countText = document.getElementById('countText');
const quizEl = document.getElementById('quiz');
const questionText = document.getElementById('questionText');
const cur = document.getElementById('cur');
const total = document.getElementById('total');
const btnAlive = document.getElementById('btnAlive');
const btnDead = document.getElementById('btnDead');
const timeLeft = document.getElementById('timeLeft');
const bar = document.getElementById('bar');
const feedback = document.getElementById('feedback');
const explainText = document.getElementById('explainText');
const nextBtn = document.getElementById('nextBtn');
const scorePill = document.getElementById('score');
const results = document.getElementById('results');
const resultsList = document.getElementById('resultsList');
const summary = document.getElementById('summary');
const retry = document.getElementById('retry');
const download = document.getElementById('download');
const qcount = document.getElementById('qcount');
const qtime = document.getElementById('qtime');

// init UI
total.textContent = QUESTIONS.length;
qcount.textContent = QUESTIONS.length;
qtime.textContent = state.timePerQuestion;

startBtn.addEventListener('click', () => startCountdown());
showRules.addEventListener('click', () => { startEl.style.display = 'none'; rules.style.display = 'block'; });
closeRules.addEventListener('click', () => { rules.style.display = 'none'; startEl.style.display = 'flex'; });

function startCountdown() {
    startEl.style.display = 'none';
    countdownEl.style.display = 'flex';
    let n = 3;
    countText.textContent = n;
    countdownEl.classList.add('show');
    state.countdownTimer = setInterval(() => {
        n--;
        if (n > 0) countText.textContent = n;
        else if (n === 0) countText.textContent = 'GO!';
        else {
            clearInterval(state.countdownTimer);
            countdownEl.style.display = 'none';
            beginQuiz();
        }
    }, 900);
}

function beginQuiz() {
    state.idx = 0; state.score = 0; state.answers = [];
    quizEl.style.display = 'block'; results.style.display = 'none';
    renderQuestion();
}

function renderQuestion() {
    const q = QUESTIONS[state.idx];
    cur.textContent = state.idx + 1;
    // allow HTML in the question text (for nice code blocks)
    questionText.innerHTML = q.text;
    // highlight any code created by the question
    const codes = questionText.querySelectorAll('pre code');
    codes.forEach(el => { if (window.Prism) Prism.highlightElement(el); });

    feedback.style.display = 'none'; explainText.textContent = '';
    btnAlive.className = 'choice'; btnDead.className = 'choice';
    nextBtn.style.display = 'none';
    scorePill.textContent = 'Score: ' + state.score;
    startTimer(state.timePerQuestion);
}

function startTimer(seconds) {
    let remaining = seconds;
    bar.style.width = '100%';
    timeLeft.textContent = remaining + 's';
    clearInterval(state.timer);
    const tick = () => {
        remaining -= 0.2; // update more smoothly every 200ms
        if (remaining <= 0) {
            bar.style.width = '0%'; timeLeft.textContent = '0s'; clearInterval(state.timer); onAnswer(null);
        } else {
            timeLeft.textContent = Math.ceil(remaining) + 's';
            const pct = Math.max(0, remaining / seconds * 100);
            bar.style.width = pct + '%';
        }
    };
    state.timer = setInterval(tick, 200);
}

function onAnswer(chosen) {
    clearInterval(state.timer);
    const q = QUESTIONS[state.idx];
    const correct = q.answer;
    const isCorrect = (chosen === correct);
    state.answers.push({ question: q.text, chosen, correct, explainGood: q.explainGood, explainBad: q.explainBad });
    // update UI
    feedback.style.display = 'block';
    explainText.textContent = isCorrect ? q.explainGood : q.explainBad;
    // marking
    if (chosen === 'alive') btnAlive.classList.add(isCorrect ? 'correct' : 'wrong');
    if (chosen === 'dead') btnDead.classList.add(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) state.score += 1; scorePill.textContent = 'Score: ' + state.score;
    nextBtn.style.display = 'inline-block';
    // if last question, show finish
    if (state.idx === QUESTIONS.length - 1) {
        nextBtn.textContent = 'Terminer';
    } else {
        nextBtn.textContent = 'Suivant';
    }
}

btnAlive.addEventListener('click', () => { onAnswer('alive'); });
btnDead.addEventListener('click', () => { onAnswer('dead'); });
nextBtn.addEventListener('click', () => {
    if (state.idx === QUESTIONS.length - 1) showResults();
    else { state.idx++; renderQuestion(); }
});

function showResults() {
    quizEl.style.display = 'none'; results.style.display = 'block';
    summary.textContent = `Tu as obtenu ${state.score}/${QUESTIONS.length} bonnes réponses.`;
    resultsList.innerHTML = '';
    state.answers.forEach((a, i) => {
        const el = document.createElement('div'); el.className = 'result-item';
        const tag = document.createElement('span'); tag.className = 'tag ' + (a.chosen === a.correct ? 'good' : 'bad'); tag.textContent = (a.chosen === a.correct ? 'Bonne' : 'Mauvaise');
        const qh = document.createElement('div'); qh.style.marginTop = '6px'; qh.innerHTML = `<strong>Q${i + 1}.</strong> ${a.question}`;
        const ans = document.createElement('div'); ans.style.marginTop = '8px'; ans.innerHTML = `<strong>Ta réponse:</strong> ${a.chosen || 'Aucune (temps écoulé)'} — <strong>Correcte:</strong> ${a.correct}`;
        const ex = document.createElement('div'); ex.style.marginTop = '8px'; ex.className = 'small'; ex.textContent = a.chosen === a.correct ? a.explainGood : a.explainBad;
        el.appendChild(tag); el.appendChild(qh); el.appendChild(ans); el.appendChild(ex);
        resultsList.appendChild(el);
    });
}

retry.addEventListener('click', () => { results.style.display = 'none'; startEl.style.display = 'flex'; });

download.addEventListener('click', () => {
    const data = { score: state.score, total: QUESTIONS.length, answers: state.answers, timePerQuestion: state.timePerQuestion, date: (new Date()).toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'vrai_mort_results.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

