import pg from 'pg';
import url from 'url';
import path from 'path';
const utils_func = () => {
    const Pool = pg.Pool;
    const pool = new Pool({
        host: process.env.PSQL_HOST,
        database: process.env.PSQL_DATABASE,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        // port: 5432,
        // user: 'andrewjudd',
        // password: 'Bybhlfef15&'
    });
    const query = async (text, params) => {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        if (res.rowCount === 1) {
            return res?.rows?.[0] || res;
        }
        return res?.rows || res;
    };
    const file_name = (curr_path) => {
        const __filename = url.fileURLToPath(new URL(curr_path));
        const base_path = path.basename(__filename);
        return base_path.split('.')[0];
    };
    const dir_name = (curr_path) => {
        const __dirname = url.fileURLToPath(new URL('.', curr_path));
        return __dirname;
    };
    const all = { query, file_name, dir_name };
    return all;
};
const utils = utils_func();
export default utils;
