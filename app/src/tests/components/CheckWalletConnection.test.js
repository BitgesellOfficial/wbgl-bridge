import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor } from '@testing-library/react'
import * as metamaskReact from 'metamask-react'
import CheckWalletConnection from '../../components/CheckWalletConnection'

const ROPSTEN_TESTNET_CHAINID = 3
const ROPSTEN_TESTNET_ACCOUNT = '0xBCEeB54fa604FB357750E76229ADf98DfA90580f'
const MetaMaskProvider = metamaskReact.MetaMaskProvider

// mock only the hook
jest.mock('metamask-react', () => {
  return {
    ...jest.requireActual('metamask-react'),
    useMetaMask: () => ({
      status: 'connected',
      chainId: ROPSTEN_TESTNET_CHAINID,
      account: ROPSTEN_TESTNET_ACCOUNT,
      connect: jest.fn()
    })
  }
})


describe('CheckWallectConnection component Test', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should render child props when MetaMask wallet has been connected', async () => {
    const dummyChild = <p>Test text</p>
    render(
      <MetaMaskProvider>
        <CheckWalletConnection>
          {dummyChild}
        </CheckWalletConnection>
      </MetaMaskProvider>
    )

    expect(await screen.findByText(/Test text/)).toBeInTheDocument()


  })
})