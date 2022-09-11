import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import  WbglToBgl from '../../components/WbglToBgl'

describe('BglToWbgl', () => {
  test('Should render BglToWbgl component', () => {
    render(<WbglToBgl/>)
    const chainLabelElement = screen.getByText('Chain:')
    const ethereumLabel = screen.getByText('Ethereum')
    const binanceLabel = screen.getByText('Binance Smart Chain')
   
    expect(chainLabelElement).toBeInTheDocument()
    expect(ethereumLabel).toBeInTheDocument()
    expect(binanceLabel).toBeInTheDocument()
  })
})