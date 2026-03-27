import type { Produto } from '@/types'
import { receitaMolhoTomateTradicional } from './receitaMolhoTomateTradicional'
import { fichasMassas, receitaMassaPorIndice } from './receitasMassasFicha'

const massasPadrao: Produto['massas'] = [
  { id: 'italiana', nome: 'Massa italiana', descricao: 'Tradicional com fermentação lenta.', adicional: 0 },
  { id: 'integral', nome: 'Integral', descricao: 'Farinha integral.', adicional: 4 },
  { id: 'sem-gluten', nome: 'Sem glúten', descricao: 'Base dedicada; pode conter traços de glúten.', adicional: 12 },
]

const adicionaisPadrao: Produto['adicionais'] = [
  { id: 'bacon', nome: 'Bacon crocante', preco: 8 },
  { id: 'catupiry', nome: 'Catupiry', preco: 10 },
  { id: 'rucula', nome: 'Rúcula fresca', preco: 5 },
  { id: 'azeitona', nome: 'Azeitona preta', preco: 4 },
]

function massaDoFicha(
  indice: number,
  extra: Pick<Produto, 'id' | 'slug' | 'imagem' | 'precos' | 'tempoPreparoMin'>,
): Produto {
  const f = fichasMassas[indice]
  return {
    ...extra,
    nome: f.nome,
    categoria: 'massas',
    descricao: `${f.hidratacao} hidratação · ${f.farinha.tipo} (${f.farinha.proteina_percentual} proteína). Escala: 1 kg de farinha.`,
    receita: receitaMassaPorIndice(indice),
    ingredientes: ['Medidas na tabela da receita (1 kg de farinha).'],
    alergenos: ['CONTÉM TRIGO.'],
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  }
}

export const produtos: Produto[] = [
  massaDoFicha(0, {
    id: 'p1',
    slug: 'massa-napoletana',
    tempoPreparoMin: 25,
    imagem:
      'https://images.unsplash.com/photo-1513844316321-dd2466411c4c?w=1200&q=80&auto=format&fit=max',
    precos: { P: 42, M: 58, G: 72 },
  }),
  massaDoFicha(1, {
    id: 'p2',
    slug: 'massa-romana-al-teglia',
    tempoPreparoMin: 20,
    imagem:
      'https://images.unsplash.com/photo-1716237388463-14fdbfc0ca5e?w=1200&q=80&auto=format&fit=max',
    precos: { P: 45, M: 62, G: 78 },
  }),
  massaDoFicha(2, {
    id: 'p3',
    slug: 'massa-new-york',
    tempoPreparoMin: 24,
    imagem:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1280&h=640&fit=crop&auto=format&q=80',
    precos: { P: 40, M: 56, G: 70 },
  }),
  massaDoFicha(3, {
    id: 'p4',
    slug: 'massa-chicago-deep-dish',
    tempoPreparoMin: 25,
    imagem:
      'https://images.unsplash.com/photo-1689778560408-78595f912b97?w=1200&q=80&auto=format&fit=max',
    precos: { P: 44, M: 60, G: 74 },
  }),
  massaDoFicha(4, {
    id: 'p5',
    slug: 'massa-detroit',
    tempoPreparoMin: 20,
    imagem:
      'https://images.unsplash.com/photo-1650039215510-a086786c3da5?w=1200&q=80&auto=format&fit=max',
    precos: { P: 43, M: 59, G: 73 },
  }),
  massaDoFicha(5, {
    id: 'p6',
    slug: 'massa-siciliana',
    tempoPreparoMin: 21,
    imagem:
      'https://images.unsplash.com/photo-1772981277505-c855d2c9314f?w=1200&q=80&auto=format&fit=max',
    precos: { P: 41, M: 57, G: 71 },
  }),
  massaDoFicha(6, {
    id: 'p7',
    slug: 'massa-esfiha',
    tempoPreparoMin: 50,
    imagem:
      'https://images.unsplash.com/photo-1612884610549-ce221d92514a?w=1200&q=80&auto=format&fit=max',
    precos: { P: 39, M: 55, G: 69 },
  }),
  {
    id: 'e1',
    nome: 'Molho de Tomate Tradicional para Pizza',
    slug: 'molho-caseiro',
    categoria: 'molhos',
    descricao:
      'Molho cru ou minimamente processado, com tomate pelado de qualidade — base tradicional para pizza.',
    ingredientes: ['Tomate pelado', 'sal', 'azeite (opcional)', 'manjericão (opcional)'],
    alergenos: ['Contém tomate. Confirme outras restrições no atendimento.'],
    tempoPreparoMin: 10,
    imagem:
      'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=1200&q=80&auto=format&fit=crop',
    precos: { P: 8, M: 10, G: 12 },
    massas: massasPadrao,
    receita: receitaMolhoTomateTradicional,
    adicionais: [
      { id: 'oregano', nome: 'Orégano extra', preco: 1 },
      { id: 'pimenta', nome: 'Pimenta-calabresa', preco: 2 },
    ],
  },
  {
    id: 'c1',
    nome: 'Calzone presunto & mussarela',
    slug: 'calzone-presunto',
    categoria: 'recheios',
    descricao: 'Meia-lua assada, recheio clássico e selagem firme.',
    ingredientes: ['Farinha de trigo', 'presunto', 'mussarela', 'molho de tomate', 'orégano'],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 22,
    imagem: 'https://images.unsplash.com/photo-1513104890138-7c749fdcb608?w=800&q=75',
    precos: { P: 32, M: 38, G: 44 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  {
    id: 'c2',
    nome: 'Calzone de calabresa',
    slug: 'calzone-calabresa',
    categoria: 'recheios',
    descricao: 'Calabresa, cebola e mussarela.',
    ingredientes: ['Farinha de trigo', 'calabresa', 'cebola', 'mussarela', 'molho'],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 22,
    imagem: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=75',
    precos: { P: 34, M: 40, G: 46 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
]

/** Slugs antigos (ex.: margherita) → id do produto atual. */
const slugLegadoParaId: Record<string, string> = {
  margherita: 'p1',
  calabresa: 'p2',
  'esfiha-carne': 'e1',
}

/** Aceita id (ex.: p1) ou slug (ex.: massa-napoletana) ou slug legado. */
export function getProdutoPorId(idOuSlug: string): Produto | undefined {
  const porLegado = slugLegadoParaId[idOuSlug]
  if (porLegado) return produtos.find((p) => p.id === porLegado)
  return produtos.find((p) => p.id === idOuSlug || p.slug === idOuSlug)
}

export function getProdutosPorCategoria(cat: Produto['categoria']): Produto[] {
  return produtos.filter((p) => p.categoria === cat)
}
