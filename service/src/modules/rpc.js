import Client from 'bitcoin-core'
import {rpc} from '../config/index.js'

let client

export const getClient = () => {
  if (!client) {
    client = new Client(rpc)
  }
  return client
}

export const getBlockchainInfo = async () => await getClient().command('getblockchaininfo')

export const getBalance = async () => await getClient().command('getbalance')
