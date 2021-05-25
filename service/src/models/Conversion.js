import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  type: {type: String, required: true},
  transfer: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transfer'},
  transaction: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transaction'},
  address: {type: String, required: true},
  amount: {type: Number, required: true},
  txid: String,
  status: {type: String, default: 'pending'},
})

export default mongoose.model('Conversion', schema)
