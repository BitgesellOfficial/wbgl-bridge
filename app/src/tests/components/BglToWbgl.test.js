import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import BglToWbgl from '../../components/BglToWbgl'
import * as utils from '../../utils'

import { MetaMaskProvider } from 'metamask-react'

const ROPSTEN_TESTNET_CHAINID = 3
const ROPSTEN_TESTNET_ACCOUNT = '0xBCEeB54fa604FB357750E76229ADf98DfA90580f'
const BITGESEL_TEST_ACCOUNT = 'qcBCEeB54fa604FB357750E76229ADf98DfA90580f'

const mockHandleSubmit = jest.fn()
jest.mock('react-hook-form', () => {
  return {
    ...jest.requireActual('react-hook-form'),
    useForm: () => ({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      setError: jest.fn(),
      setFocus: jest.fn(),
      formState: { errors: {} }
    })
  }
})

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

describe('BglToWbgl Component Tests', () => {

  beforeEach(() => {
    window.HTMLFormElement.prototype.submit = () => jest.fn()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render BglToWbgl component when MetaMask wallet is connected', async () => {
    render(
      <MetaMaskProvider>
        <BglToWbgl />
      </MetaMaskProvider>
    )

    await waitFor(async () => {
      await screen.findByText(new RegExp(ROPSTEN_TESTNET_ACCOUNT, 'ig'))
      await screen.findByText(new RegExp(ROPSTEN_TESTNET_CHAINID), 'ig')

      expect(await screen.findByText(new RegExp(ROPSTEN_TESTNET_CHAINID, 'ig'))).toBeInTheDocument()
      expect(await screen.findByText(new RegExp(ROPSTEN_TESTNET_CHAINID, 'ig'))).toBeInTheDocument()
    }, { timeout: 4000 })

  })

  test('should send Bgl To Wbgl when user has connected MetaMask Wallet', async () => {

    render(
      <MetaMaskProvider>
        <BglToWbgl />
      </MetaMaskProvider>
    )

    const spy = jest.spyOn(window, 'fetch')

    const mockBglResponse = {
      bglAddress: BITGESEL_TEST_ACCOUNT,
      balance: Math.floor(Math.random() * 10),
      feePercentage: Math.random()
    }

    const spyPost = jest.spyOn(utils, 'post')

    const mockedPost = spyPost.mockImplementation((url, data = {}) => {
      return Promise.resolve(mockBglResponse)
    })

    const { bglAddress, balance, feePercentage } = await mockedPost()
    fireEvent.click(screen.getByRole('button'))


    await waitFor(async () => {
      await screen.findByText(new RegExp(ROPSTEN_TESTNET_ACCOUNT, 'ig'))
      await screen.findByText(new RegExp(balance), 'ig')
      const recepientAddress = await screen.findByText(new RegExp(ROPSTEN_TESTNET_ACCOUNT, 'ig'))

      const sendForm = screen.getByTestId('send-form')
      fireEvent.submit(sendForm)
      await waitFor(() => expect(mockHandleSubmit).toHaveBeenCalled())
      waitFor(() => expect(recepientAddress).toBeInTheDocument())


    }, { timeout: 4000 })

  })

})