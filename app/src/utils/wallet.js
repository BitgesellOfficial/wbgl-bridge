import {useEffect, useState} from 'react'
import {useMetaMask} from 'metamask-react'
import Web3 from 'web3'

import abi from '../assets/abi/WBGL.json'
import {getTokenAddress, isChainValid} from './index'

let web3
let WBGL
let interval

export function getWeb3(ethereum) {
  if (!web3) {
    web3 = new Web3(ethereum)
  }
  return web3
}

export function useWbglBalance() {
  const [balance, setBalance] = useState('')
  const {ethereum, account, chainId} = useMetaMask()

  const fetch = async () => {
    const current = web3.utils.fromWei(await WBGL.methods['balanceOf'](account).call(), 'ether')
    setBalance(current)
  }

  useEffect(() => {
    if (isChainValid(chainId)) {
      getTokenAddress(chainId).then(async contractAddress => {
        const web3 = getWeb3(ethereum)
        WBGL = new web3.eth.Contract(abi, contractAddress)

        await fetch()

        interval = setInterval(fetch, 30000)
      })

      return () => clearInterval(interval)
    }
  }, [])

  return balance
}

export async function sendWbgl(chainId, from, to, amount, ethereum) {
  const web3 = getWeb3(ethereum)
  const value = web3.utils.toWei(amount, 'ether');

  WBGL = WBGL || new web3.eth.Contract(abi, await getTokenAddress(chainId))

  await WBGL.methods.transfer(to, value).send({from})
}
