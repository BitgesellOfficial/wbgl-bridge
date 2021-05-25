import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  id: {type: String, required: true},
  type: {type: String, required: true},
  from: {type: String, required: true},
  to: {type: String, required: true},
}, {timestamps: true})

export default mongoose.model('Transfer', schema)
