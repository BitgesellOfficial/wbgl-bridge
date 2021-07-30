import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  type: {type: String, required: true},
  chain: {type: String, enum: ['eth', 'bsc'], default: 'eth'},
  transfer: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transfer'},
  transaction: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transaction'},
  address: {type: String, required: true},
  amount: {type: Number, required: true},
  sendAmount: {type: Number},
  txid: String,
  nonce: Number,
  receipt: Object,
  status: {type: String, default: 'pending'},
}, {timestamps: true})

export default mongoose.model('Conversion', schema)
