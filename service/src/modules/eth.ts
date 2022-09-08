import { confirmations, eth } from "../utils/config";
import Web3Base from "./web3";

export default new Web3Base(
  eth.endpoint as string,
  "eth",
  eth.contract as string,
  eth.account as string,
  eth.key,
  "nonce",
  confirmations.eth,
);
