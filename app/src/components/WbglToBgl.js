import {Box, Button, TextField} from '@material-ui/core'

function WbglToBgl() {
  const signatureHelperText = "Sign your BGL address with your Ethereum wallet's private key and paste the result here. You can sign your address here: https://app.mycrypto.com/sign-message"
  return (
    <form noValidate autoComplete="off">
      <TextField variant="filled" id="from-eth-address" label="Ethereum Address" fullWidth required helperText="Enter the Ethereum address you will be sending WBGL tokens from." />
      <TextField variant="filled" id="to-bgl-address" label="BGL Address" fullWidth required helperText="Enter the BGL address coins will be sent to." />
      <TextField variant="filled" id="signed-bgl-address" label="Signed BGL address" fullWidth required multiline helperText={signatureHelperText} />
      <Box display="flex" justifyContent="center" m={1}>
        <Button type="submit" variant="contained" color="primary" size="large">Continue</Button>
      </Box>
    </form>
  )
}

export default WbglToBgl
