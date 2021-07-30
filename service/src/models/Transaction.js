import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  type: {type: String, required: true},
  chain: {type: String, enum: ['eth', 'bsc']},
  id: {type: String, required: true},
  transfer: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transfer'},
  address: {type: String, required: true},
  amount: {type: Number, required: true},
  blockHash: {type: String, required: true},
  time: {type: Date, required: true},
}, {timestamps: true})

export default mongoose.model('Transaction', schema)
