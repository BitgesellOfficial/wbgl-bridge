import Common from "ethereumjs-common";
import { bsc, confirmations } from "../utils/config.js";
import Web3Base from "./web3.js";

class Bsc extends Web3Base {
  async getNetworkId() {
    try {
      if (!this.networkId) {
        this.networkId = await this.web3.eth.net.getId();
      }
      return this.networkId;
    } catch (error) {
      return null;
    }
  }

  async getChainId() {
    try {
      if (!this.chainId) {
        this.chainId = await this.web3.eth.getChainId();
      }
      return this.chainId;
    } catch (error) {
      return null
    }
  }

  async transactionOpts() {
    const params = {
      name: "bnb",
      networkId: await this.getNetworkId(),
      chainId: await this.getChainId(),
    };
    const common = Common.default.forCustomChain(
      "mainnet",
      params,
      "petersburg",
    );
    return { common };
  }
}

export default new Bsc(
  bsc.endpoint,
  "bsc",
  bsc.contract,
  bsc.account,
  bsc.key,
  "bscNonce",
  confirmations.bsc,
);
