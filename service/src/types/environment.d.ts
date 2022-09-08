declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RPC_HOST: string,
      RPC_PORT: string,
      RPC_USER: string,
      RPC_PASSWORD: string,
      RPC_WALLET: string,
      ETH_ENDPOINT: string,
      ETH_ACCOUNT: string,
      ETH_PRIVKEY: string,
      ETH_CONTRACT_ADDRESS: string,
      BSC_ENDPOINT: string,
      BSC_PRIVKEY: string,
      BSC_ACCOUNT: string,
      BSC_CONTRACT_ADDRESS: string,
      DB_CONNECTION: string,
      DB_DATABASE: string | "wbgl_bridge",
      BGL_MIN_CONFIRMATIONS: string,
      ETH_MIN_CONFIRMATIONS: string,
      BSC_MIN_CONFIRMATIONS: string
      
    }
  }
}