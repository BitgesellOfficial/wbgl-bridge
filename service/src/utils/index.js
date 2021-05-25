import {Eth, RPC} from '../modules/index.js'

export const isValidEthAddress = address => /^0x[a-fA-F0-9]{40}$/i.test(address)

export const isValidBglAddress = async address => RPC.validateAddress(address)

export const sha3 = value => Eth.web3.utils.sha3(value).substring(2)
