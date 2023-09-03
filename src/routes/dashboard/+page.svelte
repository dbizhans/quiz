<script>
    import { query } from '$lib/db';
    let tests = [];
    
    async function getTests() {
        tests = await query('SELECT * FROM tests');
    }
    
    async function addTest() {
        const title = prompt('Enter test title');
        if (title) {
            const test = {
                title,
                questions: []
            };
            await query('INSERT INTO tests (data) VALUES ($1)', [JSON.stringify(test)]);
            await getTests();
        }
    }
    
    async function deleteTest(id) {
        if (confirm('Are you sure you want to delete this test?')) {
            await query('DELETE FROM tests WHERE id = $1', [id]);
            await getTests();
        }
    }
    
    getTests();
</script>

<h1>Manage Tests</h1>
<button on:click={addTest}>Add Test</button>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each tests as test}
            <tr>
                <td>{test.id}</td>
                <td>{test.data.title}</td>
                <td><button on:click={() => deleteTest(test.id)}>Delete</button></td>
            </tr>
        {/each}
    </tbody>
</table>
