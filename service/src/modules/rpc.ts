import Client from "bitcoin-core";
import { rpc, confirmations } from "../utils/config.js";


export const getClient = () => {
  let client;
  if (!client) {
    client = new Client(rpc);
  }
  return client;
};

export const getBlockchainInfo = async () =>
  await getClient().command("getblockchaininfo");

export const getBlockCount = async () =>
  await getClient().command("getblockcount");

export const getBalance = async () => await getClient().command("getbalance");

export const validateAddress = async (address: string): Promise<boolean> =>
  (await getClient().command("validateaddress", address)).isvalid;

export const createAddress = async () =>
  await getClient().command("getnewaddress");

export const tips = async () => await getClient().getChainTips();
export const generate = async (tip: string) => await getClient().generate(tip);

export const listSinceBlock = async (
  blockHash: string,
  confirmation = confirmations.bgl,
) => {
  return await getClient().command(
    "listsinceblock",
    blockHash ? blockHash : undefined,
    confirmation,
  );
};

export const getTransactionFromAddress = async (txid: string) => {
  const rawTx = await getClient().command("getrawtransaction", txid, true);
  const vin = rawTx["vin"][0];
  const txIn = await getClient().command("getrawtransaction", vin.txid, true);
  return txIn["vout"][vin["vout"]]["scriptPubKey"]["address"];
};

export const send = async (address: string, amount: string) =>
  await getClient().command("sendtoaddress", address, amount);
