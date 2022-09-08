import mongoose from "mongoose";
import {Chain} from "../types"

interface IConversion  {
  type: string,
  chain: Chain,
  transfer: string,
  transaction: string,
  address: string,
  amount: number,
  sendAmount: number,
  txid: string,
  nonce: number,
  receipt: Object,
  returnTxid: string,
  status: string,
  txChecks: number,
}

const schema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    chain: { type: String, enum: ["eth", "bsc"], default: "eth" },
    transfer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Transfer",
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Transaction",
    },
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    sendAmount: { type: Number },
    txid: String,
    nonce: Number,
    receipt: Object,
    returnTxid: String,
    status: { type: String, default: "pending" },
    txChecks: Number,
  },
  { timestamps: true },
);

export default mongoose.model<IConversion>("Conversion", schema);
