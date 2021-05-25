import Data from '../models/Data.js'

export async function get(name, defaultValue = null) {
  const record = await Data.findOne({name}).exec()
  return record ? record['value'] : defaultValue
}

export async function set(name, value) {
  await Data.updateOne({name}, {value}, {upsert: true})
}
