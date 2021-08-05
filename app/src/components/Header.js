import React from 'react'
import {Box, Container, Link, makeStyles, Typography} from '@material-ui/core'
import {blueGrey} from '@material-ui/core/colors'

import logo from '../assets/images/logo.png'

const bgColor = blueGrey[700]

function Header() {
  const classes = useStyles()

  return (
    <Box p={2} color="white" bgcolor={bgColor} className={classes.container}>
      <Container maxWidth="sm">
        <Typography variant="h6">
          <Link color="inherit" underline="none" href="https://bitcointalk.org/index.php?topic=5238559.msg57598541#msg57598541" target="_blank">
            <img src={logo} alt="BGL" className={classes.logo}/> Bitgesell-WBGL Bridge
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}

const useStyles = makeStyles(theme => ({
  container: {

  },
  logo: {
    //display: 'inline-block',
    marginLeft: 10,
    marginRight: 5,
    height: 33,
    verticalAlign: 'middle',
  },
}))

export default Header
