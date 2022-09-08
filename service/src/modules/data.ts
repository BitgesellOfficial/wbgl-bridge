import Data from "../models/Data";

export async function get<U>(name: string, defaultValue?: U) {
  const record = await Data.findOne({ name }).exec();
  return record
    ? record["value"]
    : defaultValue instanceof Function
    ? await defaultValue()
    : defaultValue;
}

export async function set<T>(name: string, value: T) {
  await Data.updateOne({ name }, { value }, { upsert: true });
}
