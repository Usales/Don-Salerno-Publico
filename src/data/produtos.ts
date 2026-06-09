import type { Produto, TamanhoCodigo } from '@/types'

const massasPadrao: Produto['massas'] = [
  { id: 'italiana', nome: 'Massa italiana', descricao: 'Tradicional com fermentação lenta.', adicional: 0 },
  { id: 'integral', nome: 'Integral', descricao: 'Farinha integral.', adicional: 4.4 },
  { id: 'sem-gluten', nome: 'Sem glúten', descricao: 'Base dedicada; pode conter traços de glúten.', adicional: 13.3 },
]

const adicionaisPadrao: Produto['adicionais'] = []

const alergenoPizzaPadrao =
  'Contém glúten e lactose. Pode conter ovos e outros; informe restrições no pedido.'

/** Itens da lista interna a partir da linha do cardápio (separador: vírgula + espaço). */
function linhaCardapioParaItens(linha: string): string[] {
  return linha.split(', ').map((s) => s.trim()).filter(Boolean)
}

type FaixaPrecoCardapio = 'promo' | 'trad' | 'especial' | 'nobre' | 'doce'

/** Valor mínimo do pedido quando o carrinho contém esfihas. */
export const PEDIDO_MINIMO_ESFIHAS = 25

const PRECOS_ESFIHA: Record<TamanhoCodigo, number> = { P: 5, M: 5, G: 5 }

const precosPorFaixa: Record<FaixaPrecoCardapio, Record<TamanhoCodigo, number>> = {
  promo: { P: 59.9, M: 68.9, G: 79.9 },
  trad: { P: 59.9, M: 80, G: 79.9 },
  especial: { P: 59.9, M: 84.4, G: 79.9 },
  nobre: { P: 59.9, M: 91.1, G: 79.9 },
  doce: { P: 59.9, M: 84.4, G: 79.9 },
}

/** Califórnia: não repetir o nome do sabor na lista de ingredientes (pedido do cardápio). */
function pizzaSemPrefixoSaborNoIngrediente(nome: string, slug?: string): boolean {
  const n = nome.trim().toLowerCase().normalize('NFC')
  if (/^calif[oó]rnia$/.test(n)) return true
  if (slug?.toLowerCase() === 'california' || slug?.toLowerCase() === 'california-doce') return true
  return false
}

function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '')
}

const PALAVRAS_IGNORADAS_NO_NOME_PIZZA = new Set([
  'com',
  'e',
  'ao',
  'aos',
  'à',
  'a',
  'da',
  'de',
  'do',
  'das',
  'dos',
  'na',
  'no',
  'nas',
  'nos',
  'em',
  'um',
  'uma',
])

/**
 * Se a lista ainda não “cita” o sabor pelo nome, coloca o nome como primeiro item.
 * Evita duplicar quando o próprio nome já aparece (ex.: frango, pepperoni, quatro queijos).
 */
function ingredientesPizzaComSaborNoTopo(nome: string, slug: string | undefined, ingredientes: string[]): string[] {
  if (pizzaSemPrefixoSaborNoIngrediente(nome, slug)) return ingredientes

  const blob = stripDiacritics(ingredientes.join(' ').toLowerCase())
  const nomeNorm = stripDiacritics(nome.trim().toLowerCase())

  if (blob.includes(nomeNorm)) return ingredientes

  const tokens = nomeNorm
    .split(/[\s&/,-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !PALAVRAS_IGNORADAS_NO_NOME_PIZZA.has(t))

  if (tokens.length > 0 && tokens.every((t) => blob.includes(t))) {
    return ingredientes
  }

  return [nome.trim(), ...ingredientes]
}

function pizzaSabor(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'precos' | 'tempoPreparoMin'> & {
    ingredientes?: string[]
    ingredientesCardapio?: string
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  const card = o.ingredientesCardapio?.trim()
  const base = card ? linhaCardapioParaItens(card) : (o.ingredientes ?? [o.descricao])
  const ingredientes = card ? base : ingredientesPizzaComSaborNoTopo(o.nome, o.slug, base)
  return {
    ...o,
    categoria: 'pizzas',
    ingredientes,
    ingredientesCardapio: card ?? o.ingredientesCardapio,
    alergenos: o.alergenos ?? [alergenoPizzaPadrao],
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  }
}

function esfihaSabor(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'tempoPreparoMin'> & {
    precos?: Record<TamanhoCodigo, number>
    ingredientes?: string[]
    ingredientesCardapio?: string
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  return {
    ...o,
    categoria: 'esfihas',
    precos: o.precos ?? PRECOS_ESFIHA,
    ingredientes: o.ingredientes ?? [o.descricao],
    ingredientesCardapio: o.ingredientesCardapio,
    alergenos: o.alergenos ?? [alergenoPizzaPadrao],
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  }
}

/** Bebidas (garrafa / lata): sem massa nem adicionais de pizza; preço único em P no app. */
function bebidaItem(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'precos' | 'tempoPreparoMin'> & {
    imagem?: string
    ingredientes?: string[]
    ingredientesCardapio?: string
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  const unit = o.precos.P
  return {
    ...o,
    imagem: o.imagem ?? `/bebidas/${o.slug}.png`,
    categoria: 'bebidas',
    ingredientes: o.ingredientes ?? [o.descricao],
    ingredientesCardapio: o.ingredientesCardapio,
    alergenos: o.alergenos ?? ['Contém corantes. Pode conter derivados de soja.'],
    massas: [],
    adicionais: [],
    precos: { P: unit, M: unit, G: unit },
  }
}

/** IDs de pizzas tradicionais (promo + trad) para seleção em combos. */
const PIZZAS_TRAD_IDS = [
  'p11', 'p2', 'p4', 'p12', // salgadas
  'p20', 'p21', 'p22', 'p6', 'p23', 'p26', // salgadas
]

/** IDs de refrigerantes lata 350 ml para combos. */
const BEBIDAS_LATA_IDS = ['be-coca-lata', 'be-coca-zero-lata']

/** IDs de refrigerantes 2 L para combos. */
const BEBIDAS_2L_IDS = ['be-coca-2l', 'be-coca-zero-2l', 'be-guarana-2l', 'be-fanta-2l', 'be-sprite-2l']

export const produtos: Produto[] = [
  // Pizzas — ingredientes e faixas conforme docs/cardapio-pizzas-ingredientes.md
  pizzaSabor({
    id: 'p11',
    slug: 'baiana',
    nome: 'Baiana',
    descricao: 'Picância e sabor de pizzaria no estilo do cardápio.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-baiana.png',
    precos: precosPorFaixa.promo,
    ingredientesCardapio:
      'Molho, mussarela, calabresa, pimenta calabresa, pimenta de cheiro, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p2',
    slug: 'calabresa',
    nome: 'Calabresa',
    descricao: 'Clássica calabresa com cebola e orégano, como no cardápio.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-calabresa.png',
    precos: precosPorFaixa.promo,
    ingredientesCardapio: 'Molho, mussarela, calabresa, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p4',
    slug: 'dois-queijos',
    nome: 'Dois Queijos',
    descricao: 'Mussarela e catupiry em equilíbrio com molho e tomate.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-quatro-queijos.png',
    precos: precosPorFaixa.promo,
    ingredientesCardapio: 'Molho, mussarela, catupiry, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p12',
    slug: 'mussarela',
    nome: 'Mussarela',
    descricao: 'Simples e irresistível: molho, mussarela e tomate.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-mussarela.png',
    precos: precosPorFaixa.promo,
    ingredientesCardapio: 'Molho, mussarela, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p20',
    slug: 'bacon',
    nome: 'Bacon',
    descricao: 'Bacon crocante com cebola e mussarela.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-pepperoni.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, bacon, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p21',
    slug: 'francesa',
    nome: 'Francesa',
    descricao: 'Lombinho defumado com creme de leite e orégano.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-francesa.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, lombinho defumado, creme de leite, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p22',
    slug: 'frango',
    nome: 'Frango',
    descricao: 'Peito de frango desfiado com milho e cebola.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, peito de frango desfiado, milho, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p6',
    slug: 'frango-ao-catupiry',
    nome: 'Frango c/ Catupiry',
    descricao: 'Frango com catupiry cremoso, como no cardápio.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-catupiry.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, frango, catupiry, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p23',
    slug: 'frango-ao-cheddar',
    nome: 'Frango c/ Cheddar',
    descricao: 'Frango com cheddar derretido e orégano.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-ao-cheddar.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, frango, cheddar, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p26',
    slug: 'lombo',
    nome: 'Lombo',
    descricao: 'Lombo defumado com mussarela e tomate.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-francesa.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, lombo defumado, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p39',
    slug: 'chocolate-doce',
    nome: 'Chocolate c/ Creme de Leite',
    descricao: 'Chocolate com creme de leite.',
    tempoPreparoMin: 18,
    imagem: '/pizza-doce-chocolate.png',
    precos: precosPorFaixa.doce,
    ingredientesCardapio: 'Mussarela, chocolate e creme de leite',
  }),
  pizzaSabor({
    id: 'p40',
    slug: 'choconana',
    nome: 'Choconana',
    descricao: 'Banana com chocolate — doce do cardápio.',
    tempoPreparoMin: 18,
    imagem: '/pizza-doce-choconana.png',
    precos: precosPorFaixa.doce,
    ingredientesCardapio: 'Mussarela, banana e chocolate',
  }),
  pizzaSabor({
    id: 'p13',
    slug: 'brigadeiro',
    nome: 'Brigadeiro',
    descricao: 'Brigadeiro cremoso com granulado — doce do cardápio.',
    tempoPreparoMin: 18,
    imagem: '/pizza-doce-brigadeiro.png',
    precos: precosPorFaixa.doce,
    ingredientesCardapio: 'Mussarela, chocolate, leite condensado e granulado',
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
    ingredientes: ['Carne moída temperada', 'tomate', 'cebola', 'massa artesanal'],
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
    ingredientes: ['Creme de chocolate', 'M&Ms', 'massa doce'],
    alergenos: ['Contém glúten e lactose. Pode conter amendoim e oleaginosas.'],
  }),
  esfihaSabor({
    id: 'p41',
    slug: 'esfiha-sensacao',
    nome: 'Esfiha Sensação',
    descricao:
      'Chocolate cremoso com fatias de morango frescas. Perfeita pra sua garota — ou pra quem merece um mimo doce no fim do dia.',
    tempoPreparoMin: 14,
    imagem: '/hero-esfiha-sensacao.png',
    imagemDestaque: '/hero-esfiha-sensacao.png',
    ingredientes: ['Chocolate cremoso', 'morango fresco', 'massa doce'],
    alergenos: ['Contém glúten e lactose. Pode conter amendoim e oleaginosas.'],
  }),
  /* Gatorade — fotos reais enviadas (ordem: limão, laranja, uva, maracujá; morango & maracujá = última imagem) */
  bebidaItem({
    id: 'gt-limao',
    slug: 'gatorade-limao',
    nome: 'Gatorade Limão',
    descricao: 'Isotônico sabor limão. Reposição de sais e energia — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-limao.png',
    imagemDestaque: '/bebidas/gatorade-limao.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'gt-laranja',
    slug: 'gatorade-laranja',
    nome: 'Gatorade Laranja',
    descricao: 'Isotônico sabor laranja — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-laranja.png',
    imagemDestaque: '/bebidas/gatorade-laranja.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'gt-uva',
    slug: 'gatorade-uva',
    nome: 'Gatorade Uva',
    descricao: 'Isotônico sabor uva — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-uva.png',
    imagemDestaque: '/bebidas/gatorade-uva.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'gt-maracuja',
    slug: 'gatorade-maracuja',
    nome: 'Gatorade Maracujá',
    descricao: 'Isotônico sabor maracujá — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-maracuja.png',
    imagemDestaque: '/bebidas/gatorade-maracuja.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'gt-morango-maracuja',
    slug: 'gatorade-morango-maracuja',
    nome: 'Gatorade Morango & Maracujá',
    descricao: 'Isotônico sabor morango e maracujá — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-morango-maracuja.png',
    imagemDestaque: '/bebidas/gatorade-morango-maracuja.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'gt-berry-blue',
    slug: 'gatorade-berry-blue',
    nome: 'Gatorade Berry Blue',
    descricao: 'Isotônico sabor berry blue — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-berry-blue.png',
    imagemDestaque: '/bebidas/gatorade-berry-blue.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'gt-tangerina',
    slug: 'gatorade-tangerina',
    nome: 'Gatorade Tangerina',
    descricao: 'Isotônico sabor tangerina — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-tangerina.png',
    imagemDestaque: '/bebidas/gatorade-tangerina.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  /* Águas, refrigerantes e H2OH! — preços de referência; ajuste no balcão se necessário */
  bebidaItem({
    id: 'be-crystal-15l',
    slug: 'crystal-agua-mineral-15l',
    nome: 'Água Mineral Sem Gás Crystal — 1,5 L',
    descricao: 'Água mineral natural sem gás — garrafa 1,5 L.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/crystal-agua-15l.png',
    imagemDestaque: '/bebidas/crystal-agua-15l.png',
    precos: { P: 8.8, M: 8.8, G: 8.8 },
  }),
  bebidaItem({
    id: 'be-crystal-500',
    slug: 'crystal-agua-mineral-500ml',
    nome: 'Água Mineral Sem Gás Crystal — 500 ml',
    descricao: 'Água mineral natural sem gás — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/crystal-agua-500ml.png',
    imagemDestaque: '/bebidas/crystal-agua-500ml.png',
    precos: { P: 4.3, M: 4.3, G: 4.3 },
  }),
  bebidaItem({
    id: 'be-coca-600',
    slug: 'coca-cola-600ml',
    nome: 'Coca-Cola 600 ml',
    descricao: 'Refrigerante sabor original — garrafa PET 600 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-600ml.png',
    imagemDestaque: '/bebidas/coca-cola-600ml.png',
    precos: { P: 9.6, M: 9.6, G: 9.6 },
  }),
  bebidaItem({
    id: 'be-coca-zero-600',
    slug: 'coca-cola-zero-600ml',
    nome: 'Coca-Cola Zero 600 ml',
    descricao: 'Refrigerante cola sem açúcar — garrafa PET 600 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-zero-600ml.png',
    imagemDestaque: '/bebidas/coca-cola-zero-600ml.png',
    precos: { P: 9.6, M: 9.6, G: 9.6 },
  }),
  bebidaItem({
    id: 'be-coca-lata',
    slug: 'coca-cola-lata-350ml',
    nome: 'Coca-Cola Lata 350 ml',
    descricao: 'Refrigerante sabor original — lata 350 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-lata-350ml.png',
    imagemDestaque: '/bebidas/coca-cola-lata-350ml.png',
    precos: { P: 7.7, M: 7.7, G: 7.7 },
  }),
  bebidaItem({
    id: 'be-coca-zero-lata',
    slug: 'coca-cola-zero-lata-350ml',
    nome: 'Coca-Cola Zero Lata 350 ml',
    descricao: 'Refrigerante cola sem açúcar — lata 350 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-zero-lata-350ml.png',
    imagemDestaque: '/bebidas/coca-cola-zero-lata-350ml.png',
    precos: { P: 7.7, M: 7.7, G: 7.7 },
  }),
  bebidaItem({
    id: 'be-h2oh-limoneto',
    slug: 'h2oh-limoneto-500ml',
    nome: 'H2OH! Limoneto 500 ml',
    descricao: 'Bebida levemente gaseificada sabor limão — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/h2oh-limoneto-500ml.png',
    imagemDestaque: '/bebidas/h2oh-limoneto-500ml.png',
    precos: { P: 10, M: 10, G: 10 },
  }),
  /* Refrigerantes 2 L — usados nos combos (PNG em public/bebidas/) */
  bebidaItem({
    id: 'be-coca-2l',
    slug: 'coca-cola-2l',
    nome: 'Coca-Cola 2 L',
    descricao: 'Refrigerante sabor original — garrafa PET 2 L.',
    tempoPreparoMin: 2,
    precos: { P: 13, M: 13, G: 13 },
  }),
  bebidaItem({
    id: 'be-coca-zero-2l',
    slug: 'coca-cola-zero-2l',
    nome: 'Coca-Cola Zero 2 L',
    descricao: 'Refrigerante cola sem açúcar — garrafa PET 2 L.',
    tempoPreparoMin: 2,
    precos: { P: 13, M: 13, G: 13 },
  }),
  bebidaItem({
    id: 'be-guarana-2l',
    slug: 'refrigerante-mineiro-2l',
    nome: 'Refrigerante Mineiro 2 L',
    descricao: 'Guaraná Mineiro tradicional — garrafa PET 2 L.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/guarana-2l.png',
    imagemDestaque: '/bebidas/guarana-2l.png',
    precos: { P: 12, M: 12, G: 12 },
  }),
  bebidaItem({
    id: 'be-fanta-2l',
    slug: 'fanta-2l',
    nome: 'Fanta Laranja 2 L',
    descricao: 'Refrigerante Fanta sabor laranja — garrafa PET 2 L.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/fanta-2l.png',
    imagemDestaque: '/bebidas/fanta-2l.png',
    precos: { P: 13, M: 13, G: 13 },
  }),
  bebidaItem({
    id: 'be-sprite-2l',
    slug: 'sprite-2l',
    nome: 'Sprite 2 L',
    descricao: 'Refrigerante sabor limão — garrafa PET 2 L.',
    tempoPreparoMin: 2,
    precos: { P: 15.6, M: 15.6, G: 15.6 },
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
    precos: { P: 35.6, M: 42.2, G: 48.9 },
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
    precos: { P: 37.8, M: 44.4, G: 51.1 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  /* Calzones médios — cardápio físico (faixa R$ 69,90) */
  {
    id: 'c3',
    nome: 'Calzone Carne de Sol',
    slug: 'calzone-carne-de-sol',
    categoria: 'calzones',
    descricao:
      'Calzone médio com carne de sol e catupiry — casquinha dourada e recheio nobre no forno alto.',
    ingredientes: [
      'Molho',
      'mussarela',
      'carne de sol',
      'catupiry',
      'cebola',
      'tomate',
      'orégano',
    ],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 24,
    imagem: '/hero-calzone-carne-de-sol.png',
    imagemDestaque: '/hero-calzone-carne-de-sol.png',
    precos: { P: 77.7, M: 77.7, G: 77.7 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  {
    id: 'c4',
    nome: 'Calzone Frango com Catupiry',
    slug: 'calzone-frango-catupiry',
    categoria: 'calzones',
    descricao: 'Calzone médio com frango desfiado e catupiry cremoso — assado até ficar irresistível.',
    ingredientes: ['Molho', 'mussarela', 'frango', 'catupiry', 'tomate', 'orégano'],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 23,
    imagem: '/hero-calzone-frango-catupiry.png',
    imagemDestaque: '/hero-calzone-frango-catupiry.png',
    precos: { P: 77.7, M: 77.7, G: 77.7 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  {
    id: 'c5',
    nome: 'Calzone Moda',
    slug: 'calzone-moda',
    categoria: 'calzones',
    descricao:
      'Calzone médio à moda da casa — presunto, calabresa, palmito e ovo, com molho e mussarela.',
    ingredientes: [
      'Molho',
      'mussarela',
      'presunto',
      'calabresa',
      'palmito',
      'ovo',
      'cebola',
      'tomate',
      'orégano',
    ],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE E OVOS.'],
    tempoPreparoMin: 24,
    imagem: '/hero-calzone-moda.png',
    imagemDestaque: '/hero-calzone-moda.png',
    precos: { P: 77.7, M: 77.7, G: 77.7 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  {
    id: 'c6',
    nome: 'Calzone Quatro Queijos',
    slug: 'calzone-quatro-queijos',
    categoria: 'calzones',
    descricao: 'Calzone médio com mussarela, provolone, catupiry e cheddar — cremoso e bem recheado.',
    ingredientes: ['Molho', 'mussarela', 'provolone', 'catupiry', 'cheddar', 'tomate', 'orégano'],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 23,
    imagem: '/hero-calzone-quatro-queijos.png',
    imagemDestaque: '/hero-calzone-quatro-queijos.png',
    precos: { P: 77.7, M: 77.7, G: 77.7 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  {
    id: 'c7',
    nome: 'Calzone Vegetariana',
    slug: 'calzone-vegetariana',
    categoria: 'calzones',
    descricao:
      'Calzone médio vegetariano — palmito, ervilha, milho e manjericão, com molho e mussarela.',
    ingredientes: [
      'Molho',
      'mussarela',
      'palmito',
      'ervilha',
      'milho',
      'manjericão',
      'cebola',
      'tomate',
      'orégano',
    ],
    alergenos: ['CONTÉM TRIGO E DERIVADOS DO LEITE.'],
    tempoPreparoMin: 23,
    imagem: '/hero-calzone-vegetariana.png',
    imagemDestaque: '/hero-calzone-vegetariana.png',
    precos: { P: 77.7, M: 77.7, G: 77.7 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
  // ────────────────────────────────────────────────────────────
  // COMBOS
  // ────────────────────────────────────────────────────────────
  {
    id: 'cb1',
    nome: 'Combo Individual',
    slug: 'combo-individual',
    categoria: 'combos',
    descricao: '1 Pizza 25cm (qualquer sabor tradicional) + 1 Refrigerante Lata 350ml.',
    ingredientes: ['Pizza 25cm (sabor tradicional)', 'Refrigerante Lata 350ml'],
    alergenos: ['Contém glúten e lactose.'],
    tempoPreparoMin: 18,
    imagem: '/combos/combo-individual.png',
    imagemDestaque: '/combos/combo-individual.png',
    precos: { P: 69.9, M: 69.9, G: 69.9 },
    massas: [],
    adicionais: [],
    comboItens: [
      { id: 'pizza1', titulo: 'Pizza 25cm', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'bebida1', titulo: 'Refrigerante Lata 350ml', quantidade: 1, opcoesIds: BEBIDAS_LATA_IDS },
    ],
  },
  {
    id: 'cb2',
    nome: 'Combo Casal',
    slug: 'combo-casal',
    categoria: 'combos',
    descricao: '1 Pizza 35cm (qualquer sabor tradicional) + 1 Refrigerante 2L.',
    ingredientes: ['Pizza 35cm (sabor tradicional)', 'Refrigerante 2L'],
    alergenos: ['Contém glúten e lactose.'],
    tempoPreparoMin: 22,
    imagem: '/combos/combo-casal.png',
    imagemDestaque: '/combos/combo-casal.png',
    precos: { P: 97.7, M: 97.7, G: 97.7 },
    massas: [],
    adicionais: [],
    comboItens: [
      { id: 'pizza1', titulo: 'Pizza 35cm', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'bebida1', titulo: 'Refrigerante 2L', quantidade: 1, opcoesIds: BEBIDAS_2L_IDS },
    ],
  },
  {
    id: 'cb3',
    nome: 'Combo Dupla',
    slug: 'combo-dupla',
    categoria: 'combos',
    descricao: '2 Pizzas 25cm (sabores tradicionais) + 1 Refrigerante 2L.',
    ingredientes: ['2 Pizzas 25cm (sabores tradicionais)', 'Refrigerante 2L'],
    alergenos: ['Contém glúten e lactose.'],
    tempoPreparoMin: 25,
    imagem: '/combos/combo-dupla.png',
    precos: { P: 138.8, M: 138.8, G: 138.8 },
    massas: [],
    adicionais: [],
    comboItens: [
      { id: 'pizza1', titulo: 'Pizza 25cm (1ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'pizza2', titulo: 'Pizza 25cm (2ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'bebida1', titulo: 'Refrigerante 2L', quantidade: 1, opcoesIds: BEBIDAS_2L_IDS },
    ],
  },
  {
    id: 'cb4',
    nome: 'Combo Premium',
    slug: 'combo-premium',
    categoria: 'combos',
    descricao: '1 Pizza 35cm (sabor tradicional) + 1 Pizza 25cm (sabor tradicional) + 1 Refrigerante 2L.',
    ingredientes: ['Pizza 35cm (sabor tradicional)', 'Pizza 25cm (sabor tradicional)', 'Refrigerante 2L'],
    alergenos: ['Contém glúten e lactose.'],
    tempoPreparoMin: 28,
    imagem: '/combos/combo-premium.png',
    imagemDestaque: '/combos/combo-premium.png',
    precos: { P: 161, M: 161, G: 161 },
    massas: [],
    adicionais: [],
    comboItens: [
      { id: 'pizza1', titulo: 'Pizza 35cm', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'pizza2', titulo: 'Pizza 25cm', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'bebida1', titulo: 'Refrigerante 2L', quantidade: 1, opcoesIds: BEBIDAS_2L_IDS },
    ],
  },
  {
    id: 'cb5',
    nome: 'Combo Família',
    slug: 'combo-familia',
    categoria: 'combos',
    descricao: '2 Pizzas 35cm (sabores tradicionais) + 1 Refrigerante 2L.',
    ingredientes: ['2 Pizzas 35cm (sabores tradicionais)', 'Refrigerante 2L'],
    alergenos: ['Contém glúten e lactose.'],
    tempoPreparoMin: 30,
    imagem: '/combos/combo-familia.png',
    imagemDestaque: '/combos/combo-familia.png',
    precos: { P: 177.6, M: 177.6, G: 177.6 },
    massas: [],
    adicionais: [],
    comboItens: [
      { id: 'pizza1', titulo: 'Pizza 35cm (1ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'pizza2', titulo: 'Pizza 35cm (2ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'bebida1', titulo: 'Refrigerante 2L', quantidade: 1, opcoesIds: BEBIDAS_2L_IDS },
    ],
  },
  {
    id: 'cb6',
    nome: 'Combo Festa',
    slug: 'combo-festa',
    categoria: 'combos',
    descricao: '3 Pizzas 35cm (sabores tradicionais) + 2 Refrigerantes 2L.',
    ingredientes: ['3 Pizzas 35cm (sabores tradicionais)', '2 Refrigerantes 2L'],
    alergenos: ['Contém glúten e lactose.'],
    tempoPreparoMin: 38,
    imagem: '/combos/combo-festa.png',
    imagemDestaque: '/combos/combo-festa.png',
    precos: { P: 277.6, M: 277.6, G: 277.6 },
    massas: [],
    adicionais: [],
    comboItens: [
      { id: 'pizza1', titulo: 'Pizza 35cm (1ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'pizza2', titulo: 'Pizza 35cm (2ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'pizza3', titulo: 'Pizza 35cm (3ª)', quantidade: 1, opcoesIds: PIZZAS_TRAD_IDS },
      { id: 'bebida1', titulo: 'Refrigerante 2L (1º)', quantidade: 1, opcoesIds: BEBIDAS_2L_IDS },
      { id: 'bebida2', titulo: 'Refrigerante 2L (2º)', quantidade: 1, opcoesIds: BEBIDAS_2L_IDS },
    ],
  },
]

/** Slugs antigos (receitas de massa / molho) → id de produto atual. */
const slugLegadoParaId: Record<string, string> = {
  'dom-camilo': 'p2',
  margherita: 'p12',
  calabresa: 'p2',
  'esfiha-carne': 'p7',
  'massa-napoletana': 'p12',
  'massa-romana-al-teglia': 'p12',
  'massa-new-york': 'p4',
  'massa-chicago-deep-dish': 'p4',
  'massa-detroit': 'p6',
  'massa-siciliana': 'p2',
  'molho-caseiro': 'p12',
  'romeu-e-julieta': 'p40',
  'm-m': 'p40',
  'frango-catupiry': 'p6',
  'frango-com-catupiry': 'p6',
  'carne-seca-cream-cheese': 'p2',
  'moda-da-casa': 'p2',
  pepperoni: 'p2',
  presunto: 'p12',
  'frango-ao-creme': 'p6',
  'frango-com-bacon': 'p22',
  napolitana: 'p2',
  portuguesa: 'p12',
  primavera: 'p2',
  'calabresa-com-bacon': 'p2',
  'calabresa-com-catupiry': 'p2',
  'dom-salerno': 'p2',
  'frango-com-palmito': 'p6',
  'quatro-queijos': 'p4',
  vegetariana: 'p12',
  'carne-de-sol': 'p2',
  'banana-doce': 'p40',
  'chocolate-com-morango': 'p39',
  p1: 'p12',
  p3: 'p12',
  p5: 'p4',
  p8: 'p2',
  p9: 'p12',
  p10: 'p2',
  brigadeiro: 'p13',
  'pizza-brigadeiro': 'p13',
  p18: 'p12',
  p24: 'p6',
  p25: 'p22',
  p28: 'p2',
  p30: 'p2',
  p31: 'p2',
  p32: 'p2',
  p33: 'p2',
  p34: 'p6',
  p38: 'p40',
  'calabresa-com-banana': 'p2',
  p27: 'p26',
  'lombo-com-catupiry': 'p26',
  p14: 'p7',
  'esfiha-calabresa-moida': 'p7',
  p19: 'p2',
  atum: 'p2',
  p36: 'p2',
  chilena: 'p2',
  p37: 'p2',
  p35: 'p2',
  'tomate-seco': 'p2',
  p29: 'p2',
  brocolis: 'p2',
  'dom-pedrito': 'p2',
  'guarana-2l': 'be-guarana-2l',
  /* Bebidas Gatorade removidas do cardápio — links antigos caem no Limão */
  'gt-tropical': 'gt-limao',
  'gt-melancia': 'gt-limao',
  'gt-morango': 'gt-limao',
  'gt-citrus': 'gt-limao',
  'gt-melancia-morango': 'gt-limao',
  'gt-zero-limao': 'gt-limao',
  'gt-zero-laranja': 'gt-limao',
  'gt-zero-uva': 'gt-limao',
  'gt-zero-tropical': 'gt-limao',
  'gatorade-tropical': 'gt-limao',
  'gatorade-melancia': 'gt-limao',
  'gatorade-morango': 'gt-limao',
  'gatorade-citrus': 'gt-limao',
  'gatorade-melancia-morango': 'gt-limao',
  'gatorade-zero-limao': 'gt-limao',
  'gatorade-zero-laranja': 'gt-limao',
  'gatorade-zero-uva': 'gt-limao',
  'gatorade-zero-tropical': 'gt-limao',
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
