import mongoose from "mongoose";
import { Chain } from "../types";

enum ChainTypes {
  bgl = "bgl",
  wbgl = "wbgl",
}

type ChainType = string | ChainTypes

interface ITransfer {
  id: string,
  type: ChainType,
  chain: Chain,
  from: string,
  to: string
}

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ["bgl", "wbgl"] },
    chain: { type: String, enum: ["eth", "bsc"], default: "eth" },
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ITransfer>("Transfer", schema);
