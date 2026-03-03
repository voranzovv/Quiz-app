import { getRandomQuestions ,loadQuestion} from "./script.js";
let homeSection;
let quizSection;
let resultSection;
let questions= [];
let subject = "javascript"; 
let currentQuestionIndex = 0;
let score = 0;

window.onload= () => {
  homeSection = document.querySelector(".home-section");
  quizSection = document.querySelector(".quiz-section");
  resultSection = document.querySelector(".result-section");
  // loadQuizData(subject);
  showHome();
  // Add event listeners for quiz items
  const quizItems = document.querySelectorAll(".discover-item");
  quizItems.forEach((item) => {
    item.addEventListener("click", async () => {
      // Grab the <p> text inside this article
      subject = item.querySelector("p").textContent;
      await startQuiz(subject);
      // console.log("Clicked quiz item for subject:", subject);
    });
  });
};

//load quiz data
async function loadQuizData(subject) {
  try {
    const res = await fetch(`./data/${subject.toLowerCase()}.json`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    questions = getRandomQuestions(data);

    console.log("Loaded quiz data:", questions);

  } catch (error) {
    console.error("Quiz failed to load:", error);
  }
}

function showHome() {
  homeSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  // homeSection.classList.remove("hidden");
  // quizSection.classList.remove("hidden");
  // resultSection.classList.add("hidden");
}

async function startQuiz(subject) {
  // console.log("Starting quiz for subject:", subject);
  await loadQuizData(subject);

  homeSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  resultSection.classList.add("hidden");

  await loadQuestion(questions, currentQuestionIndex);
}

function showResult() {
  homeSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
}
