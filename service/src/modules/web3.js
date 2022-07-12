import Web3 from "web3";
//import {Transaction} from 'ethereumjs-tx'
import pkg from "ethereumjs-tx";
const { Transaction } = pkg;
import fs from "fs";
import { Data } from "../modules/index.js";
import { toBaseUnit } from "../utils/index.js";

const bn = Web3.utils.toBN;
const createProvider = (endpoint) => new Web3.providers.HttpProvider(endpoint);

class Web3Base {
  decimals = 18;

  constructor(
    endpoint,
    id,
    contractAddress,
    custodialAccountAddress,
    custodialAccountKey,
    nonceDataName,
    confirmations,
  ) {
    this.id = id;
    this.contractAddress = contractAddress;
    this.custodialAccountAddress = custodialAccountAddress;
    this.custodialAccountKey = custodialAccountKey;
    this.nonceDataName = nonceDataName;
    this.confirmations = confirmations;

    this.web3 = new Web3(createProvider(endpoint));
    this.WBGL = new this.web3.eth.Contract(
      JSON.parse(fs.readFileSync("abi/WBGL.json", "utf8")),
      contractAddress,
    );
    this.WBGL.methods["decimals"]()
      .call()
      .then((decimals) => (this.decimals = decimals));

    this.init()
      .then(() => {})
      .catch((err) => console.log("error ", err));
  }

  async init() {
    const chain = await this.web3.eth.net.getNetworkType();
    this.chain = ["main", "private"].includes(chain) ? "mainnet" : chain;
  }

  getChain() {
    return this.chain;
  }

  async getGasPrice() {
    const gasPrice = await this.web3.eth.getGasPrice();
    return this.web3.utils.fromWei(gasPrice, "Gwei");
  }

  async getEstimateGas(amount) {
    return await this.WBGL.methods["transfer"](
      this.custodialAccountAddress,
      toBaseUnit(amount, this.decimals),
    ).estimateGas({ from: this.custodialAccountAddress });
  }

  async getWBGLBalance() {
    return this.convertWGBLBalance(
      await this.WBGL.methods["balanceOf"](this.custodialAccountAddress).call(),
    );
  }

  async getWBGLBalance1(address) {
    return this.convertWGBLBalance(
      await this.WBGL.methods["balanceOf"](address).call(),
    );
  }

  convertWGBLBalance(number, resultDecimals = this.decimals) {
    const balance = bn(number);
    const divisor = bn(10).pow(bn(this.decimals));
    const beforeDec = balance.div(divisor).toString();
    const afterDec = balance
      .mod(divisor)
      .toString()
      .padStart(this.decimals, "0")
      .substring(0, resultDecimals);
    return beforeDec + (afterDec !== "0" ? "." + afterDec : "");
  }

  async getTransactionCount() {
    return await this.web3.eth.getTransactionCount(
      this.custodialAccountAddress,
      "latest",
    );
  }

  async getTransactionReceipt(txid) {
    return await this.web3.eth.getTransactionReceipt(txid);
  }

  sendWBGL(address, amount, nonce) {
    return new Promise(async (resolve, reject) => {
      const data = this.WBGL.methods["transfer"](
        address,
        toBaseUnit(amount, this.decimals),
      ).encodeABI();
      const rawTx = {
        nonce: this.web3.utils.toHex(nonce),
        gasPrice: this.web3.utils.toHex(
          this.web3.utils.toWei(
            Math.ceil(1.25 * parseFloat(await this.getGasPrice())).toString(),
            "Gwei",
          ),
        ),
        gasLimit: this.web3.utils.toHex(
          (await this.getEstimateGas(amount)) * 2,
        ),
        from: this.custodialAccountAddress,
        to: this.contractAddress,
        value: "0x00",
        data,
      };
      console.log(rawTx);

      const tx = new Transaction(rawTx, await this.transactionOpts());
      tx.sign(this.custodialAccountKey);

      const serializedTx = "0x" + tx.serialize().toString("hex");
      console.log("Serialized tx: " + serializedTx);
      this.web3.eth
        .sendSignedTransaction(serializedTx)
        .on("transactionHash", resolve)
        .on('error', console.error);
    });
  }

  async transactionOpts() {
    return { chain: this.chain };
  }
}

export default Web3Base;
