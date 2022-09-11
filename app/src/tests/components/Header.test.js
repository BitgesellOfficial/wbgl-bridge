import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Header from '../../components/Header'

test('renders Header component', () => {
  render(<Header/>)
  const linkText = screen.getByText('Bitgesell-WBGL Bridge')
  expect(linkText).toBeInTheDocument()
})