import Web3 from 'web3'
import {Transaction} from 'ethereumjs-tx'
import fs from 'fs'
import {eth} from '../utils/config.js'
import {Data} from '../modules/index.js'

const provider = new Web3.providers.WebsocketProvider(eth.endpoint, {
  clientConfig: {
    keepalive: true,
    keepaliveInterval: 60000,
  },
  reconnect: {
    auto: true,
    delay: 2500,
    onTimeout: true,
  },
})
export const web3 = new Web3(provider)
export const WBGL = new web3.eth.Contract(JSON.parse(fs.readFileSync('abi/WBGL.json', 'utf8')), eth.contract)
export const decimals = await WBGL.methods['decimals']().call()
export const bn = web3.utils.toBN

export const getChain = async () => {
  const chain = await web3.eth.net.getNetworkType()
  return chain === 'main' ? 'mainnet' : chain
}

export const getGasPrice = async () => {
  const gasPrice = await web3.eth.getGasPrice()
  return web3.utils.fromWei(gasPrice, 'Gwei')
}

export const getEstimateGas = async (amount) => {
  return await WBGL.methods['transfer'](eth.account, toBaseUnit(amount)).estimateGas({from: eth.account})
}

export const convertWGBLBalance = (number, resultDecimals = decimals) => {
  const balance = bn(number)
  const divisor = bn(10).pow(bn(decimals))
  const beforeDec = balance.div(divisor).toString()
  const afterDec = balance.mod(divisor).toString().padStart(decimals, '0').substring(0, resultDecimals)
  return beforeDec + (afterDec !== '0' ? '.' + afterDec : '')
}

export const getWBGLBalance = async () => {
  return convertWGBLBalance(await WBGL.methods['balanceOf'](eth.account).call())
}

export const getTransactionCount = async () => await web3.eth.getTransactionCount(eth.account, 'pending')

export const sendWBGL = (address, amount, onTxHash = console.log) => {
  return new Promise(async (resolve, reject) => {
    const nonce = await Data.get('nonce', 0)
    const data = WBGL.methods['transfer'](address, toBaseUnit(amount)).encodeABI()
    const rawTx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei(Math.ceil(1.25 * parseFloat(await getGasPrice())).toString(), 'Gwei')),
      gasLimit: web3.utils.toHex(await getEstimateGas(amount) * 2),
      from: eth.account,
      to: eth.contract,
      value: '0x00',
      data,
    }
    console.log(rawTx)

    const chain = await getChain()
    const tx = new Transaction(rawTx, {chain})
    tx.sign(eth.key)

    const serializedTx = '0x' + tx.serialize().toString('hex')
    console.log('Serialized tx: ' + serializedTx)
    web3.eth.sendSignedTransaction(serializedTx)
      .on('transactionHash', onTxHash)
      .on('error', reject)
      .then(resolve)
      .catch(reject)

    await Data.set('nonce', nonce + 1)
  })
}

function isString(s) {
  return (typeof s === 'string' || s instanceof String)
}

function toBaseUnit(value) {
  if (!isString(value)) {
    throw new Error('Pass strings to prevent floating point precision issues.')
  }
  const ten = bn(10)
  const base = ten.pow(bn(decimals))

  // Is it negative?
  let negative = (value.substring(0, 1) === '-')
  if (negative) {
    value = value.substring(1)
  }

  if (value === '.') {
    throw new Error(
      `Invalid value ${value} cannot be converted to`
      + ` base unit with ${decimals} decimals.`)
  }

  // Split it into a whole and fractional part
  let comps = value.split('.')
  if (comps.length > 2) {
    throw new Error('Too many decimal points')
  }

  let whole = comps[0], fraction = comps[1]

  if (!whole) {
    whole = '0'
  }
  if (!fraction) {
    fraction = '0'
  }
  if (fraction.length > decimals) {
    throw new Error('Too many decimal places')
  }

  while (fraction.length < decimals) {
    fraction += '0'
  }

  whole = bn(whole)
  fraction = bn(fraction)
  let wei = (whole.mul(base)).add(fraction)

  if (negative) {
    wei = wei.neg()
  }

  return bn(wei.toString(10))
}

