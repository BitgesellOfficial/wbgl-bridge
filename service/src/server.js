import http from 'http'
import app from './app.js'
import {port} from './utils/config.js'
import {Db, Chores} from './modules/index.js'

await Db.init()
await Chores.init()

const server = http.createServer(app)
server.listen(parseInt(port), () => {
  console.log(`listening on *:${port}`)
})
