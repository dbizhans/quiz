import { query } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET(req) {
    try {
        const rows = await query('SELECT NOW()');
        return json(rows);
    } catch (error) {
        return json(`Error ${error.message}`);
    }
}
