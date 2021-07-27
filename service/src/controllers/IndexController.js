import {Db, RPC, Eth, Bsc} from '../modules/index.js'

export const healthCheck = async (req, res) => {
  try {
    const blockchainInfo = await RPC.getBlockchainInfo()
    if (!Db.isConnected()) {
      res.json(500, {status: 'error', message: 'Database connection not available'})
    }
    res.json({
      status: 'ok',
      BGL: {
        blockchainInfo,
        blockCount: await RPC.getBlockCount(),
        balance: await RPC.getBalance(),
      },
      ETH: {
        chain: await Eth.getChain(),
        gasPrice: await Eth.getGasPrice(),
        wbglBalance: await Eth.getWBGLBalance(),
        transactionCount: await Eth.getTransactionCount(),
      },
      BSC: {
        chain: await Bsc.getChain(),
        gasPrice: await Bsc.getGasPrice(),
        wbglBalance: await Bsc.getWBGLBalance(),
        transactionCount: await Bsc.getTransactionCount(),
      },
    })
  } catch (e) {
    console.log(e)
    res.json(500, {status: 'error', message: 'RPC not available'})
  }
}
