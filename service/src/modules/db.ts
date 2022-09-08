import mongoose from "mongoose";
import { mongo } from "../utils/config";

let dbConnected = false;

export const init = async () => {
  try {
    await mongoose.connect(mongo.url as string, {
      dbName: mongo.database,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    setTimeout(() => {
      console.log("DB failed to start");
      init();
    }, 10000);
    return (dbConnected = false);
  }
  return (dbConnected = true);
};

export const isConnected = () => {
  return dbConnected;
};

export const close = async () => {
  await mongoose.disconnect();
  dbConnected = false;
};
