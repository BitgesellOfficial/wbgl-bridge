import assert from "assert";
import { Db } from "../modules/index.js";

describe("init()", () => {
  it("should return true for database init", async () => {
    if (!Db.isConnected()) {
      let isconnected = await Db.init();
      assert.equal(isconnected, true);
    } else {
      assert.equal(Db.isConnected(), true);
    }
  });
});
