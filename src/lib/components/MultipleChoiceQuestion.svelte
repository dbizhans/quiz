<script>
    import NextButton from "./NextButton.svelte";

    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let onNextQuestion;
    let userAnswers = new Array(question.answers.length).fill(false);
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
    function handleAnswer(index) {
      onAnswer(userAnswers);
    }
  
    function calculateScore() {
      let questionScore = 0;
      question.answers.forEach((answer, index) => {
        if (answer.state === userAnswers[index]) {
            questionScore += 1/question.answers.length;
        } else {
            questionScore -= 1/question.answers.length;
        }
      });
      if (questionScore<0) {
        questionScore = 0;
      }
      questionScore = Math.round(questionScore * 100) / 100;
      return questionScore;
    }
    function handleNext() {
        let score = calculateScore();
        
        onNextQuestion(score);
    }
  </script>
  
  <main>
    <h2 style="font-size: 24px; margin-bottom: 10px;">{question.text}</h2>
    <p style="color: red; font-size: 14px; margin-bottom: 10px;">{question.description}</p>
  
    <div class="question-container">
      <div class="options">
        {#each question.answers as answer, index (answer.value)}
          <label>
            <input
              type="checkbox"
              bind:checked={userAnswers[index]}
              on:change={() => handleAnswer(index)}
            />
            {answer.value}
          </label>
        {/each}
      </div>
  
      {#if question.image}
        <div class="image">
          <img src={question.image} alt="Question Image" style="max-width: 100%;" />
        </div>
      {/if}
    </div>
    <NextButton
        currentQuestionIndex={currentQuestionIndex}
        questionsLen={questionsLen}
        translations={translations}
        handleNext={handleNext}
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
  