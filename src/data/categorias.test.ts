import { categoriasOrdenadas, rotulosCategoria } from './categorias'

describe('categorias', () => {
  it('mantém ordem fixa pizzas → esfihas → calzones → combos → bebidas', () => {
    expect(categoriasOrdenadas).toEqual([
      'pizzas',
      'esfihas',
      'calzones',
      'combos',
      'bebidas',
    ])
  })

  it('expõe rótulos em português', () => {
    expect(rotulosCategoria.pizzas).toBe('Pizzas')
    expect(rotulosCategoria.esfihas).toBe('Esfihas')
    expect(rotulosCategoria.calzones).toBe('Calzones')
    expect(rotulosCategoria.combos).toBe('Combos')
    expect(rotulosCategoria.bebidas).toBe('Bebidas')
  })
})
