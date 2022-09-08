import Common from "ethereumjs-common";
import { bsc, confirmations } from "../utils/config.js";
import Web3Base from "./web3.js";

class Bsc extends Web3Base {
  private networkId!: number
  private chainId!: number

  constructor(
    endpoint: string,
    id: string,
    contractAddress: string,
    custodialAccountAddress: string,
    custodialAccountKey: Buffer,
    nonceDataName: string,
    confirmations: number,
  ) {
    super(endpoint, id, contractAddress, custodialAccountAddress,custodialAccountKey, nonceDataName, confirmations)
  }

  async getNetworkId() {
    if (!this.networkId) {
      this.networkId = await this.web3.eth.net.getId();
    }
    return this.networkId;
  }

  async getChainId() {
    if (!this.chainId) {
      this.chainId = await this.web3.eth.getChainId();
    }
    return this.chainId;
  }

  //@ts-ignore
  async transactionOpts() {
    const params = {
      name: "bnb",
      networkId: await this.getNetworkId(),
      chainId: await this.getChainId(),
    };
    const common = Common.forCustomChain(
      "mainnet",
      params,
      "petersburg",
    );
    return { common };
  }
}

export default new Bsc(
  bsc.endpoint as string,
  "bsc",
  bsc.contract as string,
  bsc.account as string,
  bsc.key,
  "bscNonce",
  confirmations.bsc,
);
