import test from './
import sql from '../sql/index.js'
import utils from "../utils/utils.js"

const all_services = async () => {
const first_service = async () => {
    const result = await utils.query(sql.main.current_date)
    return result
}

export default {first_service}
}


' 
export default {test, }