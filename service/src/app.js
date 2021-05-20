import express from 'express'
import {port} from './config'
import {IndexController} from './controllers'

const app = express()
app.set('port', port)
app.use(express.json())

app.get('/', IndexController.healthCheck)

export default app
