let currentQuestionNumber = 0;
let totalQuestions = 20;
export function getRandomQuestions(quizData) {
  if (!quizData || quizData.length === 0) {
    console.error("Quiz data is not loaded or empty.");
    return [];
  }

  const shuffled = [...quizData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 20);
}

//load question into html elements!
export function loadQuestion(questions, currentQuestionIndex) {
  currentQuestionNumber = currentQuestionIndex;
  questions = questions;
  console.log("Loading question:", questions.length);
  //disable for every new question
  const nextButton = document.getElementById("next-question");
  nextButton.disabled = true;

  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options-container");
  // console.log(optionsElement);

  if (!questions || questions.length === 0) {
    console.error("No questions available to load.");
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = ""; // Clear previous options

  currentQuestion.options.forEach((option, index) => {
    // console.log(`Adding option ${index + 1}: ${option}`);
    const optionId = `option${index + 1}`;

    const wrapper = document.createElement("div");
    wrapper.classList.add("recent-quiz-item");
    wrapper.id = `recent-quiz-item-${index + 1}`;

    const input = document.createElement("input");
    input.type = "radio";
    input.id = optionId;
    input.name = `options`; // unique per question
    input.value = option;
    input.classList.add("answers");

    const label = document.createElement("label");
    label.htmlFor = optionId;
    label.classList.add("option");
    label.textContent = option;

    const feedback = document.createElement("div");
    feedback.id = `feedback-${optionId}`;
    feedback.classList.add("feedback");

    wrapper.append(input, label, feedback);
    optionsElement.appendChild(wrapper);

    // Add event listener for option selection
    const optionInput = document.getElementById(optionId);
    optionInput.addEventListener("change", () => {
      console.log(`Option ${index + 1} selected: ${option}`);
      selectAnswer(currentQuestion, index);
    });
  });
}

function selectAnswer(question, index) {
  //select answer
  question.userAnswer = index; //storing user answer
  const feedback = document.getElementById(`recent-quiz-item-${index + 1}`);

  if (question.correctAnswer === index) {
    feedback.style.backgroundColor = "#d4edda";
    feedback.style.color = "#155724";
    feedback.style.border = "2px solid #28a745";
    const audio = new Audio("../sounds/correct.mp3");
    audio.play();
  } else {
    feedback.style.backgroundColor = "#f8d7da";
    feedback.style.color = "#721c24";
    feedback.style.border = "2px solid #dc3545";
      const audio = new Audio("../sounds/wrong.mp3");
      audio.play();
  }
  // disable all inputs
  const inputs = document.querySelectorAll(".answers");
  inputs.forEach((input) => {
    input.disabled = true;
  });
  //show correct answer
  const correctOption = document.getElementById(
    `recent-quiz-item-${question.correctAnswer + 1}`,
  );
  correctOption.style.backgroundColor = "#d4edda";
  correctOption.style.color = "#155724";
  correctOption.style.border = "2px solid #28a745";

  // able to click next button
  const nextButton = document.getElementById("next-question");
  nextButton.disabled = false;
  nextButton.addEventListener("click", () => {
    document.getElementById("progress-bar-fill").style.width =
      `${((currentQuestionNumber + 1) / totalQuestions) * 100}%`;
  });
}

//recent quiz data store in localstorage
export function storeRecentQuizData(subject) {
  const recentQuizzes =
    JSON.parse(localStorage.getItem("recentQuizzes")) || [];

  // Remove existing entry of same subject
  const filtered = recentQuizzes.filter(
    (quiz) => quiz.subject !== subject
  );

  // Add new one at top
  const updated = [
    { subject: subject, date: new Date() },
    ...filtered,
  ];

  // limit to 5 recent quizzes
  const limited = updated.slice(0, 5);

  localStorage.setItem("recentQuizzes", JSON.stringify(limited));

  console.log("Stored recent quiz data:", limited);
}

export function showRecentQuizzes() {
  const recentQuizzes =
    JSON.parse(localStorage.getItem("recentQuizzes")).slice(0, 5) || [];
  recentQuizzes.forEach((quiz) => {
    const el = `
            <article class="recent-quiz-item">
              <img
                src="./images/${quiz.subject}.png"
                alt="${quiz.subject} Quiz"
                class="recent-quiz-item-image"
              />
              <div>
                <h3>${quiz.subject} Quiz</h3>
                <p>Last Attempt: ${dateFormat(quiz.date)}</p>
              </div>
            </article>`;
    document.getElementById("recent-quiz-items").innerHTML += el;
  });
}
function dateFormat(date){
  console.log(Date(), date);
  const newDate = new Date(date);
  const today = new Date();

  //today time
if (newDate.toDateString() === today.toDateString()) {
  return newDate.toLocaleTimeString();
}
  //yesterday
if (newDate.toDateString() === today.toDateString() - 1) {
  return "Yesterday";
}
//days ago
return newDate.toLocaleDateString();
}
export function displayGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning!" : "Good Afternoon!";
  document.querySelector(".greeting h1").textContent = greeting;
  
}

export function calculateStreak() {
  const data = localStorage.getItem("recentQuizzes")
    ? JSON.parse(localStorage.getItem("recentQuizzes"))
    : [];

  if (data.length === 0) return 0;

  // Convert dates and remove duplicates per day
  const uniqueDays = [...new Set(
    data.map((quiz) =>
      new Date(quiz.date).toDateString()
    )
  )];

  // Sort newest first
  uniqueDays.sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < uniqueDays.length; i++) {
    const quizDate = new Date(uniqueDays[i]);

    // Compare expected date
    if (
      quizDate.toDateString() ===
      currentDate.toDateString()
    ) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // go back 1 day
    } else {
      break; // streak stops
    }
  }
console.log(streak);
  return streak;
}