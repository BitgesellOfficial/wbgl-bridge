import React, {useState} from 'react'
import {Box, Container, makeStyles, Typography} from '@material-ui/core'
import {grey} from '@material-ui/core/colors'
import useSWR from 'swr'
import {fetcher, url} from '../utils'

const textColor = grey[700]
const bgColor = grey[300]

function useBalance(id) {
  const {data, error} = useSWR(url(`/balance/${id}`), fetcher, {refreshInterval: 60000})
  return {
    balance: data,
    isLoading: !error && typeof data !== 'number',
    isError: error,
  }
}

function Footer() {
  const {balance: bglBalance, isLoading: bglLoading} = useBalance('bgl')
  const {balance: ethBalance, isLoading: ethLoading} = useBalance('eth')
  const {balance: bscBalance, isLoading: bscLoading} = useBalance('bsc')
  const classes = useStyles()
  const balanceClass = isLoading => isLoading ? classes.pulsing : undefined

  return (
    <Box p={2} color={textColor} bgcolor={bgColor}>
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1"><b>Balances:</b></Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">
              BGL: <span className={balanceClass(bglLoading)}>{bglLoading ? 'Loading...' : bglBalance}</span>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">
              WBGL (Eth): <span className={balanceClass(ethLoading)}>{ethLoading ? 'Loading...' : ethBalance}</span>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">
              WBGL (BSC): <span className={balanceClass(bscLoading)}>{bscLoading ? 'Loading...' : bscBalance}</span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

const useStyles = makeStyles(theme => ({
  none: {},
  pulsing: {
    opacity: 0.3,
    animation: '$pulse 0.7s alternate infinite',
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.3,
    },
  },
}))

export default Footer
