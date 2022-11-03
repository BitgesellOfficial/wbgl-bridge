import React from 'react'
import { Button } from '@material-ui/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { BSC_MAINNET_PARAMS } from '../constants'

const BSC_MAINNET_CHAIN_ID = 56

export default function SwitchToBSCMainet({ chainId }) {
  console.log(chainId)
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  async function switchToBSCNework() {
    const abstractConnectorArgs = {
      supportedChainIds: [BSC_MAINNET_CHAIN_ID],
    }

    const injectedConnector = new InjectedConnector(abstractConnectorArgs)
    try {
      const provider = await injectedConnector.getProvider()
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [BSC_MAINNET_PARAMS],
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      onClick={async () => {
        await switchToBSCNework()
      }}
      variant="contained"
      color="secondary"
    >
      Switch to BSC Mainnet
    </Button>
  )
}
