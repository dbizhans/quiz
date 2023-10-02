<script>
    import shuffle from 'shuffle-array';
    import { testStore } from '../../stores/testStore';

    import MultipleChoiceQuestion from '$lib/components/MultipleChoiceQuestion.svelte';
    import SingleChoiceQuestion from '$lib/components/SingleChoiceQuestion.svelte';
    import OrderQuestion from '$lib/components/OrderQuestion.svelte';
    import MultipleImageQuestion from '$lib/components/MultipleImageQuestion.svelte';
    import ScoreComponent from '$lib/components/ScoreComponent.svelte';

    let testParams;
    let currentQuestionIndex = 0;
    let translations; 
    testStore.subscribe(value => {
        testParams = value;
    });
    let { name, surname, language, questions } = testParams;
    shuffle(questions)
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
    let userAnswers = new Array(questions.length).fill([]);
    let score = new Array(questions.length).fill(0);
    let currentQuestion = questions[currentQuestionIndex];
    let testCompleted = false; 
    function handleNextQuestion(questionScore) {
        score[questions[currentQuestionIndex].id-1]=questionScore
        if (currentQuestionIndex < testParams.questions.length - 1) {
            currentQuestionIndex += 1;
            currentQuestion = questions[currentQuestionIndex];
        } else if (currentQuestionIndex == testParams.questions.length - 1) {
            testCompleted = true;
        }
    } 
    function handlePreviousQuestion(){
      if (currentQuestionIndex>0){
        currentQuestionIndex--
        currentQuestion = questions[currentQuestionIndex];
      }

    }

    function handleAnswer(answer) {
        userAnswers[questions[currentQuestionIndex].id-1]=answer;
        console.log(userAnswers)
    }
</script>

<main>
  <div class="m-5 relative">
    {#if !testCompleted}
      <p class="text-xl mb-5">{translations.get('questionLabel')} {currentQuestionIndex + 1} / {testParams.questions.length}</p>
      {#if currentQuestion}
        {#if currentQuestion.type === 'multiple-choice'}
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            userAnswers={userAnswers[questions[currentQuestionIndex].id-1] } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'single-choice'}
          <SingleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            userAnswers={userAnswers[questions[currentQuestionIndex].id-1] } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'order'}
          <OrderQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            userAnswers={userAnswers[questions[currentQuestionIndex].id-1] } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'multiple-image'}
          <MultipleImageQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={testParams.questions.length}
            userAnswers={userAnswers[questions[currentQuestionIndex].id-1] } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            bind:currentQuestionIndex
          />
        {/if}
      {/if}
    {:else}
      <ScoreComponent userAnswers={userAnswers} score={score} maxScore={testParams.questions.length} language={language} name={name} surname={surname}/>
    {/if}
  </div>
  </main>
