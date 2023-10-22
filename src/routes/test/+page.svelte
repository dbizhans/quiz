<script>
    import shuffle from 'shuffle-array';
    import { testStore, savedUserAnswers, savedScore, savedCurrentQuestionIndex, shuffledQuestions, savedTestCompleted, savedReviewMode } from '../../stores/testStore';
    import { browser } from "$app/environment"
    import { onMount } from 'svelte';
    import MultipleChoiceQuestion from '$lib/components/MultipleChoiceQuestion.svelte';
    import SingleChoiceQuestion from '$lib/components/SingleChoiceQuestion.svelte';
    import OrderQuestion from '$lib/components/OrderQuestion.svelte';
    import MultipleImageQuestion from '$lib/components/MultipleImageQuestion.svelte';
    import ScoreComponent from '$lib/components/ScoreComponent.svelte';

    let testParams;
    let currentQuestionIndex;
    let translations; 
    let userAnswers
    let score
    let currentQuestion
    let name, surname, language, questions, id;
    let shuffled
    let testCompleted
    let isReviewMode
    let currentUserAnswer
    let incorrectQuestions
    testStore.subscribe(value => {
      testParams = value;
    });
    savedUserAnswers.subscribe(value => {
      userAnswers = value;
    });
    console.log(userAnswers)
    savedScore.subscribe(value => {
      score = value;
    });
    savedCurrentQuestionIndex.subscribe(value => {
      currentQuestionIndex = value;
    });
    shuffledQuestions.subscribe(value => { 
      shuffled = value;
    });
    savedTestCompleted.subscribe(value => {
      testCompleted = value;
    });
    savedReviewMode.subscribe(value => {
      isReviewMode = value;
    });
    $: if(testParams && shuffled) {
      ({ name, surname, language, questions, id } = testParams);

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
      if(isReviewMode){
        currentQuestion=incorrectQuestions[currentQuestionIndex]
        currentUserAnswer = userAnswers[incorrectQuestions[currentQuestionIndex].id-1]
      }else{
        currentQuestion = shuffled[currentQuestionIndex];
        currentUserAnswer = userAnswers[shuffled[currentQuestionIndex].id-1]
      }
  }
  async function sendResult(){
    let sum=0;
    for (let i = 0; i < score.length; i++) {
      sum += score[i]; 
    }
    let percentage=Math.round( (sum / shuffled.length) * 100);
    console.log()
    try {
      const res = await fetch('/api/add-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name, 
          surname: surname, 
          result: percentage,
          test_id: parseInt(id), 
          time_finished: new Date(), 
          person_id: null
         })
    });
    const data = await res.json();
    console.log(data)
    } catch (error){
      console.log(error)
    }
  }
    function handleNextQuestion(questionScore) {
      if (!isReviewMode) {
        score[shuffled[currentQuestionIndex].id-1]=questionScore
        savedScore.set(score)
      }
        if (currentQuestionIndex < shuffled.length - 1 && !isReviewMode) {
            currentQuestionIndex += 1;
            savedCurrentQuestionIndex.set(currentQuestionIndex)
            currentQuestion = shuffled[currentQuestionIndex]; 
            currentUserAnswer = userAnswers[shuffled[currentQuestionIndex].id-1]
        } else if ((currentQuestionIndex == shuffled.length - 1) && !isReviewMode) {
            testCompleted = true;
            savedTestCompleted.set(testCompleted)
            sendResult()
        } else if (currentQuestionIndex < incorrectQuestions.length - 1 && isReviewMode){
          currentUserAnswer = userAnswers[incorrectQuestions[currentQuestionIndex].id-1]
          currentQuestionIndex += 1;
          savedCurrentQuestionIndex.set(currentQuestionIndex)
          currentQuestion = incorrectQuestions[currentQuestionIndex]; 
        } else if ((currentQuestionIndex == incorrectQuestions.length - 1) && isReviewMode) {
          savedReviewMode.set(false)
        }
        console.log(currentUserAnswer)
    } 
    function createFilteredArray(questions, exclusion) {
      const filteredQuestions = [];
      for (let i = 0; i < exclusion.length; i++) {
        if (exclusion[i] === 0) {
          filteredQuestions.push(questions[i]);
        }
      }
      return filteredQuestions;
    }

    function handlePreviousQuestion(){
      if (currentQuestionIndex>0){
        currentQuestionIndex--
        savedCurrentQuestionIndex.set(currentQuestionIndex)
        if(isReviewMode){
          currentQuestion=incorrectQuestions[currentQuestionIndex]
          currentUserAnswer = userAnswers[incorrectQuestions[currentQuestionIndex].id-1]
        }else{
          currentQuestion = shuffled[currentQuestionIndex];
          currentUserAnswer = userAnswers[shuffled[currentQuestionIndex].id-1]
        }
      }

    }

    function handleAnswer(answer) {
      userAnswers[shuffled[currentQuestionIndex].id-1]=answer;
      savedUserAnswers.set(userAnswers)
    }

    function handleReviewMode(){
      console.log(score)
      console.log(questions)
      incorrectQuestions = createFilteredArray(questions, score)
      savedReviewMode.set(true)
      savedCurrentQuestionIndex.set(0)
    }
</script>

<main>
  {#if testParams && shuffled}
  <div class="m-5 relative">
    {#if !testCompleted || isReviewMode}
      <p class="text-xl mb-5">{translations.get('questionLabel')} {currentQuestionIndex + 1} / {isReviewMode ? incorrectQuestions.length : shuffled.length}</p>
      {#if currentQuestion}
        {#if currentQuestion.type === 'multiple-choice'}
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={shuffled.length}
            userAnswers={currentUserAnswer } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            isReviewMode={isReviewMode}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'single-choice'}
          <SingleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={shuffled.length}
            userAnswers={currentUserAnswer } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            isReviewMode={isReviewMode}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'order'}
          <OrderQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={shuffled.length}
            userAnswers={currentUserAnswer } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            isReviewMode={isReviewMode}
            bind:currentQuestionIndex
          />
        {:else if currentQuestion.type === 'multiple-image'}
          <MultipleImageQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            language={language}
            questionsLen={shuffled.length}
            userAnswers={currentUserAnswer } 
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            isReviewMode={isReviewMode}
            bind:currentQuestionIndex
          />
        {/if}
      {/if}
    {:else if testCompleted && !isReviewMode}
      <ScoreComponent userAnswers={userAnswers} score={score} maxScore={shuffled.length} language={language} name={name} surname={surname} handleReviewMode={handleReviewMode} />
    {/if}
  </div>
  {/if}
  </main>
