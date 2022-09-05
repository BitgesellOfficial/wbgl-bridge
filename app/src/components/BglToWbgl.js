import {useState, Fragment, createRef, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Box, Button, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography} from '@material-ui/core'
import {post, url, chainLabel} from '../utils'
import ReCAPTCHA from 'react-google-recaptcha'

function BglToWbgl() {
  const {register, handleSubmit, setError, setFocus, formState: {errors}} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [sendAddress, setSendAddress] = useState(false)
  const [balance, setBalance] = useState(0)
  const [feePercentage, setFeePercentage] = useState(0)
  const [chain, setChain] = useState('eth')
  const [captchaToken, setCaptchaToken] = useState(null)

  const onChangeChain = event => setChain(event.target.value)
  const recaptchaRef = createRef()

  useEffect(() => {
    recaptchaRef.current?.execute()
    return () => {
      recaptchaRef.current?.reset()
    }
  }, [captchaToken, recaptchaRef])

  const handleRecaptchaChange = (token) => {
    if (!token) return;
    else setCaptchaToken(token);
  }

  const onSubmit = data => {
    if (!data.chain) data.chain = 'eth'

    setSubmitting(true)
    const _data = { ...data, captchaToken }

    post(url('/submit/bgl'), _data).then(response => {
      setSendAddress(response.bglAddress)
      setBalance(Math.floor(response.balance))
      setFeePercentage(response.feePercentage)
      recaptchaRef.current?.reset()
    }).catch(result => {
      if (result.hasOwnProperty('field')) {
        setError(result.field, {type: 'manual', message: result.message})
        setFocus(result.field)
        recaptchaRef.current?.reset()
      }
    }).finally(() => {
      setSubmitting(false)
      recaptchaRef.current?.reset()
    })
  }

  return !sendAddress ? (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <FormLabel>Chain:</FormLabel>
      <RadioGroup defaultValue="eth" name="chain" {...register('chain')} onChange={onChangeChain}>
        <FormControlLabel value="eth" control={<Radio />} label={'Ethereum'} />
        <FormControlLabel value="bsc" control={<Radio />} label={'Binance Smart Chain'} />
      </RadioGroup>
      <TextField
        variant="filled"
        margin="normal"
        label={`${chainLabel(chain)} Address`}
        fullWidth
        required
        helperText={errors.address ? `Please enter a valid ${chainLabel(chain)} address.` : `Enter the ${chainLabel(chain)} address to receive WBGL tokens at.`}
        {...register('address', {required: true, pattern: /^0x[a-fA-F0-9]{40}$/i})}
        error={!!errors.address}
      />
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        onChange={handleRecaptchaChange}
      />
      <Box display="flex" justifyContent="center" m={1}>
        <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>Continue</Button>
      </Box>
    </form>
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
