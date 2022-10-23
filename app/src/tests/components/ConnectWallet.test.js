import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {useMetaMask, MetaMaskProvider} from 'metamask-react'
import ConnectWallet from '../../components/ConnectWallet'

const ROPSTEN_TESTNET_CHAINID = 3
const ROPSTEN_TESTNET_ACCOUNT = '0xBCEeB54fa604FB357750E76229ADf98DfA90580f'

// mock only the hook
// mock only the function then swap out the implementation
jest.mock('metamask-react', () => {
  return {
    ...jest.requireActual('metamask-react'),
    useMetaMask: () =>  ({
      status: 'connected',
      chainId: ROPSTEN_TESTNET_CHAINID,
      account: ROPSTEN_TESTNET_ACCOUNT,
      connect: jest.fn()
    })
  }
})

describe('ConnectWallet component Test', () => {


  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('renders ConnectWallet component', () => {

    const { getByRole } = render(
      <MetaMaskProvider>
        <ConnectWallet />
      </MetaMaskProvider>
    )

   
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
  })

})