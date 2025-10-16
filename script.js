// Questions list with explanations (French)
// Note : chaque question peut optionnellement fournir un `choices` array.
// If absent, it defaults to the binary choices 'alive'/'dead'.
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
        text: 'Regarde ce code :<div class="code-inline"><pre class="language-cpp"><code>class HumanB {\n    Weapon* weapon;\npublic:\n    void setWeapon(Weapon& w) { weapon = &w; }\n    void attack() { std::cout << weapon->getType(); }\n};\n\nint main() {\n    HumanB jim;\n    {\n        Weapon club("crude spiked club");\n        jim.setWeapon(club);\n    } // fin du bloc : club est détruit ici !\n\n    jim.attack(); // 💥 que se passe-t-il ?\n}</code></pre></div>\nLe pointeur dans <code>jim</code> est-il encore sûr après la fin du bloc ?',
        choices: [
            { value: 'safe', label: 'Oui — l\'adresse reste valide tant que le pointeur existe' },
            { value: 'dead', label: 'Non — le pointeur devient pendu après la destruction de club' },
            { value: 'copied', label: 'Oui — une copie de l\'objet a été faite' },
            { value: 'undefined', label: 'Comportement indéfini, mais pas forcément dangereux' }
        ],
        answer: 'dead',
        explainGood: 'Exact ! Quand le bloc se termine, la variable locale <code>club</code> est détruite, donc l\'adresse que <code>jim</code> garde n\'a plus de sens. Le pointeur devient "dangling" (pendu) et accéder à <code>*weapon</code> cause un comportement indéfini.',
        explainBad: 'Non — <code>club</code> est une variable locale détruite à la fin du bloc. Le pointeur dans <code>jim</code> continue à pointer vers une zone mémoire qui n\'appartient plus au programme, ce qui est dangereux.'
    },
    {
        text: '<div class="code-inline"><pre class="language-cpp"><code>std::string fruit = "mango";\n\nvoid foo() {\n    std::string local = "pear";\n    std::string& ref = fruit;\n}\n\nint main() {\n    foo();\n    std::cout << fruit << std::endl;\n}</code></pre></div>Quand <code>main()</code> affiche <code>fruit</code>, est-il vivant ?',
        answer: 'alive',
        explainGood: 'Vivant ! La variable globale `fruit` existe pendant toute la durée du programme — foo() ne la détruit pas.',
        explainBad: 'Faux — une variable globale ne disparaît pas quand on quitte une fonction locale.'
    },
    {
        text: '<div class="code-inline"><pre class="language-cpp"><code>std::string& make() {\n    static std::string s = \"plum\";\n    return s;\n}\n\nint main() {\n    std::string& r1 = make();\n    std::string& r2 = make();\n}\n</code></pre></div>Combien d\'objets <code>std::string</code> réels existent en mémoire à la fin de <code>main()</code> ?',
        choices: [
            { value: '0', label: '0' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' }
        ],
        answer: '1',
        explainGood: 'Exactement 1 objet : `s` est static et unique ; `r1` et `r2` sont deux références vers le même objet.',
        explainBad: 'Incorrect — r1 et r2 sont des références, pas des copies : il n\'y a qu\'une seule instance de `s`.'
    },
    {
        text: '<div class="code-inline"><pre class="language-cpp"><code>void bar(const std::string& ref) {\n    std::cout << ref << std::endl;\n}\n\nint main() {\n    bar(\"grape\");\n}</code></pre></div>Le littéral <code>"grape"</code> est-il vivant pendant l\'exécution de <code>bar()</code> ?',
        answer: 'alive',
        explainGood: 'Vivant ! Les littéraux de chaîne sont stockés dans la zone de données du binaire et existent jusqu\'à la fin du programme.',
        explainBad: 'Incorrect — les littéraux ne sont pas des variables locales et ne disparaissent pas à la fin de la fonction.'
    },
    {
        text: '<div class="code-inline"><pre class="language-cpp"><code>std::string getName() {\n    return \"lemon\";\n}\n\nint main() {\n    const std::string& ref = getName();\n    std::cout << ref << std::endl;\n}</code></pre></div>Pourquoi ce code fonctionne-t-il (la référence const est liée à un tempora) ?',
        choices: [
            { value: 'lifetime', label: 'Parce que la liaison d\'un temporaire à une référence const prolonge sa durée de vie' },
            { value: 'optimizer', label: 'Parce que le compilateur optimise et garde le temporaire' },
            { value: 'copy', label: 'Parce que il y a une copie automatique dans main()' },
            { value: 'undefined', label: 'Ce code est toujours undefined behaviour' }
        ],
        answer: 'lifetime',
        explainGood: 'Oui — la règle C++ prolonge la durée de vie d\'un temporaire quand il est lié à une référence const, donc la référence reste valide pendant la durée de la variable `ref`.',
        explainBad: 'Non — ce n\'est pas une coïncidence du compilateur : c\'est la règle de prolongation de durée de vie pour les temporaires liés à une référence const.'
    }
];


// State
let state = {
    idx: 0,
    score: 0,
    answers: [],
    timePerQuestion: 60,
    timer: null,
    countdownTimer: null,
    answered: false
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
const choicesContainer = document.querySelector('.choices');
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
    nextBtn.style.display = 'none';
    scorePill.textContent = 'Score: ' + state.score;
    state.answered = false;

    // render choices dynamically
    choicesContainer.innerHTML = '';
    const choiceList = q.choices ? q.choices : [
        { value: 'alive', label: 'Vivant' },
        { value: 'dead', label: 'Mort' }
    ];

    choiceList.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.dataset.answer = c.value;
        btn.type = 'button';
        btn.innerText = c.label;
        btn.addEventListener('click', () => handleChoiceClick(c.value, btn));
        choicesContainer.appendChild(btn);
    });

    startTimer(state.timePerQuestion);
}

function handleChoiceClick(value, btn) {
    if (state.answered) return; // prevent double answers
    onAnswer(value);
    // mark clicked button as selected (visual)
    const all = choicesContainer.querySelectorAll('.choice');
    all.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
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
    state.answered = true;

    // update UI
    feedback.style.display = 'block';
    explainText.textContent = (chosen === correct) ? q.explainGood : q.explainBad;

    // marking: style all choice buttons accordingly
    const all = choicesContainer.querySelectorAll('.choice');
    all.forEach(btn => {
        const val = btn.dataset.answer;
        btn.classList.remove('correct', 'wrong', 'selected');
        if (val === correct) btn.classList.add('correct');
        else if (chosen && val === chosen && val !== correct) btn.classList.add('wrong');
        // disable further clicks
        btn.disabled = true;
    });

    // scoring
    if (isCorrect) state.score += 1;
    scorePill.textContent = 'Score: ' + state.score;

    nextBtn.style.display = 'inline-block';
    // if last question, show finish
    nextBtn.textContent = (state.idx === QUESTIONS.length - 1) ? 'Terminer' : 'Suivant';
}

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
