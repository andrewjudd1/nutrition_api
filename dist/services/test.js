import sql from '../sql/index.js';
import utils from "../utils/utils.js";
const test = async (query, serve) => {
    const funcs = {};
    const config = [
        {
            route: '/first_query',
            method: 'GET',
            controller: async (req, res) => {
                const result = await query(sql.main.current_date);
                res.status(200).json(result);
            }
        },
    ];
    for (const { route, method, controller } of config) {
        await serve({
            route: `/${utils.file_name(import.meta.url)}${route}`, method, controller
        });
    }
};
export default { test };
