import http from 'http'
import app from './app.js'
import {port} from './config/index.js'
import {Db} from './modules/index.js'

await Db.init()

const server = http.createServer(app)
server.listen(parseInt(port), () => {
  console.log(`listening on *:${port}`)
})
