import {useForm} from 'react-hook-form'
import {Box, Button, TextField} from '@material-ui/core'

function WbglToBgl() {
  const {register, handleSubmit, getValues, formState: {errors}} = useForm()

  const validateSignature = value => {
    try {
      const signature = JSON.parse(value)
      if (typeof signature === 'object' && signature !== null) {
        if (signature.hasOwnProperty('address') && signature.hasOwnProperty('msg') && signature.hasOwnProperty('sig')) {
          if (signature.address === getValues('ethAddress') && signature.msg === getValues('bglAddress')) {
            return true
          }
        }
      }
      return false
    } catch (e) {
      return false
    }
  }
  const onSubmit = data => {
    data.signature = JSON.parse(data.signature)
    console.log(data)
  }
  const signatureHelperText = "Sign your BGL address with your Ethereum wallet's private key and paste the result here. You can sign your address here: https://app.mycrypto.com/sign-message"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <TextField
        variant="filled"
        margin="normal"
        label="Ethereum Address"
        fullWidth
        required
        helperText={errors['ethAddress'] ? 'Please enter a valid ethereum address.' : 'Enter the Ethereum address you will be sending WBGL tokens from.'}
        {...register('ethAddress', {required: true, pattern: /^0x[a-fA-F0-9]{40}$/i})}
        error={!!errors['ethAddress']}
      />
      <TextField
        variant="filled"
        margin="normal"
        label="BGL Address"
        fullWidth
        required
        helperText={errors['bglAddress'] ? 'Please enter a valid bitgesell address.' : 'Enter the BGL address coins will be sent to.'}
        {...register('bglAddress', {required: true, pattern: /^(bgl1|[135])[a-zA-HJ-NP-Z0-9]{25,39}$/i})}
        error={!!errors['bglAddress']}
      />
      <TextField
        variant="filled"
        margin="normal"
        label="Signed BGL address"
        fullWidth
        required
        multiline
        helperText={signatureHelperText + (errors['signature'] ? ' Please enter a valid signature.' : '')}
        {...register('signature', {required: true, validate: validateSignature})}
        error={!!errors['signature']}
      />
      <Box display="flex" justifyContent="center" m={1}>
        <Button type="submit" variant="contained" color="primary" size="large">Continue</Button>
      </Box>
    </form>
  )
}

export default WbglToBgl
