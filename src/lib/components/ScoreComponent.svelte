<script>
    export let score;
    export let language;
    export let name;
    export let surname;
    export let maxScore;
    export let userAnswers;

    console.log(userAnswers);
    // Translation maps for different languages
    const translations = new Map([
      ['en', new Map([
        ['testCompletedTitle', 'Test Completed'],
        ['yourScoreLabel', 'Your Score is'],
      ])],
      ['ru', new Map([
        ['testCompletedTitle', 'Тест завершен'],
        ['yourScoreLabel', 'Ваш балл'],
      ])],
      ['lv', new Map([
        ['testCompletedTitle', 'Tests Pabeigts'],
        ['yourScoreLabel', 'Jūsu rezultāts ir'],
      ])],
    ]);
  
    function getTranslation(key) {
      const translationMap = translations.get(language) || translations.get('en');
      return translationMap.get(key) || '';
    }
  </script>
  
  <main>
    <h1>{getTranslation('testCompletedTitle')}</h1>
    <p>{`${getTranslation('yourScoreLabel')}: ${score}/${maxScore}`}</p>
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
  