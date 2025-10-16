# Vivant ou Mort — quiz sur la durée de vie en C++

Petite appli web (HTML / CSS / JS) pour réviser la **durée de vie** en C++ : variables locales, `static`, références et pointeurs.  
Conçue pour être légère, responsive et facile à héberger (GitHub Pages).

[live link](https://aria-vero-s.github.io/cpp_quiz/)

---

## Aperçu
- Écran de démarrage simple et propre.
- Compte à rebours `3,2,1 → GO` puis questions à choix binaire **Vivant / Mort**.
- Minuteur par question.
- Page de résultats avec explications pour chaque réponse.
- Téléchargement des résultats au format JSON.

---

## Structure du dépôt
```
/ (repo root)
├─ index.html
├─ styles.css
├─ script.js
└─ README.md
```
---

## Personnaliser le quiz
### Modifier les questions / explications

Ouvre script.js et cherche le tableau QUESTIONS. Chaque entrée a cette forme :
```
{
  text: '<pre class="language-cpp"><code>...</code></pre> ...',
  answer: 'alive' | 'dead',
  explainGood: 'Texte si correct',
  explainBad: 'Texte si incorrect'
}
```
- text peut contenir du HTML (des blocs ```<pre><code class="language-cpp">...</code></pre>``` sont mis en évidence par Prism).

- answer doit être 'alive' ou 'dead'.

- explainGood / explainBad sont affichés après la réponse.

### Modifier le temps par question
Dans script.js, la valeur par défaut se trouve dans l’objet state :
```
timePerQuestion: 60
```
Change 60 par la durée souhaitée (en secondes).

## Idées d’améliorations

- Intégrer un fichier JSON séparé pour les questions, chargé dynamiquement.

- Mode “révision” affichant tous les extraits de code à la fin.

- Scores/Progress persistés via localStorage.

- Possibilité d’ajouter ses propres questions via UI.

- Traduction/choix de langue.