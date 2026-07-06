import { precoComboMinimo, precoComboUnitario } from '@/lib/precoCombo'
import type { Produto } from '@/types'

const comboCasal: Produto = {
  id: 'cb2',
  nome: 'Combo Casal',
  slug: 'combo-casal',
  categoria: 'combos',
  descricao: '1 Pizza 35cm + 1 Refrigerante 2L.',
  ingredientes: [],
  alergenos: [],
  tempoPreparoMin: 22,
  imagem: '/combos/combo-casal.png',
  precos: { P: 70, M: 70, G: 70 },
  comboPrecoBebidaSeparado: true,
  comboItens: [
    { id: 'pizza1', titulo: 'Pizza 35cm', quantidade: 1, opcoesIds: ['p11'] },
    { id: 'bebida1', titulo: 'Refrigerante 2L', quantidade: 1, opcoesIds: ['be-coca-2l', 'be-guarana-2l'] },
  ],
  massas: [],
  adicionais: [],
}

jest.mock('@/data/produtos', () => ({
  getProdutoPorId: (id: string) => {
    if (id === 'be-coca-2l') {
      return {
        id: 'be-coca-2l',
        nome: 'Coca-Cola 2 L',
        slug: 'coca-cola-2l',
        categoria: 'bebidas',
        descricao: '',
        ingredientes: [],
        alergenos: [],
        tempoPreparoMin: 2,
        imagem: '',
        precos: { P: 13, M: 13, G: 13 },
        massas: [],
        adicionais: [],
      }
    }
    if (id === 'be-guarana-2l') {
      return {
        id: 'be-guarana-2l',
        nome: 'Refrigerante Mineiro 2 L',
        slug: 'refrigerante-mineiro-2l',
        categoria: 'bebidas',
        descricao: '',
        ingredientes: [],
        alergenos: [],
        tempoPreparoMin: 2,
        imagem: '',
        precos: { P: 12, M: 12, G: 12 },
        massas: [],
        adicionais: [],
      }
    }
    if (id === 'be-coca-lata') {
      return {
        id: 'be-coca-lata',
        nome: 'Coca-Cola Lata 350 ml',
        slug: 'coca-cola-lata-350ml',
        categoria: 'bebidas',
        descricao: '',
        ingredientes: [],
        alergenos: [],
        tempoPreparoMin: 2,
        imagem: '',
        precos: { P: 7.7, M: 7.7, G: 7.7 },
        massas: [],
        adicionais: [],
      }
    }
    return undefined
  },
}))

const comboIndividual: Produto = {
  id: 'cb1',
  nome: 'Combo Individual',
  slug: 'combo-individual',
  categoria: 'combos',
  descricao: '1 Pizza 25cm + 1 Refrigerante Lata 350ml.',
  ingredientes: [],
  alergenos: [],
  tempoPreparoMin: 18,
  imagem: '/combos/combo-individual.png',
  precos: { P: 59, M: 59, G: 59 },
  comboPrecoBebidaSeparado: true,
  comboItens: [
    { id: 'pizza1', titulo: 'Pizza 25cm', quantidade: 1, opcoesIds: ['p11'] },
    { id: 'bebida1', titulo: 'Refrigerante Lata 350ml', quantidade: 1, opcoesIds: ['be-coca-lata'] },
  ],
  massas: [],
  adicionais: [],
}

describe('precoCombo', () => {
  it('soma base do combo casal com o preço da bebida escolhida', () => {
    expect(precoComboUnitario(comboCasal, 'P', { bebida1: 'be-coca-2l' })).toBe(83)
    expect(precoComboUnitario(comboCasal, 'P', { bebida1: 'be-guarana-2l' })).toBe(82)
  })

  it('soma base do combo individual com o preço da lata escolhida', () => {
    expect(precoComboUnitario(comboIndividual, 'P', { bebida1: 'be-coca-lata' })).toBe(66.7)
    expect(precoComboMinimo(comboIndividual)).toBe(66.7)
  })

  it('retorna só a base quando a bebida ainda não foi escolhida', () => {
    expect(precoComboUnitario(comboCasal, 'P', {})).toBe(70)
  })

  it('calcula o menor preço possível para o cardápio', () => {
    expect(precoComboMinimo(comboCasal)).toBe(82)
  })

  it('soma o mínimo de cada slot de bebida no combo festa', () => {
    const comboFesta: Produto = {
      id: 'cb6',
      nome: 'Combo Festa',
      slug: 'combo-festa',
      categoria: 'combos',
      descricao: '',
      ingredientes: [],
      alergenos: [],
      tempoPreparoMin: 38,
      imagem: '/combos/combo-festa.png',
      precos: { P: 168, M: 168, G: 168 },
      comboPrecoBebidaSeparado: true,
      comboItens: [
        { id: 'bebida1', titulo: 'Refrigerante 2L (1º)', quantidade: 1, opcoesIds: ['be-guarana-2l', 'be-coca-2l'] },
        { id: 'bebida2', titulo: 'Refrigerante 2L (2º)', quantidade: 1, opcoesIds: ['be-guarana-2l', 'be-coca-2l'] },
      ],
      massas: [],
      adicionais: [],
    }

    expect(precoComboMinimo(comboFesta)).toBe(192)
  })
})
