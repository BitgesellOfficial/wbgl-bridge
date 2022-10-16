import Transfer from "../models/Transfer.js";
import { RPC, Eth, Bsc } from "../modules/index.js";
import { bsc, eth, feePercentage } from "../utils/config.js";
import { isValidBglAddress, isValidEthAddress, sha3 } from "../utils/index.js";

export const bglToWbgl = async (req, res) => {
  const data = req.body;
  if (!data.hasOwnProperty("address") || !isValidEthAddress(data.address)) {
    res.status(400).json({
      status: "error",
      field: "address",
      message: "No address or invalid ethereum address provided.",
    });
    return;
  }
  const chain =
    data.hasOwnProperty("chain") && data.chain !== "eth" ? "bsc" : "eth";
  const Chain = chain === "eth" ? Eth : Bsc;
  try {
    let transfer = await Transfer.findOne({
      type: "bgl",
      chain,
      to: data.address,
    }).exec();
    if (!transfer) {
      const bglAddress = await RPC.createAddress();
      transfer = new Transfer({
        id: sha3("bgl" + chain + bglAddress + data.address),
        type: "bgl",
        chain,
        from: bglAddress,
        to: data.address,
      });
    }
    transfer.markModified("type");
    await transfer.save();

    res.json({
      status: "ok",
      id: transfer.id,
      bglAddress: transfer.from,
      balance: await Chain.getWBGLBalance(),
      feePercentage: feePercentage,
    });
  } catch (e) {
    console.error(`Error: couldn't reach either RPC server or mongodb `, e);
    res.status(400).json({
      status: "error",
      message: "Network is likely to be down.",
    });
    return;
  }
};

export const wbglToBgl = async (req, res) => {
  const data = req.body;
  if (
    !data.hasOwnProperty("ethAddress") ||
    !isValidEthAddress(data.ethAddress)
  ) {
    res.status(400).json({
      status: "error",
      field: "ethAddress",
      message: "No ethereum address or invalid address provided.",
    });
    return;
  }
  try {
    if (
      !data.hasOwnProperty("bglAddress") ||
      !(await isValidBglAddress(data.bglAddress))
    ) {
      res.status(400).json({
        status: "error",
        field: "bglAddress",
        message: "No Bitgesell address or invalid address provided.",
      });
      return;
    }
    if (
      !data.hasOwnProperty("signature") ||
      typeof data.signature !== "string"
    ) {
      res.status(400).json({
        status: "error",
        field: "signature",
        message: "No signature or malformed signature provided.",
      });
      return;
    }
    const chain =
      data.hasOwnProperty("chain") && data.chain !== "eth" ? "bsc" : "eth";
    console.log("data.chain :", data.chain);
    const Chain = chain === "eth" ? Eth : Bsc;
    if (
      data.ethAddress.toLowerCase() !==
      Chain.web3.eth.accounts.recover(data.bglAddress, data.signature).toLowerCase()
    ) {
      res.status(400).json({
        status: "error",
        field: "signature",
        message: "Signature does not match the address provided.",
      });
      return;
    }

    let transfer = await Transfer.findOne({
      type: "wbgl",
      chain,
      from: data.ethAddress,
    }).exec();
    if (!transfer) {
      transfer = new Transfer({
        id: sha3("wbgl" + chain + data.ethAddress + data.bglAddress),
        type: "wbgl",
        chain,
        from: data.ethAddress,
        to: data.bglAddress,
      });
    }
    transfer.markModified("type");
    await transfer.save();

    res.json({
      status: "ok",
      id: transfer.id,
      address: chain === "eth" ? eth.account : bsc.account,
      balance: await RPC.getBalance(),
      feePercentage: feePercentage,
    });
  } catch (e) {
    console.error(`Error: network related error `, e);
    res.status(400).json({
      status: "error",
      message: "Network is likely to be down.",
    });
    return;
  }
};
