let homeSection;
let quizSection;
let resultSection;


window.onload = () => {
  homeSection = document.querySelector(".home-section");
  quizSection = document.querySelector(".quiz-section");
  resultSection = document.querySelector(".result-section");

  showHome();
};
function showHome() {
  homeSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
}

function startQuiz(subject) {
  console.log("Starting quiz for subject:", subject);
  homeSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  resultSection.classList.add("hidden");
}

function showResult() {
  homeSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
}