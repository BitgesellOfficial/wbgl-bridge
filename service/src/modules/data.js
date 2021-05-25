import Data from '../models/Data.js'

export async function get(name) {
  const record = await Data.findOne({name}).exec()
  return record ? record['value'] : null
}

export async function set(name, value) {
  await Data.updateOne({name}, {value}, {upsert: true})
}
