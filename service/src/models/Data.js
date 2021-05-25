import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  value: {type: String, required: true},
})

export default mongoose.model('Data', schema)
