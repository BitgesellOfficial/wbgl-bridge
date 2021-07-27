import Web3 from 'web3'
import Common from 'ethereumjs-common'
import {bsc} from '../utils/config.js'
import Web3Base from './web3.js'

class Bsc extends Web3Base {
  async transactionOpts() {
    const params = {
      name: 'bnb',
      networkId: await this.web3.eth.net.getId(),
      chainId: await this.web3.eth.getChainId(),
    }
    const common = Common.default.forCustomChain('mainnet', params, 'petersburg')
    return {common}
  }
}

const provider = new Web3.providers.WebsocketProvider(bsc.endpoint, {
  clientConfig: {
    keepalive: true,
    keepaliveInterval: 60000,
  },
  reconnect: {
    auto: true,
    delay: 2500,
    onTimeout: true,
  },
})

export default new Bsc(provider, 'bsc', bsc.contract, bsc.account, bsc.key, 'bscNonce')
