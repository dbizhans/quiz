<script>
    import Fa from 'svelte-fa'
    import {faAngleLeft} from '@fortawesome/free-solid-svg-icons'
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
        <button class="h-20 px-10 text-2xl btn variant-filled absolute left-0 mt-10" on:click={handleBack} disabled={isDisabled}>
            <Fa icon={faAngleLeft}/>
            <p class="ml-5px">{translations.get('buttonLabelBack')}</p>
        </button>
    {/if}