import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  value: {type: mongoose.Schema.Types.Mixed, required: true},
})

export default mongoose.model('Data', schema)
