import {confirmations, eth} from '../utils/config.js'
import Web3Base from './web3.js'

export default new Web3Base(eth.endpoint, 'eth', eth.contract, eth.account, eth.key, 'nonce', confirmations.eth)
