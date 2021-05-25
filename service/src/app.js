import express from 'express'
import cors from 'cors'
import {port} from './utils/config.js'
import {IndexController, SubmitController} from './controllers/index.js'

const app = express()
app.set('port', port)
app.use(cors())
app.use(express.json())

app.get('/', IndexController.healthCheck)
app.post('/submit/bgl', SubmitController.bglToWbgl)
app.post('/submit/wbgl', SubmitController.wbglToBgl)

export default app
