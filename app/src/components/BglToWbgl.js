import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Box, Button, TextField, Typography} from '@material-ui/core'
import {post, url} from '../utils'

function BglToWbgl() {
  const {register, handleSubmit, setError, setFocus, formState: {errors}} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [sendAddress, setSendAddress] = useState(false)

  const onSubmit = data => {
    setSubmitting(true)
    post(url('/submit/bgl'), data).then(response => {
      setSendAddress(response.bglAddress)
    }).catch(result => {
      if (result.hasOwnProperty('field')) {
        setError(result.field, {type: 'manual', message: result.message})
        setFocus(result.field)
      }
    }).finally(() => setSubmitting(false))
  }

  return !sendAddress ? (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <TextField
        variant="filled"
        margin="normal"
        label="Ethereum Address"
        fullWidth
        required
        helperText={errors.address ? 'Please enter a valid ethereum address.' : 'Enter the Ethereum address to receive WBGL tokens at.'}
        {...register('address', {required: true, pattern: /^0x[a-fA-F0-9]{40}$/i})}
        error={!!errors.address}
      />
      <Box display="flex" justifyContent="center" m={1}>
        <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>Continue</Button>
      </Box>
    </form>
  ) : (
    <Typography>Send BGL to: <code>{sendAddress}</code></Typography>
  )
}

export default BglToWbgl
