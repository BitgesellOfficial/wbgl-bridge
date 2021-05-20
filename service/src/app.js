import express from 'express'
import {port} from './config/index.js'
import {IndexController} from './controllers/index.js'

const app = express()
app.set('port', port)
app.use(express.json())

app.get('/', IndexController.healthCheck)

export default app
