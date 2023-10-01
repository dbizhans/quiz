<script>
    import NextButton from "./NextButton.svelte";
    import BackButton from "./BackButton.svelte";
    import shuffle from 'shuffle-array';
    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let onNextQuestion;
    export let userAnswers;
    export let onPreviousQuestion;

    if (!userAnswers.length) {
      userAnswers = new Array(question.answers.length).fill(false);
      shuffle(question.answers)
    }
    let selectedAnswer = null;
    let isNextDisabled = true; 
    if (userAnswers.indexOf(true)!== -1) {
      for (let i = 0; i < question.answers.length; i++) { 
        if (question.answers[i].id-1 === userAnswers.indexOf(true)) { 
          selectedAnswer = i
          isNextDisabled = false;
          break; 
        }
      }
    }

    function handleAnswer(index) {
        selectedAnswer = index; 
        userAnswers = new Array(question.answers.length).fill(false);
        userAnswers[question.answers[index].id-1] = true
        isNextDisabled = false;
    }

    function calculateScore() {
      return question.answers.every((answer, index) => {
        return answer.state === userAnswers[question.answers[index].id-1];
      }) ? 1 : 0;
    }

    function handleNext() {
      let score = calculateScore();
      onAnswer(userAnswers);
      onNextQuestion(score);
    }
    function handleBack(){
      onAnswer(userAnswers)
      onPreviousQuestion()
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
                type="radio"
                name="answer"
                bind:group={selectedAnswer}
                value={index}
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
        language={language}
        handleNext={handleNext}
        isDisabled={isNextDisabled}
    />
    <BackButton 
      currentQuestionIndex={currentQuestionIndex}
      handleBack={handleBack}
      language={language}
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
      max-height: 200px;
      overflow-y: auto;
      margin-right: 20px;
    }
  
    .options label {
      margin-bottom: 10px;
    }
  
    .image {
      flex: 1;
    }
  </style>
  