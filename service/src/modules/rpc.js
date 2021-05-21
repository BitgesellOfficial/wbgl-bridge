import Client from 'bitcoin-core'
import {rpc} from '../config/index.js'

let client

export const getClient = () => {
  if (!client) {
    client = new Client(rpc)
  }
  return client
}
