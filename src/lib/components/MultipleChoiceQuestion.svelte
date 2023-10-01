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
  
    function calculateScore() {
      return question.answers.every((answer, index) => {
        return answer.state === userAnswers[question.answers[index].id-1];
      }) ? 1 : 0;
    }


    function handleNext() {
        let score = calculateScore();
        onAnswer(userAnswers)
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
              type="checkbox"
              bind:checked={userAnswers[question.answers[index].id-1]}
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
        handleNext={handleNext}
        language={language}
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

    }
  
    .options label {
      margin-bottom: 10px;
    }
  
    .image {
      flex: 1;
    }
  </style>
  