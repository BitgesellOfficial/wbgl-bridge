import {Data, RPC, Eth} from './index.js'
import Transaction from '../models/Transaction.js'
import Transfer from '../models/Transfer.js'

async function checkTransactions() {
  const blockHash = await Data.get('lastBlockHash')
  const result = await RPC.listSinceBlock(blockHash || undefined)
  const expireDate = new Date()
  expireDate.setTime(expireDate.getTime() - (7 * 24 * 3600000))

  result.transactions.filter(tx => tx.confirmations >= 3 && tx.category === 'receive').forEach(tx => {
    Transfer.findOne({type: 'bgl', from: tx.address, updatedAt: {$gte: expireDate.toISOString()}}).exec().then(async transfer => {
      if (transfer && ! await Transaction.findOne({id: tx['txid']}).exec()) {
        await Transaction.create({
          type: 'bgl',
          id: tx['txid'],
          transfer: transfer._id,
          address: tx['address'],
          amount: tx['amount'],
          blockHash: tx['blockhash'],
          time: new Date(tx['time'] * 1000),
        })

        await Eth.sendWBGL(transfer.to, tx['amount'].toString())
      }
    })
  })

  await Data.set('lastBlockHash', result['lastblock'])
}

export const init = () => {
  checkTransactions().then(() => setInterval(checkTransactions, 60000))
}
