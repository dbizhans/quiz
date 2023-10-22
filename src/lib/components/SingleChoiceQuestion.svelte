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
    export let isReviewMode
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
      if(isReviewMode){
        onNextQuestion()
      }else{
        let score = calculateScore();
        onAnswer(userAnswers);
        onNextQuestion(score);        
      }

    }
    function handleBack(){
      if(isReviewMode){
        onPreviousQuestion()
      }else{
        onAnswer(userAnswers)
        onPreviousQuestion()        
      }

    }
  </script>
  
  <main>        
    <h2 class="text-5xl font-bold mb-5">{question.text}</h2>
    <p class="text-red-700 text-2xl mb-5">{question.description}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <div>
            {#each question.answers as answer, index (answer.value)}
            {#if isReviewMode}
            <div class="{answer.state !== userAnswers[question.answers[index].id - 1] && userAnswers[question.answers[index].id - 1] ? 'border-4 border-red-600 rounded-md pl-2 mb-2' : ''}">
              <label class="text-3xl border border-gray-200 rounded mb-4 sm:text-2xl">
                <input
                  type="radio"
                  name="answer"
                  disabled
                  bind:group={selectedAnswer}
                  value={index}
                  class="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-3 dark:bg-gray-700 dark:border-gray-600"
                />
                {answer.value}
              </label>
              </div>
            {:else}
              <label class="text-3xl border border-gray-200 rounded mb-4 sm:text-2xl">
                <input
                  type="radio"
                  name="answer"
                  bind:group={selectedAnswer}
                  value={index}
                  on:change={() => handleAnswer(index)}
                  class="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-3 dark:bg-gray-700 dark:border-gray-600"
                />
                {answer.value}
              </label>
            {/if}
            {/each}
          </div>
        </div>
      
      {#if question.image}
      <img src={question.image} alt="Question Image" class="object-fit w-full"/>
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
      isDisabled={false}
    />
  </main>
  

  