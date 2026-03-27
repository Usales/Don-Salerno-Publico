import { categoriasOrdenadas, rotulosCategoria } from './categorias'

describe('categorias', () => {
  it('mantém ordem fixa pizzas → esfihas → sobremesas → bebidas', () => {
    expect(categoriasOrdenadas).toEqual(['pizzas', 'esfihas', 'sobremesas', 'bebidas'])
  })

  it('expõe rótulos em português', () => {
    expect(rotulosCategoria.pizzas).toBe('Pizzas')
    expect(rotulosCategoria.esfihas).toBe('Esfihas')
    expect(rotulosCategoria.sobremesas).toBe('Sobremesas')
    expect(rotulosCategoria.bebidas).toBe('Bebidas')
  })
})
