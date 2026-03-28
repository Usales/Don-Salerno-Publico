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

function sobremesaSabor(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'precos' | 'tempoPreparoMin'> & {
    ingredientes?: string[]
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  return {
    ...o,
    categoria: 'sobremesas',
    ingredientes: o.ingredientes ?? [o.descricao],
    alergenos: o.alergenos ?? ['Pode conter glúten, lactose e oleaginosas.'],
    massas: [],
    adicionais: [],
  }
}

export const produtos: Produto[] = [
  pizzaSabor({
    id: 'p1',
    slug: 'margherita',
    nome: 'Margherita',
    descricao:
      'A rainha das clássicas: molho de tomates italianos encorpados, mussarela de búfala cremosa, manjericão fresco e final de azeite extravirgem. Leve, perfumada e elegante em cada fatia.',
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
      'Calabresa fatiada no ponto ideal, cebola fresca em rodelas e mussarela derretendo por cima. Sabor marcante de pizzaria raiz, com aquele equilíbrio que agrada sempre.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-calabresa.png',
    precos: { P: 44, M: 60, G: 74 },
    ingredientes: ['Calabresa fatiada', 'Cebola fresca em rodelas', 'Mussarela derretida'],
  }),
  pizzaSabor({
    id: 'p3',
    slug: 'portuguesa',
    nome: 'Portuguesa',
    descricao:
      'A tradicional bem servida: presunto, ovos, cebola, palmito, ervilha e mussarela em combinação harmônica. Uma pizza completa, cremosa e cheia de personalidade.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-portuguesa.png',
    precos: { P: 46, M: 62, G: 76 },
    ingredientes: ['Presunto', 'ovos', 'cebola', 'palmito', 'ervilha', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p4',
    slug: 'pepperoni',
    nome: 'Pepperoni',
    descricao:
      'Pepperoni levemente picante, mussarela abundante e toque de orégano. Estilo americano, bordas douradas e sabor intenso do primeiro ao último pedaço.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-pepperoni.png',
    precos: { P: 48, M: 64, G: 78 },
    ingredientes: ['Pepperoni levemente apimentado', 'mussarela', 'orégano'],
  }),
  pizzaSabor({
    id: 'p5',
    slug: 'quatro-queijos',
    nome: 'Quatro queijos',
    descricao:
      'Mussarela, provolone, gorgonzola e parmesão em camadas de cremosidade e aroma. Para quem ama queijo de verdade e final persistente no paladar.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-quatro-queijos.png',
    precos: { P: 47, M: 63, G: 77 },
    ingredientes: ['Mussarela', 'provolone', 'gorgonzola', 'parmesão'],
  }),
  pizzaSabor({
    id: 'p6',
    slug: 'frango-catupiry',
    nome: 'Frango com catupiry',
    descricao:
      'Frango desfiado bem temperado, catupiry original cremoso e toque de milho verde. Conforto em forma de pizza, com sabor caseiro e textura perfeita.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-catupiry.png',
    precos: { P: 45, M: 61, G: 75 },
    ingredientes: ['Frango desfiado temperado', 'catupiry original', 'milho verde'],
  }),
  pizzaSabor({
    id: 'p8',
    slug: 'napolitana',
    nome: 'Napolitana',
    descricao:
      'Anchovas, alcaparras, tomate-cereja e mussarela em uma receita de perfil mediterrâneo. Salinidade elegante e acidez fresca na medida certa.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-napolitana.png',
    precos: { P: 49, M: 65, G: 79 },
    ingredientes: ['Anchovas', 'alcaparras', 'tomate cereja', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p9',
    slug: 'vegetariana',
    nome: 'Vegetariana',
    descricao:
      'Pimentões coloridos, champignon, palmito, cebola roxa e mussarela. Leve, aromática e muito saborosa para quem prefere uma opção sem carnes.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-vegetariana.png',
    precos: { P: 45, M: 61, G: 75 },
    ingredientes: ['Pimentões', 'champignon', 'palmito', 'cebola roxa', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p10',
    slug: 'carne-seca-cream-cheese',
    nome: 'Carne seca com cream cheese',
    descricao:
      'Carne seca desfiada, cream cheese cremoso, cebola roxa e mussarela. Um contraste perfeito entre intensidade, cremosidade e toque regional.',
    tempoPreparoMin: 25,
    imagem: '/hero-pizza-carne-seca-cream-cheese.png',
    precos: { P: 52, M: 68, G: 82 },
    ingredientes: ['Carne seca desfiada', 'cream cheese', 'cebola roxa', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p11',
    slug: 'baiana',
    nome: 'Baiana',
    descricao:
      'Calabresa moída, pimenta, cebola, azeitona e mussarela para quem gosta de sabor com atitude. Picância equilibrada e final marcante.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-baiana.png',
    precos: { P: 46, M: 62, G: 76 },
    ingredientes: ['Calabresa moída', 'pimenta', 'cebola', 'azeitona', 'mussarela'],
  }),
  pizzaSabor({
    id: 'p12',
    slug: 'moda-da-casa',
    nome: 'Moda da casa',
    descricao:
      'Nossa assinatura da casa: frango, bacon, milho, mussarela e catupiry em um recheio robusto e cremoso. A pedida certa para quem quer surpreender no sabor.',
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
      'Chocolate cremoso com morangos frescos em uma combinação doce, intensa e equilibrada. Sobremesa em formato de pizza para fechar o pedido com chave de ouro.',
    tempoPreparoMin: 18,
    imagem: '/hero-pizza-duo-chocolate-morango.png',
    precos: { P: 38, M: 52, G: 64 },
    ingredientes: ['Morango fresco', 'Chocolate', 'Base doce da casa'],
  }),
  esfihaSabor({
    id: 'p7',
    slug: 'esfiha-carne',
    nome: 'Esfiha de Carne com Tomate e Cebola',
    descricao:
      'Carne moída bem temperada com tomate e cebola sobre massa macia e dourada no forno alto. Recheio suculento e sabor clássico de esfiha artesanal.',
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
    descricao:
      'Calabresa moída ao molho de tomate com tempero na medida certa. Sabor intenso, suculento e perfeito para quem gosta de um toque mais encorpado.',
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
    descricao:
      'Mussarela cremosa, dourada no ponto ideal, com massa leve e borda macia. Simples, delicada e irresistível em qualquer hora do dia.',
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
    descricao:
      'Frango desfiado temperado com catupiry cremoso em uma combinação equilibrada e muito saborosa. Textura macia e recheio farto.',
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
    descricao:
      'Chocolate cremoso com M&Ms coloridos em uma versão doce, divertida e surpreendente. Ideal para quem quer um final alegre e cheio de sabor.',
    tempoPreparoMin: 14,
    imagem: '/hero-esfiha-doce-chocolate-mms.png',
    imagemDestaque: '/hero-esfiha-doce-chocolate-mms.png',
    precos: { P: 15, M: 19, G: 25 },
    ingredientes: ['Creme de chocolate', 'M&Ms', 'massa doce'],
    alergenos: ['Contém glúten e lactose. Pode conter amendoim e oleaginosas.'],
  }),
  sobremesaSabor({
    id: 's1',
    slug: 'milky-acai',
    nome: 'Milky Açaí',
    descricao:
      'Camadas cremosas de açaí com leite condensado e leite em pó especial, servido bem gelado. Refrescante, aveludado e perfeito para adoçar sem pesar.',
    tempoPreparoMin: 8,
    imagem: '/hero-sobremesa-milky-acai.png',
    imagemDestaque: '/hero-sobremesa-milky-acai.png',
    precos: { P: 6.4, M: 32, G: 64 },
    ingredientes: ['Açaí', 'leite condensado', 'leite em pó especial'],
    alergenos: ['Contém lactose. Pode conter traços de oleaginosas.'],
  }),
  sobremesaSabor({
    id: 's2',
    slug: 'trufas-tiramisu',
    nome: 'Trufas de Tiramisu',
    descricao:
      'Trufas artesanais com cacau intenso e notas suaves de café no estilo tiramisu. Sobremesa sofisticada para quem gosta de sabor elegante.',
    tempoPreparoMin: 6,
    imagem: '/hero-sobremesa-trufas-tiramisu.png',
    imagemDestaque: '/hero-sobremesa-trufas-tiramisu.png',
    precos: { P: 6.4, M: 32, G: 64 },
    ingredientes: ['Cacau', 'creme tiramisu', 'café'],
    alergenos: ['Pode conter glúten, lactose e ovos.'],
  }),
  {
    id: 'c1',
    nome: 'Calzone presunto & mussarela',
    slug: 'calzone-presunto',
    categoria: 'calzones',
    descricao:
      'Meia-lua dourada no forno, recheada com presunto e mussarela em versão clássica e reconfortante. Casquinha leve por fora e muito recheio por dentro.',
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
    descricao:
      'Calabresa, cebola e mussarela em um calzone assado até ficar dourado e suculento. Sabor forte, massa macia e aquele toque irresistível de forno alto.',
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
