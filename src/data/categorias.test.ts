import { categoriasCardapioVisiveis, categoriasOrdenadas, rotulosCategoria } from './categorias'

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

  it('oculta calzones nas abas do cardápio sem remover do catálogo', () => {
    expect(categoriasCardapioVisiveis).toEqual(['pizzas', 'esfihas', 'combos', 'bebidas'])
    expect(categoriasOrdenadas).toContain('calzones')
  })

  it('expõe rótulos em português', () => {
    expect(rotulosCategoria.pizzas).toBe('Pizzas')
    expect(rotulosCategoria.esfihas).toBe('Esfihas')
    expect(rotulosCategoria.calzones).toBe('Calzones')
    expect(rotulosCategoria.combos).toBe('Combos')
    expect(rotulosCategoria.bebidas).toBe('Bebidas')
  })
})
