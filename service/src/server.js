import app from './app'
import {port} from './config'

const server = require('http').createServer(app)
server.listen(parseInt(port), () => {
  console.log(`listening on *:${port}`)
})
