import Transfer from '../models/Transfer.js'
import {RPC, Eth} from '../modules/index.js'
import {eth} from '../utils/config.js'
import {isValidBglAddress, isValidEthAddress, sha3} from '../utils/index.js'

export const bglToWbgl = async (req, res) => {
  const data = req.body
  if (!data.hasOwnProperty('address') || !isValidEthAddress(data.address)) {
    res.status(400).json({
      status: 'error',
      field: 'address',
      message: 'No address or invalid ethereum address provided.',
    })
    return
  }
  const chain = (data.hasOwnProperty('chain') && (data.chain !== 'eth')) ? 'bsc' : 'eth'

  let transfer = await Transfer.findOne({type: 'bgl', chain, to: data.address}).exec()
  if (!transfer) {
    const bglAddress = await RPC.createAddress()
    transfer = new Transfer({
      id: sha3('bgl' + chain + bglAddress + data.address),
      type: 'bgl',
      chain,
      from: bglAddress,
      to: data.address,
    })
  }
  transfer.markModified('type')
  await transfer.save()

  res.json({
    status: 'ok',
    id: transfer.id,
    bglAddress: transfer.from,
  })
}

export const wbglToBgl = async (req, res) => {
  const data = req.body
  if (!data.hasOwnProperty('ethAddress') || !isValidEthAddress(data.ethAddress)) {
    res.status(400).json({
      status: 'error',
      field: 'ethAddress',
      message: 'No ethereum address or invalid address provided.',
    })
    return
  }
  if (!data.hasOwnProperty('bglAddress') || !await isValidBglAddress(data.bglAddress)) {
    res.status(400).json({
      status: 'error',
      field: 'bglAddress',
      message: 'No Bitgesell address or invalid address provided.',
    })
    return
  }
  if (
    !data.hasOwnProperty('signature') ||
    typeof data.signature !== 'object' ||
    !data.signature.hasOwnProperty('address') ||
    !data.signature.hasOwnProperty('msg') ||
    !data.signature.hasOwnProperty('sig') ||
    data.signature.address !== data.ethAddress ||
    data.signature.msg !== data.bglAddress
  ) {
    res.status(400).json({
      status: 'error',
      field: 'signature',
      message: 'No signature or malformed signature provided.',
    })
    return
  }
  if (data.ethAddress !== Eth.web3.eth.accounts.recover(data.bglAddress, data.signature.sig)) {
    res.status(400).json({
      status: 'error',
      field: 'signature',
      message: 'Signature does not match the address provided.',
    })
    return
  }
  const chain = (data.hasOwnProperty('chain') && (data.chain !== 'eth')) ? 'bsc' : 'eth'

  let transfer = await Transfer.findOne({type: 'wbgl', chain, from: data.ethAddress}).exec()
  if (!transfer) {
    transfer = new Transfer({
      id: sha3('wbgl' + chain + data.ethAddress + data.bglAddress),
      type: 'wbgl',
      chain,
      from: data.ethAddress,
      to: data.bglAddress,
    })
  }
  transfer.markModified('type')
  await transfer.save()

  res.json({
    status: 'ok',
    id: transfer.id,
    ethAddress: eth.account,
  })
}
