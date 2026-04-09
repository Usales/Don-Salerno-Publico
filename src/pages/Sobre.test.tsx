import { render, screen } from '@testing-library/react'
import { Sobre } from './Sobre'

describe('Sobre', () => {
  it('renderiza título e trechos do posicionamento', () => {
    render(<Sobre />)
    expect(screen.getByRole('heading', { level: 1, name: /sobre o don salerno/i })).toBeInTheDocument()
    expect(screen.getByText(/ítalo-brasileira/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /nossa cozinha/i })).toBeInTheDocument()
    expect(screen.getByText(/Execução consistente/i)).toBeInTheDocument()
  })
})
