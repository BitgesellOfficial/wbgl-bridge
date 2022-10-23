import { chainLabel, post } from '../../utils'

jest.mock('../../utils', () => ({
  post: jest.fn((url, data) => { }),
  chainLabel: jest.fn((chain) => { })
}))

describe('Utils test', () => {
  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should fetch using post function', async () => {
    post.mockImplementation((url, data) => {
      return {
        success: true,
        status: "OK"
      }
    })

    const response = await post('/health', { check: true })
    expect(response.success).toBe(true)

  })

  it('should return supported chain name based on chain label', () => {
    chainLabel.mockImplementation((chain) => {
      const chains = {
        eth: 'Ethereum',
        bsc: 'Binance Smart Chain',
      }
      return chains[chain]
    })

    const chain = 'eth'
    const chainName = chainLabel(chain)
    expect(chainName).toEqual('Ethereum')
  })

})