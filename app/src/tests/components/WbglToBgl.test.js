import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MetaMaskProvider } from 'metamask-react'

import userEvent from '@testing-library/user-event'

import WbglToBgl from '../../components/WbglToBgl'
import * as utils from '../../utils'

const ROPSTEN_TESTNET_CHAINID = 3
const ROPSTEN_TESTNET_ACCOUNT = '0xBCEeB54fa604FB357750E76229ADf98DfA90580f'
const BITGESEL_TEST_ACCOUNT = 'bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl'

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

jest.mock('../../utils/wallet', () => {
  return {
    ...jest.requireActual('../../utils/wallet'),
    useWbglBalance: () => Math.ceil(Math.random() * 10)
  }
})

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

describe('BglToWbgl Component Tests', () => {
  jest.setTimeout(10000)

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockBglResponse = {
    address: BITGESEL_TEST_ACCOUNT,
    balance: Math.floor(Math.random() * 10),
    feePercentage: Math.random()
  }

  test('should render WbglToBgl component when user has connected MetaMask Wallet', async () => {
    render(
      <MetaMaskProvider>
        <WbglToBgl />
      </MetaMaskProvider>
    )

    const spy = jest.spyOn(window, 'fetch')
    const spyPost = jest.spyOn(utils, 'post')

    const mockedPost = spyPost.mockImplementation((url, data = {}) => {
      return Promise.resolve(mockBglResponse)
    })

    const { address, balance, feePercentage } = await mockedPost()

    await waitFor(async () => {
      await screen.findByTestId('source-address')
      await screen.findByTestId('balance')

      expect(await screen.findByTestId('source-address')).toHaveTextContent(ROPSTEN_TESTNET_ACCOUNT)
      expect(await screen.findByTestId('balance')).toBeInTheDocument()
    }, { timeout: 4000 })
  })


  test('user should send WBGL token When wallet is connected', async () => {

    window.HTMLFormElement.prototype.submit = () => jest.fn()

    render(
      <MetaMaskProvider>
        <WbglToBgl />
      </MetaMaskProvider>
    )

    const spy = jest.spyOn(window, 'fetch')
    const spyPost = jest.spyOn(utils, 'post')
    const onSubmit = jest.fn()

    const mockedPost = spyPost.mockImplementation((url, data = {}) => {
      return Promise.resolve(mockBglResponse)
    })
  

    const data = {
      chain: ROPSTEN_TESTNET_CHAINID,
      ethAddress: ROPSTEN_TESTNET_ACCOUNT,
      signature: '0xtest-signature'
    }
    

    const { chainId } = await mockedPost('/submit/wbgl', data)
    await waitFor(async () => {

      const bglAddressInput = screen.getByTestId('address-input').querySelector('input')
      await userEvent.type(bglAddressInput, BITGESEL_TEST_ACCOUNT)
      
      const blgAddressForm = screen.getByTestId('bgl-address-form')
      fireEvent.submit(blgAddressForm)

      await waitFor(() => expect(mockedPost).toHaveBeenCalled())
      await waitFor(() => expect(mockHandleSubmit).toHaveBeenCalled())
     
    }, { timeout: 4000 })


  })
})
