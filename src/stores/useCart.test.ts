import { useCart } from './useCart'
import type { Produto } from '@/types'

// Produto mock para testes
const pizzaMock: Produto = {
  id: 'p11',
  nome: 'Baiana',
  slug: 'baiana',
  categoria: 'pizzas',
  descricao: 'Pizza baiana',
  ingredientes: ['Molho', 'Mussarela', 'Calabresa'],
  alergenos: ['Glúten', 'Lactose'],
  tempoPreparoMin: 15,
  imagem: '/hero-pizza-baiana.png',
  precos: { P: 59.9, M: 68.9, G: 79.9 },
  massas: [],
  adicionais: [
    { id: 'a1', nome: 'Bacon', preco: 5 },
    { id: 'a2', nome: 'Catupiry', preco: 4 },
  ],
}

const esfihaMock: Produto = {
  id: 'e1',
  nome: 'Esfiha de Carne',
  slug: 'esfiha-carne',
  categoria: 'esfihas',
  descricao: 'Esfiha aberta de carne',
  ingredientes: ['Carne'],
  alergenos: ['Glúten'],
  tempoPreparoMin: 10,
  imagem: '/hero-esfiha-carne.png',
  precos: { P: 8, M: 8, G: 8 },
  massas: [],
  adicionais: [],
}

// Mock do getProdutoPorId
jest.mock('@/data/produtos', () => ({
  getProdutoPorId: (id: string) => {
    if (id === 'p11') return pizzaMock
    if (id === 'e1') return esfihaMock
    return undefined
  },
  getProdutosPorCategoria: () => [],
}))

beforeEach(() => {
  useCart.setState({ itens: [], cupomAplicado: null, observacaoPedido: '' })
  localStorage.clear()
})

describe('useCart', () => {
  it('adiciona um produto ao carrinho', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    const { itens } = useCart.getState()
    expect(itens).toHaveLength(1)
    expect(itens[0].produtoId).toBe('p11')
    expect(itens[0].tamanho).toBe('P')
    expect(itens[0].quantidade).toBe(1)
    expect(itens[0].precoUnit).toBe(59.9)
  })

  it('incrementa quantidade ao adicionar o mesmo item', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    useCart.getState().adicionar(pizzaMock, 'P')
    const { itens } = useCart.getState()
    expect(itens).toHaveLength(1)
    expect(itens[0].quantidade).toBe(2)
  })

  it('cria linha separada para tamanhos diferentes', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    useCart.getState().adicionar(pizzaMock, 'G')
    const { itens } = useCart.getState()
    expect(itens).toHaveLength(2)
  })

  it('calcula subtotal corretamente', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    useCart.getState().adicionar(pizzaMock, 'G')
    const subtotal = useCart.getState().subtotal()
    expect(subtotal).toBeCloseTo(59.9 + 79.9, 2)
  })

  it('remove item do carrinho', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    const linhaId = useCart.getState().itens[0].id
    useCart.getState().remover(linhaId)
    expect(useCart.getState().itens).toHaveLength(0)
  })

  it('limpa o carrinho inteiro', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    useCart.getState().adicionar(esfihaMock, 'P')
    useCart.getState().limparCarrinho()
    expect(useCart.getState().itens).toHaveLength(0)
    expect(useCart.getState().cupomAplicado).toBeNull()
  })

  it('define quantidade e remove se < 1', () => {
    useCart.getState().adicionar(pizzaMock, 'P')
    const linhaId = useCart.getState().itens[0].id
    useCart.getState().definirQuantidade(linhaId, 0)
    expect(useCart.getState().itens).toHaveLength(0)
  })

  it('limita quantidade máxima a 99', () => {
    useCart.getState().adicionar(pizzaMock, 'P', { quantidade: 99 })
    const linhaId = useCart.getState().itens[0].id
    useCart.getState().definirQuantidade(linhaId, 150)
    expect(useCart.getState().itens[0].quantidade).toBe(99)
  })

  it('aplica cupom válido', () => {
    const resultado = useCart.getState().aplicarCupom('SALERNO10')
    expect(resultado.ok).toBe(true)
    expect(useCart.getState().cupomAplicado?.percentual).toBe(10)
  })

  it('rejeita cupom inválido', () => {
    const resultado = useCart.getState().aplicarCupom('INVALIDO')
    expect(resultado.ok).toBe(false)
    expect(useCart.getState().cupomAplicado).toBeNull()
  })

  it('calcula desconto corretamente', () => {
    useCart.getState().adicionar(pizzaMock, 'G') // 79.9
    useCart.getState().aplicarCupom('PIZZA15') // 15%
    const desconto = useCart.getState().descontoValor()
    expect(desconto).toBeCloseTo(79.9 * 0.15, 2)
  })

  it('total nunca é negativo', () => {
    useCart.setState({ cupomAplicado: null })
    expect(useCart.getState().total()).toBe(0)
  })

  it('define observação com limite de 2000 chars', () => {
    const textoLongo = 'a'.repeat(3000)
    useCart.getState().definirObservacaoPedido(textoLongo)
    expect(useCart.getState().observacaoPedido.length).toBe(2000)
  })

  it('adiciona pizza meio a meio com segundo sabor', () => {
    useCart.getState().adicionar(pizzaMock, 'G', {
      partes: 'meio-meio',
      segundoSabor: { produtoId: 'e1', nome: 'Esfiha de Carne' },
    })
    const { itens } = useCart.getState()
    expect(itens[0].partes).toBe('meio-meio')
    expect(itens[0].segundoSabor?.produtoId).toBe('e1')
  })

  it('adiciona adicionais ao item', () => {
    useCart.getState().adicionar(pizzaMock, 'P', {
      adicionais: [{ id: 'a1', nome: 'Bacon', preco: 5 }],
    })
    const { itens } = useCart.getState()
    expect(itens[0].adicionais).toHaveLength(1)
    expect(itens[0].precoUnit).toBeCloseTo(59.9 + 5, 2)
  })

  it('totalItens soma todas as quantidades', () => {
    useCart.getState().adicionar(pizzaMock, 'P', { quantidade: 2 })
    useCart.getState().adicionar(esfihaMock, 'P', { quantidade: 3 })
    expect(useCart.getState().totalItens()).toBe(5)
  })
})
