import Transfer from '../models/Transfer.js'
import {RPC} from '../modules/index.js'
import {isValidEthAddress, sha3} from '../utils/index.js'

export const bglToWbgl = async (req, res) => {
  const data = req.body
  if (!data.hasOwnProperty('address') || !isValidEthAddress(data.address)) {
    res.json(400, {
      status: 'error',
      field: 'address',
      message: 'No address or invalid ethereum address provided.',
    })
  }

  let transfer = await Transfer.findOne({type: 'bgl', to: data.address}).exec()
  if (!transfer) {
    const bglAddress = await RPC.createAddress()
    transfer = new Transfer({
      id: sha3('bgl' + bglAddress + data.address),
      type: 'bgl',
      from: bglAddress,
      to: data.address,
    })
  }
  await transfer.save()

  res.json({
    status: 'ok',
    id: transfer.id,
    bglAddress: transfer.from,
  })
}
