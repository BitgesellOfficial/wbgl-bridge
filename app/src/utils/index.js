import {serviceUrl} from './config'

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

export function chainLabel(chain) {
  const names = {
    eth: 'Ethereum',
    bsc: 'Binance Smart Chain',
  }
  return names[chain]
}
