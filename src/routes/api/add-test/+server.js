import { query } from '$lib/db';

export async function POST({request}) {
    const { title, tests } = await request.json();
    try {
        await query('INSERT INTO tests (title, lv, en, ru) VALUES ($1, $2, $3, $4)', [title, tests.lv || null, tests.en || null, tests.ru || null]);
        return new Response(JSON.stringify({ message: 'Test added successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred while adding the test' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
