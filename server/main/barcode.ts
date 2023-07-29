
import { Request, Response, NextFunction} from "express"
import sql from '../sql/index.js'
import utils from "../utils/utils.js"

const barcode = async (query, serve) => {
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
        {
            route: '/:id',
            method: 'GET',
            controller: async (req: Request, res: Response) => {
                const barcode_number:string = req.params.id
                console.log(barcode_number)

                const result = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode_number}`);
                const data = await result.json()
                res.status(200).json(data);
            }
        },
        {
            route: '/:id/summary',
            method: 'GET',
            controller: async (req: Request, res: Response) => {
                const barcode_number:string = req.params.id
                console.log(barcode_number)

                const result = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode_number}`);
                const data = await result.json()
                const product = data?.product
                let summary_items = ['proteins', 'fat', 'carbohydrates', 'sugars']
                let serving_summary = {
                    serving_size: product.serving_size,
                    calories: `${product.nutriments['energy-kcal_serving']}${product.nutriments['energy-kcal_unit']}`
                }
                for (const item of summary_items) {
                    serving_summary[item] = product.nutriments[`${item}_serving`] +  product.nutriments[`${item}_unit`]
                }
                const summary = {
                    name: product.product_name,
                    ingredients: product.ingredients_text,
                    allergens: product.allergens,
                    serving_summary,
                    nutrients: product.nutriments,
                }
                let html = `<div>
                <p><strong>name:</strong> ${summary.name}</p>
                <p style="width: 250px;"><strong>ingredients:</strong> ${summary.ingredients}</p>
                <p style="width: 250px;"><strong>allergens:</strong> ${summary.allergens}</p>
                <p><strong>Serving Information:</strong></p>
                <ul>
                ${Object.entries(summary.serving_summary).map(([key, value]) => {
                    return (
                        `<li>${key}: ${value}</li>`
                    )
                }).join('')}
                </ul>
                </div>`
                res.status(200).send(html)
                // res.status(200).json(summary);
            }
        },

    ]

    for (const { route, method, controller } of config) {
        await serve({
            route: `/${utils.file_name(import.meta.url)}${route}`, method, controller
        })

    }
}

export default { barcode }
