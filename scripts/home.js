import { getRandomQuestions, loadQuestion,storeRecentQuizData,showRecentQuizzes } from "./script.js";
let homeSection;
let quizSection;
let resultSection;
let questions = [];
let subject = "";
let currentQuestionIndex = 0;
let score = 0;

window.onload = () => {
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

  // show recent quiz list
  showRecentQuizzes();
  //next button
  const nextButton = document.getElementById("next-question");
  nextButton.addEventListener("click", async () => {
    //add score
    if (
      questions[currentQuestionIndex].correctAnswer ===
      questions[currentQuestionIndex].userAnswer
    ) {
      console.log(questions[currentQuestionIndex]);
      score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      await loadQuestion(questions, currentQuestionIndex);
      console.log("Current question index:", currentQuestionIndex);
    } else {
      console.log("Quiz completed!");
      //display score
      document.getElementById("final-score").textContent =
        `You scored ${score} out of ${questions.length}!`;
      showResult();
    }
  });
};

//load quiz data
async function loadQuizData(subject) {
  //store recent quiz data to localstorage
        storeRecentQuizData(subject);
  try {
    const res = await fetch(`./data/${subject.toLowerCase()}.json`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    questions = getRandomQuestions(data);

    console.log("Loaded quiz data:", subject);
  } catch (error) {
    console.error("Quiz failed to load:", error);
  }
}

function showHome() {
  homeSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
}

async function startQuiz(subject) {
  // const nextButton = document.getElementById("next-question");
  // nextButton.disabled = true;
  currentQuestionIndex = 0;
  score = 0; 
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




