export const env = process.env.NODE_ENV || 'development'

export const port = process.env.PORT || '8080'

export const rpc = {
  host: process.env.RPC_HOST || 'localhost',
  port: process.env.RPC_PORT || '3445',
  username: process.env.RPC_USER,
  password: process.env.RPC_PASSWORD,
}
