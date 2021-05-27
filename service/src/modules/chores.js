import {eth} from '../utils/config.js'
import {Data, RPC, Eth} from './index.js'
import Transaction from '../models/Transaction.js'
import Transfer from '../models/Transfer.js'
import Conversion from '../models/Conversion.js'

function expireDate() {
  const expireDate = new Date()
  expireDate.setTime(expireDate.getTime() - (7 * 24 * 3600000))
  return expireDate
}

async function checkTransactions() {
  const blockHash = await Data.get('lastBglBlockHash')
  const result = await RPC.listSinceBlock(blockHash || undefined, 2)

  result.transactions.filter(tx => tx.confirmations >= 3 && tx.category === 'receive').forEach(tx => {
    Transfer.findOne({type: 'bgl', from: tx.address, updatedAt: {$gte: expireDate().toISOString()}}).exec().then(async transfer => {
      if (transfer && ! await Transaction.findOne({id: tx['txid']}).exec()) {
        const transaction = await Transaction.create({
          type: 'bgl',
          id: tx['txid'],
          transfer: transfer._id,
          address: tx['address'],
          amount: tx['amount'],
          blockHash: tx['blockhash'],
          time: new Date(tx['time'] * 1000),
        })
        const conversion = await Conversion.create({
          type: 'wbgl',
          transfer: transfer._id,
          transaction: transaction._id,
          address: transfer.to,
          amount: tx['amount'],
        })

        try {
          const receipt = await Eth.sendWBGL(transfer.to, tx['amount'].toString())
          conversion.status = 'sent'
          conversion.txid = receipt.transactionHash
          conversion.receipt = receipt
          conversion.markModified('receipt')
          await conversion.save()
        } catch (e) {
          console.log(`Error sending ${tx['amount']} WBGL to ${transfer.to}`, e)
          conversion.status = 'error'
          await conversion.save()
        }
      }
    })
  })

  await Data.set('lastBglBlockHash', result['lastblock'])
}

async function subscribeToTokenTransfers() {
  const blockNumber = parseInt(await Data.get('lastEthBlockNumber', 0))
  Eth.WBGL.events.Transfer({
    fromBlock: blockNumber,
    filter: {to: eth.account},
  }).on('data', async event => {
    Transfer.findOne({type: 'wbgl', from: event.returnValues.from, updatedAt: {$gte: expireDate().toISOString()}}).exec().then(async transfer => {
      if (transfer && ! await Transaction.findOne({id: event.transactionHash}).exec()) {
        const amount = Eth.convertWGBLBalance(event.returnValues.value, 8)
        const transaction = await Transaction.create({
          type: 'wbgl',
          id: event.transactionHash,
          transfer: transfer._id,
          address: event.returnValues.from,
          amount,
          blockHash: event.blockHash,
          time: Date.now(),
        })
        const conversion = await Conversion.create({
          type: 'bgl',
          transfer: transfer._id,
          transaction: transaction._id,
          address: transfer.to,
          amount,
        })

        try {
          conversion.txid = await RPC.send(transfer.to, amount)
          conversion.status = 'sent'
          await conversion.save()
        } catch (e) {
          console.error(`Error sending ${amount} BGL to ${transfer.to}`, e)
          conversion.status = 'error'
          await conversion.save()
        }
      }
    })
    await Data.set('lastEthBlockHash', event.blockHash)
    await Data.set('lastEthBlockNumber', event.blockNumber.toString())
  })
}

export const init = () => {
  checkTransactions().then(() => setInterval(checkTransactions, 60000)).catch(console.log)
  subscribeToTokenTransfers().then(() => {})
}
