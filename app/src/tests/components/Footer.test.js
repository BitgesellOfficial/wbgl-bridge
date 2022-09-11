import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import  Footer from '../../components/Footer'

describe('Footer Component Tests', () => {
 
  it('it should render Footer component', () => {
    render(<Footer />)
  
    const loadingText = screen.queryAllByText('Loading...')
    expect(loadingText[0]).toBeInTheDocument()
  })
  
 
  
})