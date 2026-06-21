import { render, screen } from '@testing-library/react'
import { Sobre } from './Sobre'

describe('Sobre', () => {
  it('renderiza título e trechos do posicionamento', () => {
    render(<Sobre />)
    expect(screen.getByRole('heading', { level: 1, name: /sobre o don salerno/i })).toBeInTheDocument()
    expect(screen.getByText(/48 horas/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /nossa cozinha/i })).toBeInTheDocument()
    expect(screen.getByText(/Massa fermentada com tempo/i)).toBeInTheDocument()
  })
})
