import React, {useState} from 'react'
import {Box, Container, CssBaseline, Tab, Tabs} from '@material-ui/core'
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
  const [tab, setTab] = useState(0)
  const changeTab = (_event, newValue) => {
    setTab(newValue)
  }

  return (
    <React.Fragment>
      <CssBaseline/>
      <Container maxWidth="sm">
        <Tabs value={tab} onChange={changeTab} variant="fullWidth">
          <Tab label="BGL to WBGL"/>
          <Tab label="WBGL to BGL"/>
        </Tabs>
        <TabPanel value={tab} index={0}>
          <BglToWbgl />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <WbglToBgl />
        </TabPanel>
      </Container>
    </React.Fragment>
  )
}

export default App
