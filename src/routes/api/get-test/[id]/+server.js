import { query } from '$lib/db.js';

export async function GET({params}) {
    const res = await query('SELECT ru, en, lv FROM tests WHERE id = $1', [params.id]);
    if (res.length > 0) {
        const row = res[0];
        const tests = {
            ru: row.ru,
            en: row.en,
            lv: row.lv
        };
        return new Response(JSON.stringify(tests), {
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response('Test not found', { status: 404 });
    }
}
