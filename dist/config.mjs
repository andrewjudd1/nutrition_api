import utils from "./utils/utils.js";
import main_files from './controllers/index.js';
import url from 'url';
import fs from 'fs/promises';
const config = async () => {
    let root_url = '';
    const routers = [];
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const paths = await fs.readdir(__dirname + 'controllers');
    console.log(paths);
    const create_db_endpoint = async ({ route, method, controller, middleware }) => {
        if (!routers.filter(item => item.route === `${root_url}/api/v1`).length) {
            routers.push({ route: `${root_url}/api/v1`, routes: [] });
        }
        routers[routers.findIndex(item => item.route === `${root_url}/api/v1`)].routes.push({
            route: `${route}`,
            method,
            controller,
            middleware
        });
    };
    const database_paths = [];
    for (const path of paths) {
        if (path === 'index.js')
            continue;
        console.log(path);
        console.log(main_files[path.split('.')[0]]);
        database_paths.push({ path, funcs: main_files[path.split('.')[0]] });
    }
    for (const { funcs } of database_paths) {
        for (const key in funcs) {
            await funcs[key](utils.query, create_db_endpoint);
        }
    }
    return { routers };
};
export default config;
