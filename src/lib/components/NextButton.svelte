<script>
    import Fa from 'svelte-fa'
    import {faAngleRight} from '@fortawesome/free-solid-svg-icons'
    import {faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons'
    export let currentQuestionIndex;
    export let questionsLen;
    export let language;
    export let handleNext;
    export let isDisabled; 
    let translations;
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
    
  </script>
  
  <button class="h-20 px-10 text-2xl mt-10 btn variant-filled absolute right-0" on:click={handleNext} disabled={isDisabled}>
    <p class="mr-5px">{currentQuestionIndex === questionsLen - 1
      ? translations.get('buttonLabelFinish')
      : translations.get('buttonLabelNext')}
      </p>
      {#if currentQuestionIndex === questionsLen - 1}
        <Fa icon={faAngleDoubleRight}/>
      {:else}
        <Fa icon={faAngleRight}/>
      {/if}
  </button>
  