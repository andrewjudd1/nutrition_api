import fs from 'fs/promises';
import utils from '../utils/utils.js';
const main = async () => {
    console.log(process.argv[2]);
    const main_file = `
import { Request, Response, NextFunction} from "express"
import sql from '../sql/index.js'
import utils from "../utils/utils.js"

const ${process.argv[2]} = async (query, serve) => {
    const funcs = {}
    const config = [
        {
            route: '/first_query',
            method: 'GET',
            controller: async (req: Request, res: Response) => {
                
                const result = await query(sql.main.current_date)
                res.status(200).json(result)
            }
        },

    ]

    for (const { route, method, controller } of config) {
        await serve({
            route: \`/\$\{utils.file_name(import.meta.url)\}\$\{route\}\`, method, controller
        })

    }
}

export default { ${process.argv[2]} }
`;
    const service_file = `
import sql from '../sql/index.js'
import utils from "../utils/utils.js"

const all_services = async () => {
const first_service = async () => {
    const result = await utils.query(sql.main.current_date)
    return result
}

export default {first_service}
}


`;
    const sql_file = `
const sql: {[key: string]: string} = {
    current_date: "select current_date"
}

export default sql
`;
    try {
        const write_dir = async (dir, src_file) => {
            await fs.writeFile(`./server/${dir}/${process.argv[2]}.ts`, `${src_file}`);
            const files = (await fs.readdir(utils.dir_name(import.meta.url) + `../${dir}`)).filter(item => !item.includes('index'));
            console.log(files);
            let index_file = ``;
            for (const file of files) {
                let name = file.split('.')[0];
                index_file += `import ${name} from './${src_file}' \n`;
            }
            index_file += `export default {`;
            for (const file of files) {
                let name = file.split('.')[0];
                index_file += `${name}, `;
            }
            index_file += `}`;
            await fs.writeFile(`./server/${dir}/index.ts`, `${index_file}`);
        };
        await write_dir('controllers', main_file);
        await write_dir('services', service_file);
        await write_dir('sql', sql_file);
        console.log(main_file);
    }
    catch (error) {
        console.log(error);
    }
};
await main();
