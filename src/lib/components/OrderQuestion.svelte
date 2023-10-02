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
    <h2 style="font-size: 24px; margin-bottom: 10px;">{question.text}</h2>
    <p style="color: red; font-size: 14px; margin-bottom: 10px;">{question.description}</p>
  
    <div class="question-container">
      <ol class="options">
        {#each question.answers as answer, index}
          <li>
            <select
              bind:value={userAnswers[question.answers[index].id-1]}
              on:change={() => handleAnswer(index)}
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
            {answer.value}
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
        translations={translations}
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
      margin-right: 20px;
      list-style-type: none;
      padding-left: 0;
    }
  
    .options li {
      margin-bottom: 10px;
    }
  
    .image {
      flex: 1;
    }
  </style>
  