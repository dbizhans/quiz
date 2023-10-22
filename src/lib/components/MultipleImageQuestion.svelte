<script>
    import NextButton from "./NextButton.svelte";
    import BackButton from "./BackButton.svelte";
    export let question;
    export let onAnswer;
    export let currentQuestionIndex;
    export let language;
    export let questionsLen;
    export let onNextQuestion;
    export let onPreviousQuestion;
    export let userAnswers;
    export let isReviewMode
    let isNextDisabled = true;
    console.log(userAnswers)
    let answers = question.rows.flatMap((row) => row.images);
    if (!userAnswers.length) {
      userAnswers = new Array(2).fill(-1);
    }
    let currentRow = userAnswers[0];
    let currectImageIndex = userAnswers[1];
    let selectedAnswer = `${userAnswers[0]}-${userAnswers[1]}`
    function handleAnswer(rowIndex, imageIndex) {
      currentRow = rowIndex
      currectImageIndex = imageIndex
      isNextDisabled = false;
      userAnswers[0] = currentRow 
      userAnswers[1] = currectImageIndex
      onAnswer(userAnswers)
    }
    if (!userAnswers.includes(-1)) {
      isNextDisabled = false;
    }
    function handleNext() {
      if(isReviewMode){
        onNextQuestion()
      } else {
        const score = calculateScore();
        userAnswers[0] = currentRow 
        userAnswers[1] = currectImageIndex
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
    function calculateScore() {
      let sum = 0;
      for (let i = 0; i<currentRow;i++){
        sum += question.rows[i].images.length
      }
      const selectedState = answers[sum + currectImageIndex].state;
      return selectedState ? 1 : 0;
    }
  </script>
  
  <main>
    <h2 class="text-5xl font-bold mb-5">{question.text}</h2>
    <p class="text-red-700 text-2xl mb-5">{question.description}</p>
    <div class="question-container">
      {#each question.rows as row, rowIndex}
        <div class="row-container">
          {#each row.images as image, imageIndex}
            {#if isReviewMode}
              <label style={`--row: ${row.order} / span 1; --col: ${imageIndex + 1} / span 1;`} class="{(!(!image.state && (userAnswers[0] === rowIndex) && (userAnswers[1] === imageIndex))) ? '' : 'border-8 border-red-600 rounded-md p-2'}"
              >
                <input
                  type="radio"
                  disabled
                  name="image-selection"
                  value={`${rowIndex}-${imageIndex}`}
                  bind:group={selectedAnswer}
                />
                <div class="image-group">
                  <img src={image.image} alt="Answer Image" />
                </div>
              </label>
            {:else}
              <label style={`--row: ${row.order} / span 1; --col: ${imageIndex + 1} / span 1;`}>
                <input
                  type="radio"
                  name="image-selection"
                  value={`${rowIndex}-${imageIndex}`}
                  on:change={() => handleAnswer(rowIndex, imageIndex)}
                  bind:group={selectedAnswer}
                />
                <div class="image-group">
                  <img src={image.image} alt="Answer Image" />
                </div>
              </label>
            {/if}
          {/each}
        </div>
      {/each}
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
      border: 7px solid transparent;
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
  