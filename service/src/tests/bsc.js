import assert from "assert";
import { Bsc, Db } from "../modules/index.js";

describe("instantiate BSC via Web3Base", () => {
  it("should return handle to communicate BSC", () => {
    assert.ok(Bsc);
  });
});

describe("getNetworkId()", () => {
  it("should return BSC network id", async () => {
    let id = await Bsc.getNetworkId();
    const BSC_NETWORK_ID = 56;
    assert.equal(id, BSC_NETWORK_ID);
  });
});

describe("getChainId()", () => {
  it("should return BSC chain id", async () => {
    let id = await Bsc.getChainId();
    const BSC_CHAIN_ID = 56;
    assert.equal(id, BSC_CHAIN_ID);
  });
});

describe("transactionOpts()", () => {
  it("should return BSC transaction options", async () => {
    let opts = await Bsc.transactionOpts();
    assert.ok(opts);
  });
});

describe("getChain()", () => {
  it("should return BSC chain name", () => {
    let chain = Bsc.getChain();
    const MAIN_CHAIN = "mainnet";
    assert.equal(chain, MAIN_CHAIN);
  });
});

describe("getGasPrice()", () => {
  it("should return BSC gas price", async () => {
    let gasPrice = await Bsc.getGasPrice();
    assert.ok(gasPrice > 0);
  });
});

describe("getEstimateGas()", () => {
  it("should return BSC gas estimate", async () => {
    let amount = "0.130";
    let gasEstimate = await Bsc.getEstimateGas(amount);
    assert.ok(gasEstimate > 0);
  });
});

describe("getWBGLBalance()", () => {
  it("should return WGBL token balance", async () => {
    let balance = await Bsc.getWBGLBalance();
    let bal = await Bsc.getWBGLBalance1(
      "0x2ba64efb7a4ec8983e22a49c81fa216ac33f383a",
    );
    assert.ok(balance);
  });
});

describe("getTransactionCount()", () => {
  it("should return BSC transaction nounce", async () => {
    let nounce = await Bsc.getTransactionCount();
    assert.ok(nounce);
  });
});

describe("getTransactionReceipt(txid)", () => {
  it("should return BSC transaction receipt", async () => {
    let txid =
      "0x9cd5c91c7ecac2b57c77e80f802e62c8c243e6399c6d39d970c8d74f3f118c25";
    let receipt = await Bsc.getTransactionReceipt(txid);
    assert.ok(receipt.blockNumber > 1);
  });
});

describe("sendWBGL(address, amount)", () => {
  it("should return BSC send WBGL", async () => {
    if (!Db.isConnected()) {
      let isconnected = await Db.init();
      assert.equal(isconnected, true);
    }
    let address = "0x9192b4E1Fb761658f542d9941739aD434e3d45DF";
    let amount = "10";
    let rtn = await Bsc.sendWBGL(address, amount);
    console.log(rtn);
    assert.ok(rtn);
  });
});
