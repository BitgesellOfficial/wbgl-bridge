import assert from "assert";
import { BADFAMILY } from "dns";
import { Bsc } from "../modules/index.js";

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
