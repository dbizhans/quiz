<script>
    import { onMount } from 'svelte';
    import shuffle from 'shuffle-array';
    import { testStore } from '../../stores/testStore';

    import MultipleChoiceQuestion from '$lib/components/MultipleChoiceQuestion.svelte';
    import SingleChoiceQuestion from '$lib/components/SingleChoiceQuestion.svelte';
    import OrderQuestion from '$lib/components/OrderQuestion.svelte';
    import MultipleSectionQuestion from '$lib/components/MultipleSectionQuestion.svelte';
    import MultipleQuestion from '$lib/components/MultipleQuestion.svelte';
    import MultipleImageQuestion from '$lib/components/MultipleImageQuestion.svelte';
    import ScoreComponent from '$lib/components/ScoreComponent.svelte';

    let testParams;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let translations; 
    testStore.subscribe(value => {
        testParams = value;
    });
    console.log(testParams)
    let { name, surname, language, questions } = testParams;

    if (language === 'en') {
    translations = new Map([
        ['testTitle', 'Test'],
        ['questionLabel', 'Question'],
    ]);
    } else if (language === 'ru') {
    translations = new Map([
        ['testTitle', 'Тест'],
        ['questionLabel', 'Вопрос'],
    ]);
    } else if (language === 'lv') {
    translations = new Map([
        ['testTitle', 'Tests'],
        ['questionLabel', 'Jautājums'],
    ]);
    }

    shuffle(questions);
    let currentQuestion = questions[currentQuestionIndex];
    let testCompleted = false; 
    let score = 0;


    function handleNextQuestion(questionScore) {
        score += questionScore;
        if (currentQuestionIndex < testParams.questions.length - 1) {
            currentQuestionIndex += 1;
            currentQuestion = questions[currentQuestionIndex];
        } else if (currentQuestionIndex == testParams.questions.length - 1) {
            testCompleted = true;
        }
    }

    function handleAnswer(answer) {
        userAnswers = [...userAnswers, answer];
    }
</script>

<main>
    {#if !testCompleted}
      <p>{translations.get('questionLabel')} {currentQuestionIndex + 1} / {testParams.questions.length}</p>
      {#if currentQuestion}
        {#if currentQuestion.type === 'multiple-choice'}
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            onNextQuestion={handleNextQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'single-choice'}
          <SingleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            onNextQuestion={handleNextQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'order'}
          <OrderQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            onNextQuestion={handleNextQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'multiple-section'}
          <MultipleSectionQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            onNextQuestion={handleNextQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'multiple-question'}
          <MultipleQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            onNextQuestion={handleNextQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'multiple-image'}
          <MultipleImageQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            onNextQuestion={handleNextQuestion}
            bind:currentQuestionIndex
          />
        {/if}
      {/if}
    {:else}
      <ScoreComponent userAnswers={userAnswers} score={score} maxScore={testParams.questions.length} language={language} name={name} surname={surname}/>
    {/if}
  </main>