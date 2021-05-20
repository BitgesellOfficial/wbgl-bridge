import {Box, Button, TextField} from '@material-ui/core'

function BglToWbgl() {
  return (
    <form noValidate autoComplete="off">
      <TextField variant="filled" id="to-eth-address" label="Ethereum Address" fullWidth required helperText="Enter the Ethereum address to receive WBGL tokens at." />
      <Box display="flex" justifyContent="center" m={1}>
        <Button type="submit" variant="contained" color="primary" size="large">Continue</Button>
      </Box>
    </form>
  )
}

export default BglToWbgl
