import Client from 'bitcoin-core'
import {rpc, confirmations} from '../utils/config.js'

let client

export const getClient = () => {
  if (!client) {
    client = new Client(rpc)
  }
  return client
}

export const getBlockchainInfo = async () => await getClient().command('getblockchaininfo')

export const getBlockCount = async () => await getClient().command('getblockcount')

export const getBalance = async () => await getClient().command('getbalance')

export const validateAddress = async address => (await getClient().command('validateaddress', address)).isvalid

export const createAddress = async () => await getClient().command('getnewaddress')

export const listSinceBlock = async (blockHash, confirmations = confirmations.bgl) => {
  return await getClient().command('listsinceblock', blockHash ? blockHash : undefined, confirmations)
}

export const send = async (address, amount) => await getClient().command('sendtoaddress', address, amount)
