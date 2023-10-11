import { Request, Response, NextFunction} from "express"
import sql from '../sql/index.js'
import utils from "../utils/utils.js"

const main = async (query, serve) => {
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
            route: `/${utils.file_name(import.meta.url)}${route}`, method, controller
        })

    }
}

export default { main }