import {isTest, serviceUrl} from './config'

export const url = path => serviceUrl + path

export const fetcher = url => fetch(url).then(res => res.json())

export const post = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export function chainLabel(chainId) {
  const names = {
    eth: 'Ethereum',
    bsc: 'Binance Smart Chain',
  }
  let chain = chainId

  if (!['eth', 'bsc'].includes(chainId)) {
    chain = isChainBsc(chainId) ? 'bsc' : 'eth'
  }

  return names[chain]
}

export function isChainValid(chainId) {
  return isTest ? [3, 97, '0x3', '0x61'].includes(chainId) : [1, 56, '0x1', '0x38'].includes(chainId)
}

export const isChainBsc = chainId => (typeof chainId == 'string' ? ['0x38', '0x61'] : [56, 97]).includes(chainId)

let contracts
export async function getTokenAddress(chainId) {
  if (!contracts) {
    contracts = await (await fetch(url('/contracts'))).json()
  }
  return contracts[isChainBsc(chainId) ? 'bsc' : 'eth']
}
