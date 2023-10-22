import { query } from '$lib/db';

export async function POST({request}) {
    const { name, surname, result, test_id, time_finished, person_id } = await request.json();

    try {
        await query(
            'INSERT INTO results (name, surname, result, test_id, time_finished, person_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, surname, result, test_id, time_finished, person_id]
        );
        return new Response(JSON.stringify({ message: 'Result added successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred while adding the result' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
