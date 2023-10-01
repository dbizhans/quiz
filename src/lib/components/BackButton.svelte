<script>
    export let currentQuestionIndex;
    export let language;
    export let handleBack;
    export let isDisabled; 
    let translations;
    if (language === 'en') {
        translations = new Map([
            ['buttonLabelBack', 'Back'],
        ]);
        } else if (language === 'ru') {
        translations = new Map([
            ['buttonLabelBack', 'Назад'],
        ]);
        } else if (language === 'lv') {
        translations = new Map([
            ['buttonLabelBack', 'Atpakaļ'],
        ]);
    }
  </script>
    {#if currentQuestionIndex>0}
        <button class="custom-button {isDisabled ? 'disabled' : ''}" on:click={handleBack} disabled={isDisabled}>
            {translations.get('buttonLabelBack')}
        </button>
    {/if}
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
      left: 0px; 
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
  