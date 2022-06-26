import {serviceUrl} from './config'

export const url = (path: string) => serviceUrl + path

export const fetcher = (url: string) => fetch(url).then(res => res.json())

export const post = async <T>(url: string, data: T) => {
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

const names = {
  eth: 'Ethereum',
  bsc: 'Binance Smart Chain',
}
export function isChain(maybeChain: string): maybeChain is 'eth' | 'bsc' {
  return maybeChain === "eth" || maybeChain === "bsc";
} 
export function chainLabel(chain: string) {
  if (isChain(chain)) {
    return names[chain];
  } else {
    return "Unknown chain";
  }
}
