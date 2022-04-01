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
//export const createAddress = async () => await getClient().getNewAddress('joost');;

export const tips = async () => await getClient().getChainTips();
export const generate = async (tip) => await getClient().generate(tip);

export const listSinceBlock = async (blockHash, confirmation = confirmations.bgl) => {
  return await getClient().command('listsinceblock', blockHash ? blockHash : undefined, confirmation)
}

export const getTransactionFromAddress = async (txid) => {
  const rawTx = await getClient().command('getrawtransaction', txid, true)
  const vin = rawTx['vin'][0]
  const txIn = await getClient().command('getrawtransaction', vin.txid, true)
  return txIn['vout'][vin['vout']]['scriptPubKey']['address']
}

export const send = async (address, amount) => await getClient().command('sendtoaddress', address, amount)
