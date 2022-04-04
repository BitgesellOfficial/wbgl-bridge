import assert from "assert";
import { Eth } from "../modules/index.js";

describe("instantiate ethereum via Web3Base", () => {
  it("should return handle to communicate ethereum", () => {
    assert.ok(Eth);
  });
});
