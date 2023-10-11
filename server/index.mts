import dotenv from 'dotenv'
dotenv.config()
import config from './config.mjs'
import express, {Express, Request, Response} from 'express'
import bodyParser from 'body-parser'
const app: Express = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

for (const router of (await config()).routers) {
    const express_router = express.Router()
    for (const route of router.routes) {
        express_router.route(route.route)[route?.method?.toLowerCase()]((route.middleware || ((_ : Request, __ : Response, next) => next())), (route?.controller || ((req : Request, res: Response) => res.send(req.path))))
    }
    app.use(router.route, express_router)

}

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Listening on port ${port}`))
