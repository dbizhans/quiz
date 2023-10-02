<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { tick } from 'svelte';
    import { testStore } from '../../../stores/testStore';

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
        //console.log(data)
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
        };
        testStore.set(testParams);
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

  
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
    {#if data}
      <h1 class="text-3xl font-bold mb-4">{data[selectedLanguage] ? data[selectedLanguage].title : 'Loading...'}</h1>
      <div class="radio-buttons mb-4">
        {#each Object.entries(data) as [lang, available]}
          {#if available}
          <label class="inline-flex items-center space-x-0.5 mb-2 mr-4">
            <input type="radio" class="form-radio mr-2" bind:group={selectedLanguage} value={lang}> 
            <span class="text-lg font-bold"> 
              {lang === 'en' ? 'English' : lang === 'ru' ? 'Русский' : lang === 'lv' ? 'Latviešu' : lang}
            </span>
          </label>
          {/if}
        {/each}
      </div>
      <form on:submit={startTest}>
        <label class="flex items-center space-x-2 mb-4">
          <span class="text-xl font-bold">{labels[selectedLanguage].name}:</span>
          <input type="text" class="w-full border rounded p-2 text-lg font-bold" bind:value={name} required>
        </label>
        <label class="flex items-center space-x-2 mb-4">
          <span class="text-xl font-bold">{labels[selectedLanguage].surname}:</span>
          <input type="text" class="w-full border rounded p-2 text-lg font-bold" bind:value={surname} required>
        </label>
        <button class="btn variant-filled h-16 px-8 text-2xl mt-5" type="submit" disabled={isDisabled}>{buttonLabels[selectedLanguage]}</button>
      </form>
    {:else}
      <p class="text-lg font-bold">Loading...</p>
    {/if}
  </div>
  </div>
  