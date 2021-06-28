export const env = process.env.NODE_ENV || 'development'

export const port = process.env.PORT || '8080'

const rpcConfig = {
  host: process.env.RPC_HOST || 'localhost',
  port: process.env.RPC_PORT || '3445',
}
if (process.env.hasOwnProperty('RPC_USER') && process.env.RPC_USER) {
  rpcConfig.username = process.env.RPC_USER
}
if (process.env.hasOwnProperty('RPC_PASSWORD') && process.env.RPC_PASSWORD) {
  rpcConfig.password = process.env.RPC_PASSWORD
}
rpcConfig.confirmations = 2
export const rpc = rpcConfig

export const eth = {
  endpoint: process.env.ETH_ENDPOINT,
  account: process.env.ETH_ACCOUNT,
  key: Buffer.from(process.env.ETH_PRIVKEY, 'hex'),
  contract: process.env.ETH_CONTRACT_ADDRESS,
}

export const mongo = {
  url: process.env.DB_CONNECTION,
  database: process.env.DB_DATABASE || 'wbgl_bridge',
}
