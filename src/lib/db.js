import { Pool } from 'pg';

const pool = new Pool({
    host: '192.168.35.108',
    port: 5432,
    user: 'tropical',
    password: '88880000',
    database: 'quiz'
});

export async function query(text, params) {
    const res = await pool.query(text, params);
    return res.rows;
}
