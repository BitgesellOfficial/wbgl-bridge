import {useMetaMask} from 'metamask-react'
import React from 'react'
import {isChainValid} from '../utils'
import {isTest} from '../utils/config'

function CheckWalletConnection({children}) {
  const {status, chainId} = useMetaMask()
  if (status !== 'connected') {
    return 'Please connect wallet.'
  } else if (!isChainValid(chainId)) {
    return `Please connect your wallet to either Ethereum ${isTest ? '(Ropsten)' : ''} or Binance Smart Chain ${isTest ? 'Testnet' : 'Mainnet'}.`
  }
  return children
}

export default CheckWalletConnection
