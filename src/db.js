import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: 'aiuser',
    host: '172.238.107.207',
    database: 'ai_factory',
    password: 'asas',
    port: 5432,
});
