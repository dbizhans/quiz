<script>
    import NextButton from "./NextButton.svelte";

    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let questionsLen;
    export let onNextQuestion;
    export let language;
    let questions = question.questions;
    let userAnswers = new Array(questions.length).fill([]);
    let isNextDisabled = true;
    console.log(questions)
    console.log(userAnswers)
    let totalScore = 0;
    function handleAnswer(index, answerIndex) {
        if (questions[index].type === 'single-choice') {
        // For single-choice questions, store the selected answer index directly
            userAnswers[index] = answerIndex;
            isNextDisabled = false;
        } else if (questions[index].type === 'multiple-choice') {
        // For multiple-choice questions, toggle the selected answer index
        if (userAnswers[index].includes(answerIndex)) {
            // If the answer is already selected, remove it
            userAnswers[index] = userAnswers[index].filter((value) => value !== answerIndex);
        } else {
            // If the answer is not selected, add it
            userAnswers[index].push(answerIndex);
        }
        }

        let scores = userAnswers.map((_, index) => calculateScore(index));
        totalScore = scores.reduce((acc, score) => acc + score, 0);
        if (totalScore > 1) {
            totalScore = 1;
        }
        console.log(totalScore);
    }

  function calculateScore(index) {
    let questionScore = 0;
    const currentQuestion = questions[index];

    if (currentQuestion.type === 'single-choice') {
      const selectedAnswerIndex = userAnswers[index];
      const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
      if (selectedAnswer && selectedAnswer.state) {
        questionScore = 1/questions.length;
      }
    } /**else if (currentQuestion.type === 'multiple-choice') {
      currentQuestion.answers.forEach((answer, answerIndex) => {
        if (answer.state === userAnswers[index].includes(answerIndex)) {
          questionScore += 1 / currentQuestion.answers.length;
        } else {
            questionScore -= 1/ currentQuestion.answers.length;
        }
      });
      if (questionScore < 0) {
        questionScore = 0;
      } 
      questionScore = Math.round(questionScore * 100) / 100;
    }**/
    else if (currentQuestion.type === 'multiple-choice') {
        let correctCount = 0;
        currentQuestion.answers.forEach((answer, answerIndex) => {
        if (answer.state === userAnswers[index].includes(answerIndex)) {
            correctCount++;
        }
        });

        if (correctCount === currentQuestion.answers.length) {
        questionScore = 1/questions.length; // Award points only for all correct answers
        }
    }

    return questionScore;
  }

  function handleNext() {
    let scores = userAnswers.map((_, index) => calculateScore(index));
    totalScore = scores.reduce((acc, score) => acc + score, 0);
    onAnswer(userAnswers);
    onNextQuestion(totalScore);
  }

    let translations;
    if (language === 'en') {
        translations = new Map([
            ['buttonLabelNext', 'Next'],
            ['buttonLabelFinish', 'Finish'],
        ]);
        } else if (language === 'ru') {
        translations = new Map([
            ['buttonLabelNext', 'Далее'],
            ['buttonLabelFinish', 'Завершить'],
        ]);
        } else if (language === 'lv') {
        translations = new Map([
            ['buttonLabelNext', 'Nākamais'],
            ['buttonLabelFinish', 'Pabeigt'],
        ]);
    }
  </script>
  
  <main>
    {#each questions as q, index}
        <h2 style="font-size: 24px; margin-bottom: 10px;">{q.text}</h2>
        <p style="color: red; font-size: 14px; margin-bottom: 10px;">{q.description}</p>
    
        <div class="question-container">
          <div class="options">
            {#each q.answers as answer, answerIndex (answer.value)}
              <label>
                <input
                  type={q.type === 'single-choice' ? 'radio' : 'checkbox'}
                  name={`question-${index}`}
                  value={answerIndex}
                  on:change={() => handleAnswer(index, answerIndex)}
                />
                {answer.value}
              </label>
            {/each}
          </div>
    
          {#if q.image}
            <div class="image">
              <img src={q.image} alt="Question Image" style="max-width: 100%;" />
            </div>
          {/if}
        </div>
    {/each}
    
    <NextButton
        currentQuestionIndex={currentQuestionIndex}
        questionsLen={questionsLen}
        translations={translations}
        handleNext={handleNext}
        isDisabled={isNextDisabled}
    />
  </main>
  
  <style>
    .question-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }
  
    .options {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  
    .options label {
      margin-bottom: 10px;
    }
  
    .image {
      flex: 1;
    }
  </style>
  