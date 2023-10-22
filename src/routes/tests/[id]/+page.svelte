<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { savedCurrentQuestionIndex, savedReviewMode, savedScore, savedTestCompleted, savedUserAnswers, shuffledQuestions, testStore } from '../../../stores/testStore';
    import shuffle from 'shuffle-array';

    let id = $page.params.id;
    let data = null;
    let selectedLanguage = 'lv'; // Default language, can be changed by the user
    const labels = {
        en: { name: 'Name', surname: 'Surname' },
        lv: { name: 'Vārds', surname: 'Uzvārds' },
        ru: { name: 'Имя', surname: 'Фамилия' },
    };

    const buttonLabels = {
        en: 'Start Test',
        lv: 'Sākt testu',
        ru: 'Начать тест',
    };
    const fetchData = async () => {
        let response = await fetch(`/api/get-test/${id}`);
        data = await response.json();
        console.log(data)
        if (!data[selectedLanguage]) {
            for (const lang in data) {
                if (data[lang]) {
                    selectedLanguage = lang;
                    break;
                }
            }
        }
    };

    onMount(fetchData);

    const updateLanguage = (event) => {
        selectedLanguage = event.target.value;
    };
    const startTest = (event) => {
        event.preventDefault();

        const testParams = {
            name,
            surname,
            language: selectedLanguage,
            questions: data[selectedLanguage].questions, 
            id: id
        };
        console.log(testParams)
        testStore.set(testParams);
        console.log(data[selectedLanguage].questions)
        shuffledQuestions.set(shuffle((data[selectedLanguage].questions), {'copy': true }))
        savedUserAnswers.set(new Array(data[selectedLanguage].questions.length).fill([]))
        savedScore.set(new Array(data[selectedLanguage].questions.length).fill(0))
        savedCurrentQuestionIndex.set(0)
        savedTestCompleted.set(false)
        savedReviewMode.set(false)
        try {
            goto('/test');
        } catch (error) {
            console.log(error)
        }

    };

    let name = '';
    let surname = '';
    $: isDisabled = !name || !surname;
</script>


<style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh; 
    }
  

    .radio-buttons {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }

    label {
      margin: 10px 0;
    }

    label {
      display: block;
      font-weight: bold;
      margin-right: 10px;
    }

    form {
      text-align: center;
    }
    .title{
      font-size: 24px; 
    }
  
    .custom-button {
      background-color: #007bff; 
      color: white; 
      font-size: 18px; 
      padding: 10px 20px; 
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease; 
    }
  
    .custom-button.disabled {
      background-color: #ccc;
      cursor: not-allowed; 
    }
  </style>
  
  <div class="container">
    {#if data}
      <h1 class="title">{data[selectedLanguage] ? data[selectedLanguage].title : 'Loading...'}</h1>
      <div class="radio-buttons">
        {#each Object.entries(data) as [lang, available]}
          {#if available}
            <label>
              <input type="radio" bind:group={selectedLanguage} value={lang}>
              {lang === 'en' ? 'English' : lang === 'ru' ? 'Русский' : lang === 'lv' ? 'Latviešu' : lang}
            </label>
          {/if}
        {/each}
      </div>
      <form on:submit={startTest}>
        <label>
          {labels[selectedLanguage].name}:
          <input type="text" bind:value={name} required>
        </label>
        <label>
          {labels[selectedLanguage].surname}:
          <input type="text" bind:value={surname} required>
        </label>
        <button class="custom-button {isDisabled ? 'disabled' : ''}" type="submit" disabled={isDisabled}>{buttonLabels[selectedLanguage]}</button>
      </form>
    {:else}
      <p>Loading...</p>
    {/if}
  </div>
  