function getRecentQuizzes() {
  return JSON.parse(localStorage.getItem("recentQuizzes")) || [];
}

function playSound(name) {
  new Audio(`../sounds/${name}.mp3`).play();
}

export function getRandomQuestions(quizData) {
  if (!quizData || quizData.length === 0) {
    console.error("Quiz data is not loaded or empty.");
    return [];
  }
  return [...quizData].sort(() => 0.5 - Math.random()).slice(0, 2);
}

export function loadQuestion(questions, currentQuestionIndex) {
  const nextButton = document.getElementById("next-question");
  nextButton.disabled = true;

  // Hide explanation from previous question
  document.getElementById("explanation-box").classList.add("hidden");

  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options-container");

  if (!questions || questions.length === 0) {
    console.error("No questions available to load.");
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionId = `option${index + 1}`;

    const wrapper = document.createElement("div");
    wrapper.classList.add("recent-quiz-item");
    wrapper.id = `recent-quiz-item-${index + 1}`;

    const input = document.createElement("input");
    input.type = "radio";
    input.id = optionId;
    input.name = "options";
    input.value = option;
    input.classList.add("answers");

    const label = document.createElement("label");
    label.htmlFor = optionId;
    label.classList.add("option");
    label.textContent = option;

    wrapper.append(input, label);
    optionsElement.appendChild(wrapper);

    input.addEventListener("change", () =>
      selectAnswer(currentQuestion, index),
    );
  });
}

function applyStyle(element, bg, color, border) {
  element.style.backgroundColor = bg;
  element.style.color = color;
  element.style.border = border;
}

function selectAnswer(question, index) {
  question.userAnswer = index;

  const selected = document.getElementById(`recent-quiz-item-${index + 1}`);
  const correct = document.getElementById(
    `recent-quiz-item-${question.correctAnswer + 1}`,
  );

  if (question.correctAnswer === index) {
    applyStyle(selected, "#d4edda", "#155724", "2px solid #28a745");
    playSound("correct");
  } else {
    applyStyle(selected, "#f8d7da", "#721c24", "2px solid #dc3545");
    applyStyle(correct, "#d4edda", "#155724", "2px solid #28a745");
    playSound("wrong");
  }

  document
    .querySelectorAll(".answers")
    .forEach((input) => (input.disabled = true));
  document.getElementById("next-question").disabled = false;

  // Show explanation
  const explanationBox = document.getElementById("explanation-box");
  document.getElementById("explanation-text").textContent =
    question.explanation || "";
  explanationBox.classList.remove("hidden");
}

// local storage
export function storeRecentQuizData(subject) {
  const updated = [
    { subject, date: new Date() },
    ...getRecentQuizzes().filter((q) => q.subject !== subject),
  ].slice(0, 5);

  localStorage.setItem("recentQuizzes", JSON.stringify(updated));
}

export function showRecentQuizzes() {
  const container = document.getElementById("recent-quiz-items");
  getRecentQuizzes().forEach((quiz) => {
    container.innerHTML += `
      <div class="recent-quiz-item">
        <img src="./images/${quiz.subject.toLowerCase()}.png" alt="${quiz.subject}" />
        <div class="recent-quiz-info">
          <p class="recent-quiz-subject">${quiz.subject} Quiz</p>
          <p class="recent-quiz-date">Last Attempt: ${dateFormat(quiz.date)}</p>
        </div>
      </div>`;
  });
}

function dateFormat(date) {
  const newDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (newDate.toDateString() === today.toDateString())
    return newDate.toLocaleTimeString();
  if (newDate.toDateString() === yesterday.toDateString()) return "Yesterday";
  return newDate.toLocaleDateString();
}

// greeting and streak functions
export function displayGreeting() {
  const hour = new Date().getHours();
  document.querySelector(".greeting h1").textContent =
    hour < 12 ? "Good Morning!" : "Good Afternoon!";
}

export function calculateStreak() {
  const uniqueDays = [
    ...new Set(getRecentQuizzes().map((q) => new Date(q.date).toDateString())),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let currentDate = new Date();

  for (const day of uniqueDays) {
    if (new Date(day).toDateString() === currentDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
