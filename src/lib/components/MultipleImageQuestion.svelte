<script>
    import NextButton from "./NextButton.svelte";
  
    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let onNextQuestion;
  
    let isNextDisabled = true;
    let translations;
    console.log(question);
    let currentRow;
    let currectImageIndex;
    let answers = question.rows.flatMap((row) => row.images);
  
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
  
    function handleAnswer(rowIndex, imageIndex) {
      currentRow = rowIndex;
      currectImageIndex = imageIndex;
  
      isNextDisabled = false;
      const score = calculateScore();
      console.log(score);
    }
  
    function handleNext() {
      const score = calculateScore();
      console.log(score);
      onAnswer(score);
      onNextQuestion(score);
    }
  
    function calculateScore() {
      const selectedState = answers[currentRow * question.rows.length + currectImageIndex].state;
      console.log(selectedState)
      return selectedState ? 1 : 0;
    }
    console.log(question)
  </script>
  
  <main>
    <h2 style="font-size: 24px; margin-bottom: 10px;">{question.text}</h2>
    <p style="color: red; font-size: 14px; margin-bottom: 10px;">{question.description}</p>
  
    <div class="question-container">
      {#each question.rows as row, rowIndex}
        <div class="row-container">
          {#each row.images as image, imageIndex}
            <label style={`--row: ${row.order} / span 1; --col: ${imageIndex + 1} / span 1;`}>
              <input
                type="radio"
                name="image-selection"
                value={`${rowIndex}-${imageIndex}`}
                on:change={() => handleAnswer(rowIndex, imageIndex)}
              />
              <div class="image-group">
                <img src={image.image} alt="Answer Image" />
              </div>
            </label>
          {/each}
        </div>
      {/each}
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
      width: 100%;
      display: grid;
      gap: 10px;
      justify-content: center;
    }
  
    .row-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .row-container label {
      cursor: pointer;
    }
  
    .row-container input[type="radio"] {
      display: none;
    }
  
    .image-group {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .image-group img {
      max-height: 200px;
      height: auto;
      border: 2px solid transparent;
      transition: border-color 0.3s ease-in-out;
      margin-bottom: 5px;
    }
  
    .row-container input[type="radio"]:checked + .image-group img {
      border-color: #007bff;
    }
  
    .row-container input[type="radio"]:not(:checked) + .image-group img {
      border-color: transparent;
    }
  
    .image-group img:hover {
      filter: brightness(0.8);
    }
  </style>
  