<script>
    export let score;
    import Fa from 'svelte-fa'
    import {faAngleRight} from '@fortawesome/free-solid-svg-icons'
    export let language;
    export let name;
    export let surname;
    export let maxScore;
    export let userAnswers;
    export let handleReviewMode
    console.log(score)
    let sum=0;
    for (let i = 0; i < score.length; i++) {
      sum += score[i]; 
    }
    let percentage=( (sum / maxScore) * 100).toFixed (2);
    const translations = new Map([
      ['en', new Map([
        ['testCompletedTitle', 'Test Completed'],
        ['yourScoreLabel', 'Your Score is'],
        ['labelReviewMode', 'Review mistakes'],
      ])],
      ['ru', new Map([
        ['testCompletedTitle', 'Тест завершен'],
        ['yourScoreLabel', 'Ваш результат'],
        ['labelReviewMode', 'Посмотреть ошибки'],
      ])],
      ['lv', new Map([
        ['testCompletedTitle', 'Tests Pabeigts'],
        ['yourScoreLabel', 'Jūsu rezultāts ir'],
        ['labelReviewMode', 'Apskatīt kļūdas'],
      ])],
    ]);
  
    function getTranslation(key) {
      const translationMap = translations.get(language) || translations.get('en');
      return translationMap.get(key) || '';
    }
  </script>
  
  <main>
    <h1 class="text-5xl text-bold">{getTranslation('testCompletedTitle')}</h1>
    <p class="text-xl">{`${getTranslation('yourScoreLabel')} ${percentage}% (${sum}/${maxScore})`}</p>
    <button class="h-20 px-10 text-2xl mt-10 btn variant-filled absolute right-0 bottom-10" on:click={handleReviewMode} disabled={sum==maxScore}>
      <p class="mr-5px">{getTranslation('labelReviewMode')}</p>
          <Fa icon={faAngleRight}/>
    </button>
  </main>

  <style>
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    h1,
    p {
      margin: 10px 0;
    }
  </style>
  