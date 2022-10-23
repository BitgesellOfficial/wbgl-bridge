import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MetaMaskProvider } from 'metamask-react'
import App from '../../components/App'

describe('App Tests', () => {
  test('it should render App component', () => {
    render(
      <MetaMaskProvider>
        <App />
      </MetaMaskProvider>
    )
    // screen.debug()
    const linkElement = screen.getByRole('link')
    const imgElement = screen.getByRole('img')
    const tabButtonElement = screen.getAllByRole('tab')

    expect(linkElement).toBeInTheDocument()
    expect(imgElement).toBeInTheDocument()
    // mutliple tabs, atleast one should be in the DOM
    expect(tabButtonElement[0]).toBeInTheDocument()

  })

})