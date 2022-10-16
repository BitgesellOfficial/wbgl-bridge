import React from 'react'
import {Box, Container, Link, makeStyles, Typography} from '@material-ui/core'
import {blueGrey} from '@material-ui/core/colors'

import logo from '../assets/images/logo.png'
import {appTitle} from '../utils/config'
import ConnectWallet from './ConnectWallet'

function Header() {
  const classes = useStyles()

  return (
    <Box p={2} color="white" bgcolor={bgColor} className={classes.container}>
      <Container maxWidth="sm">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            <Link color="inherit" underline="none" href="https://bitcointalk.org/index.php?topic=5238559" target="_blank">
              <img src={logo} alt="BGL" className={classes.logo}/> {appTitle}
            </Link>
          </Typography>
          <ConnectWallet/>
        </Box>
      </Container>
    </Box>
  )
}

const bgColor = blueGrey[700]

const useStyles = makeStyles(theme => ({
  container: {},
  logo: {
    marginLeft: 10,
    marginRight: 5,
    height: 33,
    verticalAlign: 'middle',
  },
}))

export default Header
