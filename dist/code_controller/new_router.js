import fs from 'fs/promises';
import utils from '../utils/utils.js';
const main = async () => {
    console.log(process.argv[2]);
    const file = `
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
    try {
        console.log(file);
        await fs.writeFile(`./server/main/${process.argv[2]}.ts`, `${file}`);
        const files = (await fs.readdir(utils.dir_name(import.meta.url) + '../main')).filter(item => !item.includes('index'));
        console.log(files);
        let index_file = ``;
        for (const file of files) {
            let name = file.split('.')[0];
            index_file += `import ${name} from './${file}' \n`;
        }
        index_file += `export default {`;
        for (const file of files) {
            let name = file.split('.')[0];
            index_file += `${name}, `;
        }
        index_file += `}`;
        await fs.writeFile(`./server/main/index.ts`, `${index_file}`);
    }
    catch (error) {
        console.log(error);
    }
};
await main();
