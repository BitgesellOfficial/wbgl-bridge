export const env = process.env.NODE_ENV || 'development'

export const port = process.env.PORT || '8080'

export const rpc = {
  host: process.env.RPC_HOST || 'localhost',
  port: process.env.RPC_PORT || '3445',
  username: process.env.RPC_USER,
  password: process.env.RPC_PASSWORD,
}

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
