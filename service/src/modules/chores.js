import { confirmations, feePercentage, bsc, nonces } from "../utils/config.js";
import { Data, RPC, Eth, Bsc } from "./index.js";
import Transaction from "../models/Transaction.js";
import Transfer from "../models/Transfer.js";
import Conversion from "../models/Conversion.js";

let ethNonce = 0;
let bscNonce = 0;

function setupNonce(){
  if ((ethNonce == 0) && (nonces.eth == 0)) {
    ethNonce = Eth.getTransactionCount();
  } else if ((nonces.eth > 0) && (nonces.eth > ethNonce)) {
    ethNonce = nonces.eth;
  }
  if ((bscNonce == 0) && (nonces.bsc == 0)) {
    bscNonce = Bsc.getTransactionCount();
  } else if ((nonces.bsc > 0) && (nonces.bsc > bscNonce)) {
    bscNonce = nonces.bsc;
  }
}

const expireDate = () => {
  const expireDate = new Date();
  expireDate.setTime(expireDate.getTime() - 7 * 24 * 3600000);
  return expireDate.toISOString();
};

const deductFee = (amount) =>
  parseFloat((((100 - feePercentage) * amount) / 100).toFixed(3));

async function returnBGL(conversion, address) {
  try {
    conversion.status = "returned";
    await conversion.save();
    conversion.returnTxid = await RPC.send(address, conversion.amount);
    await conversion.save();
  } catch (e) {
    console.error(
      `Error returning BGL to ${address}, conversion ID: ${conversion._id}.`,
      e,
    );
    conversion.status = "error";
    await conversion.save();
  }
}

async function returnWBGL(Chain, conversion, address) {
  try {
    conversion.status = "returned";
    await conversion.save();
    conversion.returnTxid = await Chain.sendWBGL(
      address,
      conversion.amount.toString(),
    );
    await conversion.save();
  } catch (e) {
    console.error(
      `Error returning WBGL (${Chain.id}) to ${address}, conversion ID: ${conversion._id}.`,
      e,
    );
    conversion.status = "error";
    await conversion.save();
  }
}

async function checkBglTransactions() {
  try {
    const blockHash = await Data.get("lastBglBlockHash");
    const result = await RPC.listSinceBlock(
      blockHash || undefined,
      confirmations.bgl,
    );
    setupNonce();
    result.transactions
      .filter(
        (tx) =>
          tx.confirmations >= confirmations.bgl && tx.category === "receive",
      )
      .forEach((tx) => {
        Transfer.findOne({
          type: "bgl",
          from: tx.address,
          updatedAt: { $gte: expireDate() },
        })
          .exec()
          .then(async (transfer) => {
            if (
              transfer &&
              !(await Transaction.findOne({ id: tx["txid"] }).exec())
            ) {
              const Chain = transfer.chain === "bsc" ? Bsc : Eth;
              const fromAddress = await RPC.getTransactionFromAddress(
                tx["txid"],
              );
              const transaction = await Transaction.create({
                type: "bgl",
                id: tx["txid"],
                transfer: transfer._id,
                address: fromAddress,
                amount: tx["amount"],
                blockHash: tx["blockhash"],
                time: new Date(tx["time"] * 1000),
              });
              const amount = deductFee(tx["amount"]);
              const conversion = await Conversion.create({
                type: "wbgl",
                chain: transfer.chain,
                transfer: transfer._id,
                transaction: transaction._id,
                address: transfer.to,
                amount: tx["amount"],
                sendAmount: amount,
              });

              if (amount > (await Chain.getWBGLBalance())) {
                console.log(
                  `Insufficient WBGL balance, returning ${tx["amount"]} BGL to ${fromAddress}`,
                );
                await returnBGL(conversion, fromAddress);
                return;
              }

              try {
                const AssignedNonce = transfer.chain === "bsc" ? Bsc : Eth;
                if (transfer.chain === "bsc") {
                  bscNonce += 1;
                  conversion.txid = await Chain.sendWBGL(
                    transfer.to,
                    amount.toString(),
                    bscNonce
                  );
                } else {
                  ethNonce += 1;
                  conversion.txid = await Chain.sendWBGL(
                    transfer.to,
                    amount.toString(),
                    ethNonce
                  );
                }
                await conversion.save();
              } catch (e) {
                console.log(
                  `Error sending ${amount} WBGL to ${transfer.to}`,
                  e,
                );
                conversion.status = "error";
                await conversion.save();

                await returnBGL(conversion, fromAddress);
              }
            }
          });
      });

    await Data.set("lastBglBlockHash", result["lastblock"]);
  } catch (e) {
    console.error("Error: checkBglTransactions function failed. Check network");
  }

  setTimeout(checkBglTransactions, 60000);
}

export async function checkWbglTransfers(Chain = Eth, prefix = "Eth") {
  try {
    const currentBlock = await Chain.web3.eth.getBlockNumber();
    console.log("currentBlock: ", currentBlock);
    const blockNumber = Math.max(
      await Data.get(`last${prefix}BlockNumber`, currentBlock - 2000),
      currentBlock - 2000,
    );
    console.log("blockNumber: ", blockNumber);
    const events = await Chain.WBGL.getPastEvents("Transfer", {
      fromBlock: blockNumber + 1,
      toBlock: currentBlock,
      filter: { to: Chain.custodialAccountAddress },
    });
    console.log("event : ", events);
    events.forEach((event) => {
      const fromQuery = {
        $regex: new RegExp(`^${event.returnValues.from}$`, "i"),
      };
      console.log("fromQuery:", fromQuery);
      Transfer.findOne({
        type: "wbgl",
        chain: Chain.id,
        from: fromQuery,
        updatedAt: { $gte: expireDate() },
      })
        .exec()
        .then(async (transfer) => {
          if (
            transfer &&
            !(await Transaction.findOne({
              chain: Chain.id,
              id: event.transactionHash,
            }).exec())
          ) {
            const amount = Chain.convertWGBLBalance(event.returnValues.value);
            const sendAmount = deductFee(amount);
            const transaction = await Transaction.create({
              type: "wbgl",
              chain: Chain.id,
              id: event.transactionHash,
              transfer: transfer._id,
              address: event.returnValues.from,
              amount,
              blockHash: event.blockHash,
              time: Date.now(),
            });
            console.log("transaction:", transaction);
            const conversion = await Conversion.create({
              type: "bgl",
              chain: Chain.id,
              transfer: transfer._id,
              transaction: transaction._id,
              address: transfer.to,
              amount,
              sendAmount,
            });
            console.log("amount : ", amount);
            if (amount > (await RPC.getBalance())) {
              console.log(
                `Insufficient BGL balance, returning ${amount} WBGL to ${transfer.from}`,
              );
              await returnWBGL(Chain, conversion, transfer.from);
              return;
            }

            try {
              conversion.txid = await RPC.send(transfer.to, sendAmount);
              conversion.status = "sent";
              await conversion.save();
            } catch (e) {
              console.error(
                `Error sending ${sendAmount} BGL to ${transfer.to}`,
                e,
              );
              conversion.status = "error";
              await conversion.save();

              await returnWBGL(Chain, conversion, transfer.from);
            }
          }
        });
      Data.set(`last${prefix}BlockHash`, event.blockHash);
      Data.set(`last${prefix}BlockNumber`, event.blockNumber);
    });
  } catch (e) {
    console.error("Error: checkWbglTransfers function failed. Check network");
  }

  setTimeout(() => checkWbglTransfers(Chain, prefix), 60000);
}

async function checkPendingConversions(Chain) {
  const conversions = await Conversion.find({
    chain: Chain.id,
    type: "wbgl",
    status: "pending",
    txid: { $exists: true },
  }).exec();
  let blockNumber;
  console.log("checkPendingConversions:", conversions);
  try {
    for (const conversion of conversions) {
      const receipt = await Chain.getTransactionReceipt(conversion.txid);
      console.log("receipt", receipt);
      blockNumber = blockNumber || (await Chain.web3.eth.getBlockNumber());

      if (receipt && blockNumber - receipt.blockNumber >= Chain.confirmations) {
        conversion.status = "sent";
        conversion.receipt = receipt;
        conversion.markModified("receipt");
      } else {
        conversion.txChecks = (conversion.txChecks || 0) + 1;
      }

      await conversion.save();
    }
  } catch (e) {
    console.error(
      "Error: checkPendingConversions function failed. Check chain network or mongodb",
    );
  }
  setTimeout(() => checkPendingConversions(Chain), 60000);
}

export const init = async () => {
  await checkWbglTransfers(Eth, "Eth");
  await checkWbglTransfers(Bsc, "Bsc");

  await checkBglTransactions();

  await checkPendingConversions(Eth);
  await checkPendingConversions(Bsc);
};
