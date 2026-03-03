// ========================
// Quiz Data (demo)
// ========================
const quizData = [
  {
    question: "Who is the Prime Minister of Canada?",
    answers: ["Justin Trudeau", "Jagmeet Singh", "Pierre Poilievre", "Doug Ford"],
    correct: 0
  },
  {
    question: "Which language runs in a browser?",
    answers: ["Java", "C#", "Python", "JavaScript"],
    correct: 3
  },
  {
    question: "What does CSS stand for?",
    answers: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correct: 0
  },
  {
    question: "HTML stands for?",
    answers: ["Hyper Trainer Markup Language", "Hyper Text Markup Language", "Hyper Text Machine Language", "High Text Markup Language"],
    correct: 1
  },
  {
    question: "C# is developed by?",
    answers: ["Apple", "Google", "Microsoft", "Facebook"],
    correct: 2
  }
];

// ========================
// DOM Elements
// ========================
const questionEl = document.getElementById("question");
const answersEl = document.querySelector(".answers");
const nextBtn = document.getElementById("next-question");
const circle = document.querySelector(".progress-ring__circle");
const progressText = document.querySelector(".progress-text");

// Progress Circle setup
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = circumference;

// ========================
// Quiz State
// ========================
let currentQuestion = 0;
let answered = false; // track if user already answered

// ========================
// Functions
// ========================

// Show a question
function showQuestion(index) {
  const q = quizData[index];
  questionEl.textContent = q.question;
  answersEl.innerHTML = ""; // clear previous answers
  answered = false;

  q.answers.forEach((answer, i) => {
    const label = document.createElement("label");
    label.classList.add("answer");

    label.innerHTML = `
      <input type="radio" name="answer" value="${i}" />
      <span>${answer}</span>
    `;

    // Disable input click after one selection
    label.querySelector("input").addEventListener("click", () => {
      if (answered) return;
      answered = true;
      showAnswerFeedback(i, q.correct);
    });

    answersEl.appendChild(label);
  });

  animateProgress(index + 1, quizData.length);
}

// Show correct/wrong feedback
function showAnswerFeedback(selectedIndex, correctIndex) {
  const labels = document.querySelectorAll(".answer");
  labels.forEach((label, i) => {
    const span = label.querySelector("span");
    if (i === correctIndex) {
      span.style.backgroundColor = "#28a745"; // green
      span.style.color = "#fff";
    } else if (i === selectedIndex) {
      span.style.backgroundColor = "#dc3545"; // red
      span.style.color = "#fff";
    }
    label.querySelector("input").disabled = true; // disable all inputs
    label.style.pointerEvents = "none";
    label.style.transition = "0.3s";
    label.style.borderRadius = "8px";
    label.style.padding = "5px";
  });
}

// Animate circular progress
function animateProgress(current, total) {
  const targetOffset = circumference - (current / total) * circumference;
  const duration = 500; // ms
  const startOffset = parseFloat(circle.style.strokeDashoffset);
  const startTime = performance.now();

  // Color interpolation from white (#ffffff) to yellow (#FFD700)
  const startColor = [255, 255, 255]; // white
  const endColor = [255, 215, 0]; // gold/yellow

  function interpolateColor(progress) {
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * progress);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * progress);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * progress);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const newOffset = startOffset + (targetOffset - startOffset) * progress;
    circle.style.strokeDashoffset = newOffset;

    // Update color
    circle.style.stroke = interpolateColor(current / total * progress);

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
  progressText.textContent = `${current}/${total}`;
}

// ========================
// Event Listeners
// ========================
nextBtn.addEventListener("click", () => {
  if (!answered) {
    alert("Please select an answer first!");
    return;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion(currentQuestion);
  } else {
    alert("🎉 Quiz Completed!");
    currentQuestion = 0; // reset demo
    showQuestion(currentQuestion);
  }
});

// ========================
// Init
// ========================
showQuestion(currentQuestion);