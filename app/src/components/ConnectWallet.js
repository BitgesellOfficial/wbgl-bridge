import React from 'react'
import {useMetaMask} from 'metamask-react'
import {Button, Chip} from '@material-ui/core'
import {chainLabel, isChainValid} from '../utils'

function ConnectWallet() {
  const {status, chainId, connect} = useMetaMask()

  switch (status) {
    case 'initializing':
      return (<div>Synchronizing...</div>)

    case 'unavailable':
      return (<div>Please install Metamask!</div>)

    case 'notConnected':
      return (<Button variant="contained" color="secondary" onClick={connect}>Connect</Button>)

    case 'connecting':
      return (<div>Connecting...</div>)

    case 'connected':
      return (<Chip label={chainLabel(chainId)} color={isChainValid(chainId) ? 'primary' : 'secondary'}/>)
  }
}

export default ConnectWallet
