import {useMetaMask} from 'metamask-react'
import {useState, Fragment} from 'react'
import {useForm} from 'react-hook-form'
import {
  Box,
  Button,
  List, ListItemText,
  Typography,
} from '@material-ui/core'
import {post, url, chainLabel, isChainBsc} from '../utils'
import CheckWalletConnection from './CheckWalletConnection'

function BglToWbgl() {
  const {handleSubmit} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [sendAddress, setSendAddress] = useState(false)
  const [balance, setBalance] = useState(0)
  const [feePercentage, setFeePercentage] = useState(0)
  const {chainId, account} = useMetaMask()

  const onSubmit = () => {
    const data = {
      chain: isChainBsc(chainId) ? 'bsc' : 'eth',
      address: account,
    }

    setSubmitting(true)

    post(url('/submit/bgl'), data).then(response => {
      setSendAddress(response.bglAddress)
      setBalance(Math.floor(response.balance))
      setFeePercentage(response.feePercentage)
    }).catch(result => {
      console.error('Error submitting form:', result)
    }).finally(() => setSubmitting(false))
  }

  return !sendAddress ? (
    <CheckWalletConnection>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <List>
          <ListItemText primary="Chain:" secondary={chainLabel(chainId)}/>
          <ListItemText primary={`Receiving Address:`} secondary={account}/>
        </List>
        <Box display="flex" justifyContent="center" m={1}>
          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>Continue</Button>
        </Box>
      </form>
    </CheckWalletConnection>
  ) : (
    <Fragment>
      <Typography variant="body1" gutterBottom>Send BGL to: <code>{sendAddress}</code></Typography>
      <Typography variant="body2" gutterBottom>
        The currently available WBGL balance is <b>{balance}</b>. If you send more BGL than is available to complete the exchange, your BGL will be returned to your address.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Please note, that a fee of <b>{feePercentage}%</b> will be automatically deducted from the transfer amount. This exchange pair is active for <b>7 days</b>.
      </Typography>
    </Fragment>
  )
}

export default BglToWbgl
