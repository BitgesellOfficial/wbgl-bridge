import express from 'express'
import cors from 'cors'
import {port} from './utils/config.js'
import {BalanceController, IndexController, SubmitController} from './controllers/index.js'

const app = express()
app.set('port', port)
app.use(cors())
app.use(express.json())

app.get('/', IndexController.healthCheck)
app.get('/state', IndexController.state)

app.get('/balance/bgl', BalanceController.bgl)
app.get('/balance/eth', BalanceController.eth)
app.get('/balance/bsc', BalanceController.bsc)

app.post('/submit/bgl', SubmitController.bglToWbgl)
app.post('/submit/wbgl', SubmitController.wbglToBgl)

export default app
