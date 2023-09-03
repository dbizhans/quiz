<script>
    import NextButton from "./NextButton.svelte";

    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let onNextQuestion;

    let translations;
  
    if (language === 'en') {
      translations = new Map([
        ['buttonLabelNext', 'Next'],
        ['buttonLabelFinish', 'Finish'],
        ['optionSelect', 'Select'],
        ['optionOdd', 'Odd'],
      ]);
    } else if (language === 'ru') {
      translations = new Map([
        ['buttonLabelNext', 'Далее'],
        ['buttonLabelFinish', 'Завершить'],
        ['optionSelect', 'Выбрать'],
        ['optionOdd', 'Лишний'],
      ]);
    } else if (language === 'lv') {
      translations = new Map([
        ['buttonLabelNext', 'Nākamais'],
        ['buttonLabelFinish', 'Pabeigt'],
        ['optionSelect', 'Izvēlēties'],
        ['optionOdd', 'Lieks'],
      ]);
    }
  
    let userAnswers = question.answers.map((answer) => ({
      order: translations.get('optionSelect'), // Default to "Select"
      value: answer.value,
    })); // Track the user's order
  
    let isNextDisabled = true; // Initialize the "Next" button as enabled
  
    function handleAnswer(index) {
      // Enable "Next" button after an answer is chosen
      isNextDisabled = false;
      calculateScore()
    }

    function calculateScore() {
      let questionScore = 0;
      question.answers.forEach((answer, index) => {
        if (!answer.state && (userAnswers[index].order===translations.get('optionOdd'))) {
            questionScore += 1/question.answers.length;
        } else if (answer.order === userAnswers[index].order) {
            questionScore += 1/question.answers.length;
        } /**else {
            questionScore -= 1/question.answers.length;
        }**/
      });
      if (questionScore<0) {
        questionScore = 0;
      }
      questionScore = Math.round(questionScore * 100) / 100;
      console.log(questionScore)
      return questionScore;
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
              bind:value={userAnswers[index].order}
              on:change={() => handleAnswer(index)}
            >
              <option value={translations.get('optionSelect')} disabled>
                {translations.get('optionSelect')}
              </option>
              {#each Array(userAnswers.length + 1).fill('') as _, i}
                {#if i === 0}
                  <option value={translations.get('optionOdd')}>
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
  