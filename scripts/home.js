import {
  getRandomQuestions,
  loadQuestion,
  storeRecentQuizData,
  showRecentQuizzes,
  displayGreeting,
  calculateStreak,
} from "./script.js";

let homeSection;
let quizSection;
let resultSection;
let questions = [];
let subject = "";
let currentQuestionIndex = 0;
let score = 0;

function showSection(name) {
  homeSection.classList.toggle("hidden", name !== "home");
  quizSection.classList.toggle("hidden", name !== "quiz");
  resultSection.classList.toggle("hidden", name !== "result");
}

window.onload = () => {
  homeSection = document.querySelector(".home-section");
  quizSection = document.querySelector(".quiz-section");
  resultSection = document.querySelector(".result-section");

  displayGreeting();
  document.getElementById("streak").textContent = calculateStreak();
  showHome();

  const quizItems = document.querySelectorAll(".discover-item");
  quizItems.forEach((item) => {
    item.addEventListener("click", async () => {
      subject = item.querySelector("p").textContent;
      await startQuiz(subject);
    });
  });

  const nextButton = document.getElementById("next-question");
  nextButton.addEventListener("click", async () => {
    document.getElementById("progress-bar-fill").style.width =
      `${(currentQuestionIndex / questions.length) * 100}%`;

    if (
      questions[currentQuestionIndex].correctAnswer ===
      questions[currentQuestionIndex].userAnswer
    ) {
      score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      await loadQuestion(questions, currentQuestionIndex);
    } else {
      saveHighScore(subject, score);
      const best = getHighScore(subject);

      document.getElementById("final-score").textContent =
        `You scored ${score} out of ${questions.length}!`;
      document.getElementById("high-score").textContent =
        `Best Score for ${subject}: ${best} / ${questions.length}`;

      showSection("result");
    }
  });
};

async function loadQuizData(subject) {
  storeRecentQuizData(subject);
  try {
    const res = await fetch(`./data/${subject.toLowerCase()}.json`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    questions = getRandomQuestions(data);
  } catch (error) {
    console.error("Quiz failed to load:", error);
  }
}

function showHome() {
  showSection("home");
  document.getElementById("recent-quiz-items").innerHTML = "";
  showRecentQuizzes();
}

async function startQuiz(subject) {
  currentQuestionIndex = 0;
  score = 0;
  await loadQuizData(subject);
  showSection("quiz");
  await loadQuestion(questions, currentQuestionIndex);
}

//restart quiz
document.getElementById("restart-btn").addEventListener("click", () => {
  showHome();
});

function getHighScore(subject) {
  return parseInt(localStorage.getItem(`highScore_${subject}`)) || 0;
}

function saveHighScore(subject, score) {
  const current = getHighScore(subject);
  if (score > current) {
    localStorage.setItem(`highScore_${subject}`, score);
  }
}
