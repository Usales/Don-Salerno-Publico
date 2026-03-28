import type { Produto } from '@/types'

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

const alergenoPizzaPadrao =
  'Contém glúten e lactose. Pode conter ovos e outros; informe restrições no pedido.'

function pizzaSabor(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'precos' | 'tempoPreparoMin'> & {
    ingredientes?: string[]
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  return {
    ...o,
    categoria: 'pizzas',
    ingredientes: o.ingredientes ?? [o.descricao],
    alergenos: o.alergenos ?? [alergenoPizzaPadrao],
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  }
}

function esfihaSabor(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'precos' | 'tempoPreparoMin'> & {
    ingredientes?: string[]
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  return {
    ...o,
    categoria: 'esfihas',
    ingredientes: o.ingredientes ?? [o.descricao],
    alergenos: o.alergenos ?? [alergenoPizzaPadrao],
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  }
}

export const produtos: Produto[] = [
  pizzaSabor({
    id: 'p1',
    slug: 'margherita',
    nome: 'Margherita',
    descricao:
      'A clássica italiana feita como deve ser: molho de tomate feito a partir de tomates italianos encorpados, mussarela de búfala cremosa, manjericão fresco e finalizada com azeite extravirgem. Leve, aromática e irresistível.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-margherita.png',
    imagemDestaque: '/hero-pizza-margherita-destaque.png',
    precos: { P: 42, M: 58, G: 72 },
    ingredientes: [
      'Molho de tomate (tomates italianos encorpados)',
      'mussarela de búfala cremosa',
      'manjericão fresco',
      'azeite extravirgem',
    ],
  }),
  pizzaSabor({
    id: 'p2',
    slug: 'calabresa',
    nome: 'Calabresa',
    descricao:
      'Calabresa fatiada no ponto certo, coberta com cebola em rodelas e mussarela derretida. Um clássico de boteco elevado ao nível de pizza artesanal — simples, intenso e impossível de errar.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-calabresa.png',
    precos: { P: 44, M: 60, G: 74 },
    ingredientes: ['Calabresa fatiada', 'Cebola fresca em rodelas', 'Mussarela derretida'],
  }),
  pizzaSabor({
    id: 'p3',
    slug: 'portuguesa',
    nome: 'Portuguesa',
    descricao: 'Presunto, ovos, cebola, palmito, ervilha e mussarela na medida certa.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-portuguesa.png',
    precos: { P: 46, M: 62, G: 76 },
    ingredientes: ['Presunto', 'ovos', 'cebola', 'palmito', 'ervilha', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p4',
    slug: 'pepperoni',
    nome: 'Pepperoni',
    descricao: 'Pepperoni levemente apimentado, mussarela e orégano — estilo americano.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza.png',
    precos: { P: 48, M: 64, G: 78 },
    ingredientes: ['Pepperoni levemente apimentado', 'mussarela', 'orégano'],
  }),
  pizzaSabor({
    id: 'p5',
    slug: 'quatro-queijos',
    nome: 'Quatro queijos',
    descricao: 'Mussarela, provolone, gorgonzola e parmesão — cremosa e intensa.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza.png',
    precos: { P: 47, M: 63, G: 77 },
    ingredientes: ['Mussarela', 'provolone', 'gorgonzola', 'parmesão'],
  }),
  pizzaSabor({
    id: 'p6',
    slug: 'frango-catupiry',
    nome: 'Frango com catupiry',
    descricao: 'Frango desfiado temperado, catupiry original e um toque de milho verde.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza.png',
    precos: { P: 45, M: 61, G: 75 },
    ingredientes: ['Frango desfiado temperado', 'catupiry original', 'milho verde'],
  }),
  pizzaSabor({
    id: 'p8',
    slug: 'napolitana',
    nome: 'Napolitana',
    descricao: 'Anchovas, alcaparras, tomate cereja e mussarela — sabor marcante do mar.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza.png',
    precos: { P: 49, M: 65, G: 79 },
    ingredientes: ['Anchovas', 'alcaparras', 'tomate cereja', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p9',
    slug: 'vegetariana',
    nome: 'Vegetariana',
    descricao: 'Pimentões, champignon, palmito, cebola roxa e mussarela.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza.png',
    precos: { P: 45, M: 61, G: 75 },
    ingredientes: ['Pimentões', 'champignon', 'palmito', 'cebola roxa', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p10',
    slug: 'carne-seca-cream-cheese',
    nome: 'Carne seca com cream cheese',
    descricao: 'Carne seca desfiada, cream cheese, cebola roxa e mussarela.',
    tempoPreparoMin: 25,
    imagem: '/hero-pizza.png',
    precos: { P: 52, M: 68, G: 82 },
    ingredientes: ['Carne seca desfiada', 'cream cheese', 'cebola roxa', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p11',
    slug: 'baiana',
    nome: 'Baiana',
    descricao: 'Calabresa moída, pimenta, cebola, azeitona e mussarela — com pegada.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-calabresa.png',
    precos: { P: 46, M: 62, G: 76 },
    ingredientes: ['Calabresa moída', 'pimenta', 'cebola', 'azeitona', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p12',
    slug: 'moda-da-casa',
    nome: 'Moda da casa',
    descricao: 'Combinação do dia: frango, bacon, milho, mussarela e catupiry — pergunte no balcão.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza.png',
    precos: { P: 50, M: 66, G: 80 },
    ingredientes: ['Frango', 'bacon', 'milho', 'mussarela', 'catupiry'],
  }),
  pizzaSabor({
    id: 'p13',
    slug: 'm-m',
    nome: 'M&M',
    descricao:
      'Morango fresco e chocolate na medida certa — doce intenso, contraste levemente ácido e aquela fatia que some antes do café.',
    tempoPreparoMin: 18,
    imagem: '/hero-pizza-duo-chocolate-morango.png',
    precos: { P: 38, M: 52, G: 64 },
    ingredientes: ['Morango fresco', 'Chocolate', 'Base doce da casa'],
  }),
  esfihaSabor({
    id: 'p7',
    slug: 'esfiha-carne',
    nome: 'Esfiha de Carne com Tomate e Cebola',
    descricao: 'Carne moída temperada com tomate e cebola em massa macia assada no forno alto.',
    tempoPreparoMin: 16,
    imagem: '/hero-esfiha-carne-tomate-cebola.png',
    imagemDestaque: '/hero-esfiha-carne-tomate-cebola.png',
    precos: { P: 14, M: 18, G: 24 },
    ingredientes: ['Carne moída temperada', 'tomate', 'cebola', 'massa artesanal'],
  }),
  esfihaSabor({
    id: 'p14',
    slug: 'esfiha-calabresa-moida',
    nome: 'Esfiha de Calabresa Moída',
    descricao: 'Recheio de calabresa moída ao molho de tomate, sabor intenso e suculento.',
    tempoPreparoMin: 16,
    imagem: '/hero-esfiha-calabresa-moida.png',
    imagemDestaque: '/hero-esfiha-calabresa-moida.png',
    precos: { P: 15, M: 19, G: 25 },
    ingredientes: ['Calabresa moída', 'molho de tomate', 'cebola', 'ervas finas'],
  }),
  esfihaSabor({
    id: 'p15',
    slug: 'esfiha-mussarela',
    nome: 'Esfiha de Mussarela',
    descricao: 'Mussarela cremosa e dourada no ponto certo, com massa leve e borda macia.',
    tempoPreparoMin: 14,
    imagem: '/hero-esfiha-mussarela.png',
    imagemDestaque: '/hero-esfiha-mussarela.png',
    precos: { P: 13, M: 17, G: 23 },
    ingredientes: ['Mussarela', 'orégano', 'massa artesanal'],
  }),
  esfihaSabor({
    id: 'p16',
    slug: 'esfiha-frango-catupiry',
    nome: 'Esfiha de Frango com Catupiry',
    descricao: 'Frango desfiado bem temperado com catupiry, cremosa e equilibrada.',
    tempoPreparoMin: 17,
    imagem: '/hero-esfiha-frango-catupiry.png',
    imagemDestaque: '/hero-esfiha-frango-catupiry.png',
    precos: { P: 16, M: 20, G: 26 },
    ingredientes: ['Frango desfiado', 'catupiry', 'massa artesanal'],
  }),
  esfihaSabor({
    id: 'p17',
    slug: 'esfiha-doce-chocolate-mms',
    nome: 'Esfiha Doce de Chocolate com M&Ms',
    descricao: 'Chocolate cremoso com M&Ms coloridos em uma versão doce e divertida.',
    tempoPreparoMin: 14,
    imagem: '/hero-esfiha-doce-chocolate-mms.png',
    imagemDestaque: '/hero-esfiha-doce-chocolate-mms.png',
    precos: { P: 15, M: 19, G: 25 },
    ingredientes: ['Creme de chocolate', 'M&Ms', 'massa doce'],
    alergenos: ['Contém glúten e lactose. Pode conter amendoim e oleaginosas.'],
  }),
  {
    id: 'c1',
    nome: 'Calzone presunto & mussarela',
    slug: 'calzone-presunto',
    categoria: 'calzones',
    descricao: 'Meia-lua assada, recheio clássico e selagem firme.',
    ingredientes: ['Farinha de trigo', 'presunto', 'mussarela', 'molho de tomate', 'orégano'],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 22,
    imagem: '/hero-calzone-presunto-queijo.png',
    precos: { P: 32, M: 38, G: 44 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  {
    id: 'c2',
    nome: 'Calzone de calabresa',
    slug: 'calzone-calabresa',
    categoria: 'calzones',
    descricao: 'Calabresa, cebola e mussarela.',
    ingredientes: ['Farinha de trigo', 'calabresa', 'cebola', 'mussarela', 'molho'],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 22,
    imagem: '/hero-calzone-pepperoni.png',
    precos: { P: 34, M: 40, G: 46 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
]

/** Slugs antigos (receitas de massa / molho) → id de produto atual. */
const slugLegadoParaId: Record<string, string> = {
  margherita: 'p1',
  calabresa: 'p2',
  'esfiha-carne': 'p7',
  'massa-napoletana': 'p1',
  'massa-romana-al-teglia': 'p1',
  'massa-new-york': 'p4',
  'massa-chicago-deep-dish': 'p5',
  'massa-detroit': 'p6',
  'massa-siciliana': 'p12',
  'molho-caseiro': 'p1',
  'romeu-e-julieta': 'p13',
}

/** Aceita id (ex.: p1) ou slug (ex.: margherita) ou slug legado. */
export function getProdutoPorId(idOuSlug: string): Produto | undefined {
  const porLegado = slugLegadoParaId[idOuSlug]
  if (porLegado) return produtos.find((p) => p.id === porLegado)
  return produtos.find((p) => p.id === idOuSlug || p.slug === idOuSlug)
}

export function getProdutosPorCategoria(cat: Produto['categoria']): Produto[] {
  return produtos.filter((p) => p.categoria === cat)
}
