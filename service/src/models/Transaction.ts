import mongoose from "mongoose";
import { Chain } from "../types";

export interface ITransaction {
  type: string,
  chain: Chain,
  id: string,
  transfer: string,
  address: string,
  amount: number,
  blockHash: string,
  time: number
}

export interface Tx extends ITransaction {
  confirmations: number
  txid: string,
  category: string
}

const schema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    chain: { type: String, enum: ["eth", "bsc"] },
    id: { type: String, required: true },
    transfer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Transfer",
    },
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    blockHash: { type: String, required: true },
    time: { type: Date, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("Transaction", schema);
