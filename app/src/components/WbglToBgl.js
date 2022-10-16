import {Fragment, useState} from 'react'
import {useMetaMask} from 'metamask-react'
import {useForm} from 'react-hook-form'
import {
  Box,
  Button,
  List, ListItemText,
  TextField,
  Typography,
} from '@material-ui/core'
import {chainLabel, isChainBsc, post, url} from '../utils'
import {sendWbgl, useWbglBalance} from '../utils/wallet'
import CheckWalletConnection from './CheckWalletConnection'

function WbglToBgl() {
  const [submitting, setSubmitting] = useState(false)
  const [sendAddress, setSendAddress] = useState('')
  const [balance, setBalance] = useState(0)
  const [feePercentage, setFeePercentage] = useState(0)
  const wbglBalance = useWbglBalance()
  const {chainId, account, ethereum} = useMetaMask()
  const chain = isChainBsc(chainId) ? 'bsc' : 'eth'

  const AddressForm = () => {
    const {register, handleSubmit, setError, setFocus, formState: {errors}} = useForm()

    const onSubmit = async data => {
      setSubmitting(true)

      data.chain = chain
      data.ethAddress = account
      try {
        data.signature = await ethereum.request({
          method: 'personal_sign',
          params: [
            data.bglAddress,
            account,
          ],
        })
      } catch (e) {
        setSubmitting(false)
        return
      }

      post(url('/submit/wbgl'), data).then(response => {
        setSendAddress(response.address)
        setBalance(Math.floor(response.balance))
        setFeePercentage(response.feePercentage)
      }).catch(result => {
        if (result.hasOwnProperty('field')) {
          setError(result.field, {type: 'manual', message: result.message})
          setFocus(result.field)
        }
      }).finally(() => setSubmitting(false))
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <TextField
          variant="filled"
          margin="normal"
          label="BGL Address"
          fullWidth
          required
          helperText={errors['bglAddress'] ? 'Please enter a valid Bitgesell address.' : 'Enter the BGL address coins will be sent to.'}
          {...register('bglAddress', {required: true, pattern: /^(bgl1|[135])[a-zA-HJ-NP-Z0-9]{25,39}$/i})}
          error={!!errors['bglAddress']}
        />
        <Box display="flex" justifyContent="center" m={1}>
          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>Continue</Button>
        </Box>
      </form>
    )
  }

  const SendForm = () => {
    const {register, handleSubmit, setError, formState: {errors}} = useForm()

    const onSubmit = async data => {
      const amount = parseFloat(data.amount)
      const balance = parseFloat(wbglBalance)

      if (!amount || !balance || amount > balance) {
        setError('amount', {type: 'manual', message: 'Not enough WBGL available!', shouldFocus: true})
        return
      }

      setSubmitting(true)
      await sendWbgl(chainId, account, sendAddress, data.amount, ethereum)
      setSubmitting(false)
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <TextField
          variant="filled"
          margin="normal"
          label="WBGL Amount"
          fullWidth
          required
          helperText={errors['amount'] ? 'Please enter a valid amount.' : 'Enter the amount of tokens to send.'}
          {...register('amount', {required: true, pattern: /^[0-9]+\.?[0-9]*$/i})}
          error={!!errors['amount']}
        />
        <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>Send WBGL</Button>
      </form>
    )
  }

  return (
    <CheckWalletConnection>
      <List>
        <ListItemText primary="Chain:" secondary={chainLabel(chainId)}/>
        <ListItemText primary={`Source Address:`} secondary={account}/>
        <ListItemText primary="WBGL Balance:" secondary={wbglBalance}/>
      </List>
      {!sendAddress ? (
        <AddressForm/>
      ) : (
        <Fragment>
          <Typography variant="body2" gutterBottom>
            The currently available BGL balance is <b>{balance}</b>. If you send more WBGL than is available to complete
            the exchange, your WBGL will be returned to your address.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Please note, that a fee of <b>{feePercentage}%</b> will be automatically deducted from the transfer amount.
          </Typography>
          <SendForm/>
        </Fragment>
      )}

    </CheckWalletConnection>
  )
}

export default WbglToBgl
