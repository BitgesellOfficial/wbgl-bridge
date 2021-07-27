import {confirmations, feePercentage, bsc} from '../utils/config.js'
import {Data, RPC, Eth, Bsc} from './index.js'
import Transaction from '../models/Transaction.js'
import Transfer from '../models/Transfer.js'
import Conversion from '../models/Conversion.js'

const expireDate = () => {
  const expireDate = new Date()
  expireDate.setTime(expireDate.getTime() - (7 * 24 * 3600000))
  return expireDate.toISOString()
}

const deductFee = amount => parseFloat(((100 - feePercentage) * amount / 100).toFixed(3))

async function checkTransactions() {
  const blockHash = await Data.get('lastBglBlockHash')
  const result = await RPC.listSinceBlock(blockHash || undefined, confirmations.bgl)

  result.transactions.filter(tx => tx.confirmations >= confirmations.bgl && tx.category === 'receive').forEach(tx => {
    Transfer.findOne({type: 'bgl', from: tx.address, updatedAt: {$gte: expireDate()}}).exec().then(async transfer => {
      if (transfer && ! await Transaction.findOne({id: tx['txid']}).exec()) {
        const Chain = transfer.chain === 'bsc' ? Bsc : Eth
        const transaction = await Transaction.create({
          type: 'bgl',
          id: tx['txid'],
          transfer: transfer._id,
          address: tx['address'],
          amount: tx['amount'],
          blockHash: tx['blockhash'],
          time: new Date(tx['time'] * 1000),
        })
        const amount = deductFee(tx['amount'])
        const conversion = await Conversion.create({
          type: 'wbgl',
          transfer: transfer._id,
          transaction: transaction._id,
          address: transfer.to,
          amount: tx['amount'],
          sendAmount: amount,
        })

        try {
          const receipt = await Chain.sendWBGL(transfer.to, amount.toString(), async txHash => {
            console.log(`txHash: ${txHash}`)
            conversion.txid = txHash
            await conversion.save()
          })
          conversion.status = 'sent'
          conversion.receipt = receipt
          conversion.markModified('receipt')
          await conversion.save()
        } catch (e) {
          console.log(`Error sending ${amount} WBGL to ${transfer.to}`, e)
          conversion.status = 'error'
          await conversion.save()
        }
      }
    })
  })

  await Data.set('lastBglBlockHash', result['lastblock'])
}

async function subscribeToTokenTransfers(Chain = Eth, prefix = 'Eth') {
  const blockNumber = await Data.get(`last${prefix}BlockNumber`, await Chain.web3.eth.getBlockNumber() - 1000)
  Chain.WBGL.events.Transfer({
    fromBlock: blockNumber,
    filter: {to: Chain.custodialAccountAddress},
  }).on('data', async event => {
    Transfer.findOne({type: 'wbgl', chain: Chain.id, from: event.returnValues.from, updatedAt: {$gte: expireDate()}}).exec().then(async transfer => {
      if (transfer && ! await Transaction.findOne({id: event.transactionHash}).exec()) {
        const amount = Chain.convertWGBLBalance(event.returnValues.value)
        const sendAmount = deductFee(amount)
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
          sendAmount,
        })

        try {
          conversion.txid = await RPC.send(transfer.to, sendAmount)
          conversion.status = 'sent'
          await conversion.save()
        } catch (e) {
          console.error(`Error sending ${sendAmount} BGL to ${transfer.to}`, e)
          conversion.status = 'error'
          await conversion.save()
        }
      }
    })
    await Data.set(`last${prefix}BlockHash`, event.blockHash)
    await Data.set(`last${prefix}BlockNumber`, event.blockNumber)
  })
}

export const init = () => {
  checkTransactions().then(() => setInterval(checkTransactions, 60000)).catch(console.log)
  subscribeToTokenTransfers(Eth, 'Eth').then(() => {})
  subscribeToTokenTransfers(Bsc, 'Bsc').then(() => {})
}
