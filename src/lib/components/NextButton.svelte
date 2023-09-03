<script>
    export let currentQuestionIndex;
    export let questionsLen;
    export let translations;
    export let handleNext;
    export let isDisabled; 
  </script>
  
  <button class="custom-button {isDisabled ? 'disabled' : ''}" on:click={handleNext} disabled={isDisabled}>
    {currentQuestionIndex === questionsLen - 1
      ? translations.get('buttonLabelFinish')
      : translations.get('buttonLabelNext')}
  </button>
  
  <style>
    .custom-button {
      background-color: #007bff; 
      color: white; 
      font-size: 18px; 
      padding: 10px 20px; 
      border: none;
      border-radius: 5px;
      cursor: pointer;
      position: absolute;
      right: 20px; 
      transition: background-color 0.3s ease, transform 0.2s ease; 
    }
  
    .custom-button:hover {
      background-color: #0056b3;
    }
  
    @media (max-width: 768px) {
      .custom-button {
        font-size: 16px; 
        padding: 8px 16px; 
      }
      .custom-button:active {
        transform: scale(0.95); 
      }
    }
  

    .custom-button.disabled {
      background-color: #ccc;
      cursor: not-allowed; 
    }
  </style>
  