const TOTAL_QUESTIONS = 5;

const state = {
  currentQuestion: 0,
  correctCount: 0,
  answer: 0,
  locked: false,
};

const itemArea = document.getElementById("itemArea");
const choices = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const progress = document.getElementById("progress");
const retryButton = document.getElementById("retryButton");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  return list
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.value);
}

function buildChoices(answer) {
  const candidates = new Set([answer]);

  while (candidates.size < 3) {
    const delta = rand(-2, 2);
    const next = Math.max(1, Math.min(10, answer + delta));
    candidates.add(next);
  }

  return shuffle([...candidates]);
}

function showQuestion() {
  state.locked = false;
  state.answer = rand(1, 10);

  itemArea.textContent = "⭐".repeat(state.answer);
  progress.textContent = `もんだい ${state.currentQuestion + 1} / ${TOTAL_QUESTIONS}`;
  feedback.textContent = "タップして こたえよう！";
  feedback.className = "feedback";

  choices.innerHTML = "";
  buildChoices(state.answer).forEach((value) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.type = "button";
    btn.textContent = String(value);
    btn.addEventListener("click", () => selectAnswer(value));
    choices.appendChild(btn);
  });
}

function selectAnswer(value) {
  if (state.locked) {
    return;
  }

  if (value === state.answer) {
    state.locked = true;
    state.correctCount += 1;
    feedback.textContent = "せいかい！ いいね！";
    feedback.className = "feedback good";

    setTimeout(nextQuestion, 700);
    return;
  }

  feedback.textContent = "おしい！ もういちど えらぼう";
  feedback.className = "feedback";
}

function nextQuestion() {
  state.currentQuestion += 1;

  if (state.currentQuestion >= TOTAL_QUESTIONS) {
    showResult();
    return;
  }

  showQuestion();
}

function showResult() {
  choices.innerHTML = "";
  itemArea.textContent = "🎉";
  progress.textContent = `クリア！ ${state.correctCount} / ${TOTAL_QUESTIONS}`;
  feedback.textContent = "さいごまで あそべたね！";
  feedback.className = "feedback good";
  retryButton.classList.remove("hidden");
}

function resetGame() {
  state.currentQuestion = 0;
  state.correctCount = 0;
  retryButton.classList.add("hidden");
  showQuestion();
}

retryButton.addEventListener("click", resetGame);
resetGame();
