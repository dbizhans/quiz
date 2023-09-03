<script>
    import NextButton from "./NextButton.svelte";

    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let onNextQuestion;
    let selectedAnswers = new Array(question.sections[0].length).fill(null);
    let isNextDisabled = true;
    let translations;
  
    const handleAnswer = (sectionIndex, optionIndex) => {
      selectedAnswers[sectionIndex] = optionIndex;
      isNextDisabled = selectedAnswers.includes(null);
      calculateScore()
    };
  
    const calculateScore = () => {
    let questionScore = 0;

    for (let i = 0; i < selectedAnswers.length; i++) {
      const section = question.sections[0][i];
      const selectedOptionIndex = selectedAnswers[i];

      if (selectedOptionIndex !== null) {
        const selectedOption = section.answers[selectedOptionIndex];
        if (selectedOption.state) {
          // If the answer is correct, add 1/section count to the total score
          questionScore += 1 / question.sections[0].length;
        }
      }
    }

    // Ensure the total score is not negative and round to two decimal places
    questionScore = Math.max(0, questionScore);
    questionScore = Math.round(questionScore * 100) / 100;
    console.log(questionScore)
    return questionScore;
  };
  
    const handleNext = () => {
      const score = calculateScore();
      onAnswer(selectedAnswers);
      onNextQuestion(score);
    };
  
    $: {
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
    }
  </script>
  
  <main>
    <h2 style="font-size: 24px; margin-bottom: 10px;">{question.text}</h2>
    <p style="color: red; font-size: 14px; margin-bottom: 10px;">{question.description}</p>
  
    <div class="question-container">
      {#each question.sections[0] as section, sectionIndex (section.title)}
        <div class="section">
          <label>{section.title}</label>
          <div class="options">
            {#each section.answers as answer, answerIndex (answer.value)}
              <label>
                <input
                  type="radio"
                  name={`answer_${sectionIndex}`}
                  bind:group={selectedAnswers[sectionIndex]}
                  value={answerIndex}
                  on:change={() => handleAnswer(sectionIndex, answerIndex)}
                />
                {answer.value}
              </label>
            {/each}
          </div>
        </div>
      {/each}
  
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
  
    .section {
      flex: 1;
      margin-right: 20px;
    }
  
    .options {
      display: flex;
      flex-direction: column;
      max-height: 200px;
      overflow-y: auto;
    }
  
    .options label {
      margin-bottom: 10px;
    }
  
    .image {
      flex: 1;
    }
  </style>
  