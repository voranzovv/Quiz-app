export function getRandomQuestions(quizData) {
  if (!quizData || quizData.length === 0) {
    console.error("Quiz data is not loaded or empty.");
    return [];
  }

  const shuffled = [...quizData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 20);
}

//load quiz data

//load question into html elements
export function loadQuestion(questions, currentQuestionIndex) {
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
  } else {
    feedback.style.backgroundColor = "#f8d7da";
    feedback.style.color = "#721c24";
    feedback.style.border = "2px solid #dc3545";
  }
  // disable all inputs
  const inputs = document.querySelectorAll(".answers");
  inputs.forEach((input) => {
    input.disabled = true;
  });
  //show correct answer
  const correctOption = document.getElementById(`recent-quiz-item-${question.correctAnswer + 1}`);
  correctOption.style.backgroundColor = "#d4edda";
  correctOption.style.color = "#155724";
  correctOption.style.border = "2px solid #28a745";

  // able to click next button
  const nextButton = document.getElementById("next-question");
  nextButton.disabled = false;

}



