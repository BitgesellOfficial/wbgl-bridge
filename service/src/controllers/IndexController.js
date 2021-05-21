import {Db, RPC} from '../modules/index.js'

export const healthCheck = async (req, res) => {
  try {
    const blockchainInfo = await RPC.getClient().command('getblockchaininfo')
    if (!Db.isConnected()) {
      res.json(500, {status: 'error', message: 'Database connection not available'})
    }
    res.json({
      status: 'ok',
      blockchainInfo,
    })
  } catch (e) {
    console.log(e)
    res.json(500, {status: 'error', message: 'RPC not available'})
  }
}
