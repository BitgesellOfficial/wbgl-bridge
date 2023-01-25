import Client from "bitcoin-core";
import { rpc, confirmations } from "../utils/config.js";
import { logger } from "../utils/logger.js";

let client;

export const getClient = () => {
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

export const validateAddress = async (address) =>
  (await getClient().command("validateaddress", address)).isvalid;

export const createAddress = async () =>
  await getClient().command("getnewaddress");

export const tips = async () => await getClient().getChainTips();
export const generate = async (tip) => await getClient().generate(tip);

export const listSinceBlock = async (
  blockHash,
  confirmation = confirmations.bgl,
) => {
 try {
  return await getClient().command(
    "listsinceblock",
    blockHash ? blockHash : undefined,
    confirmation,
  );
 } catch(error) {
  console.error('Failed to list since block', e)
  logger.error('Failed to list since block', e)
 }
};

export const getTransactionFromAddress = async (txid) => {
 try {
  const rawTx = await getClient().command("getrawtransaction", txid, true);
  const vin = rawTx["vin"][0];
  const txIn = await getClient().command("getrawtransaction", vin.txid, true);
  return txIn["vout"][vin["vout"]]["scriptPubKey"]["address"];
 } catch (e) {
  return null
 }
}

export const send = async (address, amount) => {
  try {
    await getClient().command("sendtoaddress", address, amount);

  } catch (e) {
    console.error('Failed to send', e)
    logger.error(`Failed to send ${amount} to ${address}`, e)
  }
}
