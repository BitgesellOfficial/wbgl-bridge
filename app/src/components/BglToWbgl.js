import {useForm} from 'react-hook-form'
import {Box, Button, TextField} from '@material-ui/core'

function BglToWbgl() {
  const {register, handleSubmit, formState: {errors}} = useForm()

  const onSubmit = data => {
    console.log(data)
  }

  return (
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
        <Button type="submit" variant="contained" color="primary" size="large">Continue</Button>
      </Box>
    </form>
  )
}

export default BglToWbgl
