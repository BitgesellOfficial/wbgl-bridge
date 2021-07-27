import Web3 from 'web3'
import {eth} from '../utils/config.js'
import Web3Base from './web3.js'

const provider = new Web3.providers.WebsocketProvider(eth.endpoint, {
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

export default new Web3Base(provider, 'eth', eth.contract, eth.account, eth.key, 'nonce')
