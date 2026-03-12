const TOTAL_QUESTIONS = 5;
const MIN_COUNT = 1;
const MAX_COUNT = 6;

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
  const candidates = new Set([answer, answer - 1, answer + 1]);

  for (let i = MIN_COUNT; candidates.size < 3 && i <= MAX_COUNT; i += 1) {
    candidates.add(i);
  }

  const cleaned = [...candidates].filter(
    (value) => value >= MIN_COUNT && value <= MAX_COUNT,
  );

  while (cleaned.length < 3) {
    cleaned.push(answer);
  }

  return shuffle(cleaned.slice(0, 3));
}

function renderItems(count) {
  itemArea.innerHTML = "";

  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("span");
    star.className = "item";
    star.textContent = "⭐";
    itemArea.appendChild(star);
  }
}

function showQuestion() {
  state.locked = false;
  state.answer = rand(MIN_COUNT, MAX_COUNT);

  renderItems(state.answer);
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
    choices.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
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
