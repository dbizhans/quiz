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
  export let isReviewMode;
  console.log(userAnswers)
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
    if(isReviewMode){
      onNextQuestion();
    } else {
      let score = calculateScore();
      onAnswer(userAnswers)
      onNextQuestion(score);
    }
  }
  function handleBack(){
    if(isReviewMode){
      onPreviousQuestion()
    } else {
      onAnswer(userAnswers)
      onPreviousQuestion()
    }

  }
</script>

<main>
  <h2 class="text-5xl font-bold mb-5">{question.text}</h2>
  <p class="text-red-700 text-2xl mb-5">{question.description}</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  
    <div class="options">
      {#each question.answers as answer, index (answer.value)}
      {#if isReviewMode}
      <div class="{answer.state !== userAnswers[question.answers[index].id - 1] && userAnswers[question.answers[index].id - 1]? 'border-4 border-red-600 rounded-md pl-2 mb-2' : ''}">
        <label class="mb-2 text-3xl sm:text-2xl">
          <input
            type="checkbox"
            disabled
            bind:checked={userAnswers[question.answers[index].id-1]}
            class="w-5 h-5 border border-gray-200 rounded mb-4"
          />
          {answer.value}
        </label>
      </div>
      {:else}
        <label class="mb-2 text-3xl sm:text-2xl">
          <input
            type="checkbox"
            bind:checked={userAnswers[question.answers[index].id-1]}
            class="w-5 h-5 border border-gray-200 rounded mb-4"
          />
          {answer.value}
        </label>
      {/if}
      {/each}
    </div>
    {#if question.image}
    <div class="image">
      <img src={question.image} alt="Question Image" class="object-fit w-full" />
    </div>
  {/if}
  </div>
  <NextButton
      currentQuestionIndex={currentQuestionIndex}
      questionsLen={questionsLen}
      handleNext={handleNext}
      language={language}
      isDisabled={false}
  />
  <BackButton 
    currentQuestionIndex={currentQuestionIndex}
    handleBack={handleBack}
    language={language}
    isDisabled={false}
  />

</main>