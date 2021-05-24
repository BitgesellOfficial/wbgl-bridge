import {Db, RPC, Eth} from '../modules/index.js'

export const healthCheck = async (req, res) => {
  try {
    const blockchainInfo = await RPC.getBlockchainInfo()
    if (!Db.isConnected()) {
      res.json(500, {status: 'error', message: 'Database connection not available'})
    }
    res.json({
      status: 'ok',
      blockchainInfo,
      bglBalance: await RPC.getBalance(),
      ethChain: await Eth.getChain(),
      gasPrice: await Eth.getGasPrice(),
      wbglBalance: await Eth.getWBGLBalance(),
      transactionCount: await Eth.getTransactionCount(),
    })
  } catch (e) {
    console.log(e)
    res.json(500, {status: 'error', message: 'RPC not available'})
  }
}
