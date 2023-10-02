<script>
    import NextButton from "./NextButton.svelte";
    import BackButton from "./BackButton.svelte";
    import shuffle from 'shuffle-array';
    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let userAnswers
    export let onNextQuestion;
    export let onPreviousQuestion;
    let translations;
    if (language === 'en') {
      translations = new Map([
        ['optionSelect', 'Select'],
        ['optionOdd', 'Odd'],
      ]);
    } else if (language === 'ru') {
      translations = new Map([
        ['optionSelect', 'Выбрать'],
        ['optionOdd', 'Лишний'],
      ]);
    } else if (language === 'lv') {
      translations = new Map([
        ['optionSelect', 'Izvēlēties'],
        ['optionOdd', 'Lieks'],
      ]);
    }
    if (!userAnswers.length) {
      userAnswers = new Array(question.answers.length).fill(translations.get('optionSelect'));
      shuffle(question.answers)
    }
    let isNextDisabled = true; 
    if (!userAnswers.includes(translations.get('optionSelect'))) {
        isNextDisabled = false;
      }
    function handleAnswer(index) {
      if (!isNextDisabled || !userAnswers.includes(translations.get('optionSelect'))) {
        isNextDisabled = false;
      }
    }
    
    function handleBack(){
      onAnswer(userAnswers)
      onPreviousQuestion()
    }
    function calculateScore() {
      return question.answers.every((answer, index) => {
        return (userAnswers[question.answers[index].id-1]===translations.get('optionOdd')) || (userAnswers[question.answers[index].id-1]===answer.order)
      }) ? 1 : 0;
    }

    function handleNext() {
        let score = calculateScore();
        onAnswer(userAnswers);
        onNextQuestion(score);
    }
  </script>
  
  <main>
    <h2 class="text-5xl font-bold mb-5">{question.text}</h2>
    <p class="text-red-700 text-2xl mb-5">{question.description}</p>
  
    <div class="question-container">
      <ol>
        {#each question.answers as answer, index}
          <li class="mb-4">
            <select 
              bind:value={userAnswers[question.answers[index].id-1]}
              on:change={() => handleAnswer(index)}
              class="p-2 text-2xl mr-3 outline"
            >
              <option value={translations.get('optionSelect')} disabled>
                {translations.get('optionSelect')}
              </option>
              {#each Array(userAnswers.length + 1).fill('') as _, i}
                {#if i === 0}
                  <option value={0}>
                    {translations.get('optionOdd')}
                  </option>
                {:else}
                  <option value={i}>{i}</option>
                {/if}
              {/each}
            </select>
            <span class="text-2xl">{answer.value}</span>
          </li>
        {/each}
      </ol>
  
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
      isDisabled={false}
    />
  </main>
  

  