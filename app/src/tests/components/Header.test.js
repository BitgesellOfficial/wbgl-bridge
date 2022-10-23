import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Header from '../../components/Header'
import { MetaMaskProvider } from 'metamask-react'

test('renders Header component', () => {
  render(
    <MetaMaskProvider>
      <Header />
    </MetaMaskProvider>
  )
  
  const linkText = screen.getByText('Bitgesell-WBGL Bridge')
  expect(linkText).toBeInTheDocument()
})