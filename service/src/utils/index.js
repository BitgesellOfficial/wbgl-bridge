import {Eth} from '../modules/index.js'

export const isValidEthAddress = address => /^0x[a-fA-F0-9]{40}$/i.test(address)

export const isValidBglAddress = address => /^(bgl1|[135])[a-zA-HJ-NP-Z0-9]{25,39}$/i.test(address)

export const sha3 = value => Eth.web3.utils.sha3(value).substring(2)
