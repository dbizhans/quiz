<script>
    let lvFile, enFile, ruFile;
    let title = '';
    let message = '';

    async function handleSubmit() {
        const tests = {};
        const readers = [];

        if (lvFile) {
            const lvReader = new FileReader();
            lvReader.onload = (event) => {
                tests.lv = JSON.parse(event.target.result);
            };
            readers.push(new Promise((resolve) => {
                lvReader.onloadend = resolve;
            }));
            lvReader.readAsText(lvFile);
        }

        if (enFile) {
            const enReader = new FileReader();
            enReader.onload = (event) => {
                tests.en = JSON.parse(event.target.result);
            };
            readers.push(new Promise((resolve) => {
                enReader.onloadend = resolve;
            }));
            enReader.readAsText(enFile);
        }

        if (ruFile) {
            const ruReader = new FileReader();
            ruReader.onload = (event) => {
                tests.ru = JSON.parse(event.target.result);
            };
            readers.push(new Promise((resolve) => {
                ruReader.onloadend = resolve;
            }));
            ruReader.readAsText(ruFile);
        }

        try {
            await Promise.all(readers); // Wait for all file reads to complete

            const res = await fetch('/api/add-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, tests })
            });
            const data = await res.json();
            message = data.message || data.error;
        } catch (error) {
            console.error(error);
            message = 'An error occurred while processing the files.';
        }
    }

</script>

<h1>Add Test</h1>
<input type="text" bind:value="{title}" placeholder="Enter test title" />
<div>
    <label>LV:</label>
    <input type="file" accept=".json" on:change="{(event) => (lvFile = event.target.files[0])}" />
</div>
<div>
    <label>EN:</label>
    <input type="file" accept=".json" on:change="{(event) => (enFile = event.target.files[0])}" />
</div>
<div>
    <label>RU:</label>
    <input type="file" accept=".json" on:change="{(event) => (ruFile = event.target.files[0])}" />
</div>
<button on:click="{handleSubmit}">Submit</button>
<p>{message}</p>
