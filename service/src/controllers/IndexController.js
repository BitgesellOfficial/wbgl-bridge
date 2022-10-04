import { Db, RPC, Eth, Bsc } from "../modules/index.js";
import { eth, bsc } from "../utils/config.js";

export const healthCheck = async (_req, res) => {
  try {
    await RPC.getBalance();
    if (!Db.isConnected()) {
      res.json(500, {
        status: "error",
        message: "Database connection not available",
      });
    }
    res.json({
      status: "ok",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "RPC not available" });
  }
};

export const state = async (_req, res) => {
  try {
    const blockchainInfo = await RPC.getBlockchainInfo();
    if (!Db.isConnected()) {
      res.json(500, {
        status: "error",
        message: "Database connection not available",
      });
    }
    res.json({
      status: "ok",
      BGL: {
        blockchainInfo,
        blockCount: await RPC.getBlockCount(),
        balance: await RPC.getBalance(),
      },
      ETH: {
        chain: Eth.getChain(),
        gasPrice: await Eth.getGasPrice(),
        wbglBalance: await Eth.getWBGLBalance(),
        transactionCount: await Eth.getTransactionCount(),
      },
      BSC: {
        chain: Bsc.getChain(),
        gasPrice: await Bsc.getGasPrice(),
        wbglBalance: await Bsc.getWBGLBalance(),
        transactionCount: await Bsc.getTransactionCount(),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "RPC not available" });
  }
};

export const contracts = async (_req, res) => {
  res.json({
    eth: eth.contract,
    bsc: bsc.contract,
  });
};
