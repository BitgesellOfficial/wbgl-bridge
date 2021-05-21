import {RPC} from '../modules/index.js'

export const healthCheck = async (req, res) => {
  try {
    const blockchainInfo = await RPC.getClient().command('getblockchaininfo')
    res.json({
      status: 'ok',
      blockchainInfo,
    })
  } catch (e) {
    console.log(e)
    res.json({status: 'error', message: 'RPC not available'})
  }
}
