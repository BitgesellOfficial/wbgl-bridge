import React, {useState} from 'react'
import {Box, Container, CssBaseline, makeStyles, Tab, Tabs} from '@material-ui/core'
import Header from './Header'
import Footer from './Footer'
import BglToWbgl from './BglToWbgl'
import WbglToBgl from './WbglToBgl'

import '@fontsource/roboto'

function TabPanel(props) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`app-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  )
}

function App() {
  const classes = useStyles()
  const [tab, setTab] = useState(0)
  const changeTab = (_event, newValue) => {
    setTab(newValue)
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CssBaseline/>
      <Header/>
      <Box flexGrow={1}>
        <Container maxWidth="sm" className={classes.container}>
          <Box>
            <Tabs value={tab} onChange={changeTab} variant="fullWidth">
              <Tab label="BGL to WBGL"/>
              <Tab label="WBGL to BGL"/>
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <BglToWbgl/>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <WbglToBgl/>
          </TabPanel>
        </Container>
      </Box>
      <Footer/>
    </Box>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
  },

}))

export default App
