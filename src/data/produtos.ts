import type { Produto, TamanhoCodigo } from '@/types'

const massasPadrao: Produto['massas'] = [
  { id: 'italiana', nome: 'Massa italiana', descricao: 'Tradicional com fermentação lenta.', adicional: 0 },
  { id: 'integral', nome: 'Integral', descricao: 'Farinha integral.', adicional: 4 },
  { id: 'sem-gluten', nome: 'Sem glúten', descricao: 'Base dedicada; pode conter traços de glúten.', adicional: 12 },
]

const adicionaisPadrao: Produto['adicionais'] = []

const alergenoPizzaPadrao =
  'Contém glúten e lactose. Pode conter ovos e outros; informe restrições no pedido.'

/** Itens da lista interna a partir da linha do cardápio (separador: vírgula + espaço). */
function linhaCardapioParaItens(linha: string): string[] {
  return linha.split(', ').map((s) => s.trim()).filter(Boolean)
}

type FaixaPrecoCardapio = 'promo' | 'trad' | 'especial' | 'nobre' | 'doce'

const precosPorFaixa: Record<FaixaPrecoCardapio, Record<TamanhoCodigo, number>> = {
  promo: { P: 49.9, M: 62, G: 76 },
  trad: { P: 59.9, M: 72, G: 86 },
  especial: { P: 64.9, M: 76, G: 90 },
  nobre: { P: 69.9, M: 82, G: 96 },
  doce: { P: 64.9, M: 76, G: 90 },
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
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'precos' | 'tempoPreparoMin'> & {
    ingredientes?: string[]
    ingredientesCardapio?: string
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  return {
    ...o,
    categoria: 'esfihas',
    ingredientes: o.ingredientes ?? [o.descricao],
    ingredientesCardapio: o.ingredientesCardapio,
    alergenos: o.alergenos ?? [alergenoPizzaPadrao],
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  }
}

function sobremesaSabor(
  o: Pick<Produto, 'id' | 'slug' | 'nome' | 'descricao' | 'imagem' | 'precos' | 'tempoPreparoMin'> & {
    ingredientes?: string[]
    ingredientesCardapio?: string
    alergenos?: string[]
    imagemDestaque?: string
  },
): Produto {
  return {
    ...o,
    categoria: 'sobremesas',
    ingredientes: o.ingredientes ?? [o.descricao],
    ingredientesCardapio: o.ingredientesCardapio,
    alergenos: o.alergenos ?? ['Pode conter glúten, lactose e oleaginosas.'],
    massas: [],
    adicionais: [],
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
    id: 'p1',
    slug: 'margherita',
    nome: 'Marguerita',
    descricao: 'A clássica Marguerita do cardápio.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-margherita.png',
    imagemDestaque: '/hero-pizza-margherita-destaque.png',
    precos: precosPorFaixa.promo,
    ingredientesCardapio: 'Molho, mussarela, manjericão, catupiry, tomate e orégano',
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
    id: 'p18',
    slug: 'presunto',
    nome: 'Presunto',
    descricao: 'Tradicional presunto com mussarela e tomate.',
    tempoPreparoMin: 22,
    imagem: '/hero-pizza-portuguesa.png',
    precos: precosPorFaixa.promo,
    ingredientesCardapio: 'Molho, mussarela, presunto, tomate e orégano',
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
    nome: 'Frango ao Catupiry',
    descricao: 'Frango com catupiry cremoso, como no cardápio.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-catupiry.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, frango, catupiry, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p23',
    slug: 'frango-ao-cheddar',
    nome: 'Frango ao Cheddar',
    descricao: 'Frango com cheddar derretido e orégano.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-ao-cheddar.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, frango, cheddar, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p24',
    slug: 'frango-ao-creme',
    nome: 'Frango ao Creme',
    descricao: 'Frango com creme de leite, milho e cebola.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-catupiry.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, frango, creme de leite, milho, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p25',
    slug: 'frango-com-bacon',
    nome: 'Frango com bacon',
    descricao: 'Frango desfiado com bacon e cebola.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-catupiry.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, frango desfiado, bacon, cebola, tomate e orégano',
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
    id: 'p8',
    slug: 'napolitana',
    nome: 'Napolitana',
    descricao: 'Presunto, palmito e cebola no estilo tradicional do cardápio.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-napolitana.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, presunto, palmito, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p3',
    slug: 'portuguesa',
    nome: 'Portuguesa',
    descricao: 'Presunto, ovo, ervilha e cebola — a Portuguesa do cardápio.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-portuguesa.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, presunto, ervilha, ovo, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p28',
    slug: 'primavera',
    nome: 'Primavera',
    descricao: 'Calabresa ralada com catupiry e tomate.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-calabresa.png',
    precos: precosPorFaixa.trad,
    ingredientesCardapio: 'Molho, mussarela, calabresa ralada, catupiry, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p30',
    slug: 'calabresa-com-bacon',
    nome: 'Calabresa com Bacon',
    descricao: 'Calabresa e bacon com cebola e orégano.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-calabresa.png',
    precos: precosPorFaixa.especial,
    ingredientesCardapio: 'Molho, mussarela, calabresa, bacon, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p32',
    slug: 'calabresa-com-catupiry',
    nome: 'Calabresa com catupiry',
    descricao: 'Calabresa com catupiry, cebola e tomate.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-calabresa-com-catupiry.png',
    precos: precosPorFaixa.especial,
    ingredientesCardapio: 'Molho, mussarela, calabresa, catupiry, tomate e orégano, cebola',
  }),
  pizzaSabor({
    id: 'p33',
    slug: 'dom-salerno',
    nome: 'Dom Salerno',
    descricao: 'Presunto, calabresa e creme de leite no molho da casa.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-dom-salerno.png',
    precos: precosPorFaixa.especial,
    ingredientesCardapio: 'Molho, mussarela, presunto, calabresa, creme de leite, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p34',
    slug: 'frango-com-palmito',
    nome: 'Frango com Palmito',
    descricao: 'Frango com palmito e catupiry.',
    tempoPreparoMin: 24,
    imagem: '/hero-pizza-frango-com-palmito.png',
    precos: precosPorFaixa.especial,
    ingredientesCardapio: 'Molho, mussarela, frango, palmito, catupiry, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p5',
    slug: 'quatro-queijos',
    nome: 'Quatro Queijos',
    descricao: 'Mussarela, provolone, catupiry e cheddar com tomate.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-quatro-queijos.png',
    precos: precosPorFaixa.especial,
    ingredientesCardapio: 'Molho, mussarela, provolone, catupiry, cheddar, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p9',
    slug: 'vegetariana',
    nome: 'Vegetariana',
    descricao: 'Palmito, ervilha, milho e manjericão — vegetariana do cardápio.',
    tempoPreparoMin: 23,
    imagem: '/hero-pizza-vegetariana.png',
    precos: precosPorFaixa.especial,
    ingredientesCardapio:
      'Molho, mussarela, palmito, ervilha, milho, manjericão, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p10',
    slug: 'carne-de-sol',
    nome: 'Carne de Sol',
    descricao: 'Carne de sol com catupiry e cebola, faixa nobre do cardápio.',
    tempoPreparoMin: 25,
    imagem: '/hero-pizza-carne-seca-cream-cheese.png',
    precos: precosPorFaixa.nobre,
    ingredientesCardapio: 'Molho, mussarela, carne de sol, catupiry, cebola, tomate e orégano',
  }),
  pizzaSabor({
    id: 'p38',
    slug: 'banana-doce',
    nome: 'Banana',
    descricao: 'Doce de banana com açúcar e canela.',
    tempoPreparoMin: 18,
    imagem: '/pizza-doce-banana.png',
    precos: precosPorFaixa.doce,
    ingredientesCardapio: 'Mussarela, banana, açúcar e canela',
  }),
  pizzaSabor({
    id: 'p39',
    slug: 'chocolate-doce',
    nome: 'Chocolate',
    descricao: 'Chocolate com creme de leite.',
    tempoPreparoMin: 18,
    imagem: '/pizza-doce-chocolate.png',
    precos: precosPorFaixa.doce,
    ingredientesCardapio: 'Mussarela, chocolate e creme de leite',
  }),
  pizzaSabor({
    id: 'p13',
    slug: 'chocolate-com-morango',
    nome: 'Chocolate com Morango',
    descricao: 'Chocolate, morango e creme de leite.',
    tempoPreparoMin: 18,
    imagem: '/hero-pizza-duo-chocolate-morango.png',
    precos: precosPorFaixa.doce,
    ingredientesCardapio: 'Mussarela, chocolate, morango e creme de leite',
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
    ingredientes: ['Cacau', 'massa de biscoito champagne', 'café'],
    alergenos: ['Pode conter glúten, lactose e ovos.'],
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
    precos: { P: 8.9, M: 8.9, G: 8.9 },
  }),
  bebidaItem({
    id: 'gt-laranja',
    slug: 'gatorade-laranja',
    nome: 'Gatorade Laranja',
    descricao: 'Isotônico sabor laranja — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-laranja.png',
    imagemDestaque: '/bebidas/gatorade-laranja.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
  }),
  bebidaItem({
    id: 'gt-uva',
    slug: 'gatorade-uva',
    nome: 'Gatorade Uva',
    descricao: 'Isotônico sabor uva — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-uva.png',
    imagemDestaque: '/bebidas/gatorade-uva.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
  }),
  bebidaItem({
    id: 'gt-maracuja',
    slug: 'gatorade-maracuja',
    nome: 'Gatorade Maracujá',
    descricao: 'Isotônico sabor maracujá — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-maracuja.png',
    imagemDestaque: '/bebidas/gatorade-maracuja.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
  }),
  bebidaItem({
    id: 'gt-morango-maracuja',
    slug: 'gatorade-morango-maracuja',
    nome: 'Gatorade Morango & Maracujá',
    descricao: 'Isotônico sabor morango e maracujá — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-morango-maracuja.png',
    imagemDestaque: '/bebidas/gatorade-morango-maracuja.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
  }),
  bebidaItem({
    id: 'gt-berry-blue',
    slug: 'gatorade-berry-blue',
    nome: 'Gatorade Berry Blue',
    descricao: 'Isotônico sabor berry blue — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-berry-blue.png',
    imagemDestaque: '/bebidas/gatorade-berry-blue.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
  }),
  bebidaItem({
    id: 'gt-tangerina',
    slug: 'gatorade-tangerina',
    nome: 'Gatorade Tangerina',
    descricao: 'Isotônico sabor tangerina — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/gatorade-tangerina.png',
    imagemDestaque: '/bebidas/gatorade-tangerina.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
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
    precos: { P: 7.9, M: 7.9, G: 7.9 },
  }),
  bebidaItem({
    id: 'be-crystal-500',
    slug: 'crystal-agua-mineral-500ml',
    nome: 'Água Mineral Sem Gás Crystal — 500 ml',
    descricao: 'Água mineral natural sem gás — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/crystal-agua-500ml.png',
    imagemDestaque: '/bebidas/crystal-agua-500ml.png',
    precos: { P: 3.9, M: 3.9, G: 3.9 },
  }),
  bebidaItem({
    id: 'be-coca-600',
    slug: 'coca-cola-600ml',
    nome: 'Coca-Cola 600 ml',
    descricao: 'Refrigerante sabor original — garrafa PET 600 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-600ml.png',
    imagemDestaque: '/bebidas/coca-cola-600ml.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'be-coca-zero-600',
    slug: 'coca-cola-zero-600ml',
    nome: 'Coca-Cola Zero 600 ml',
    descricao: 'Refrigerante cola sem açúcar — garrafa PET 600 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-zero-600ml.png',
    imagemDestaque: '/bebidas/coca-cola-zero-600ml.png',
    precos: { P: 9.9, M: 9.9, G: 9.9 },
  }),
  bebidaItem({
    id: 'be-coca-lata',
    slug: 'coca-cola-lata-350ml',
    nome: 'Coca-Cola Lata 350 ml',
    descricao: 'Refrigerante sabor original — lata 350 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-lata-350ml.png',
    imagemDestaque: '/bebidas/coca-cola-lata-350ml.png',
    precos: { P: 6.9, M: 6.9, G: 6.9 },
  }),
  bebidaItem({
    id: 'be-coca-zero-lata',
    slug: 'coca-cola-zero-lata-350ml',
    nome: 'Coca-Cola Zero Lata 350 ml',
    descricao: 'Refrigerante cola sem açúcar — lata 350 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/coca-cola-zero-lata-350ml.png',
    imagemDestaque: '/bebidas/coca-cola-zero-lata-350ml.png',
    precos: { P: 6.9, M: 6.9, G: 6.9 },
  }),
  bebidaItem({
    id: 'be-h2oh-limoneto',
    slug: 'h2oh-limoneto-500ml',
    nome: 'H2OH! Limoneto 500 ml',
    descricao: 'Bebida levemente gaseificada sabor limão — garrafa 500 ml.',
    tempoPreparoMin: 2,
    imagem: '/bebidas/h2oh-limoneto-500ml.png',
    imagemDestaque: '/bebidas/h2oh-limoneto-500ml.png',
    precos: { P: 8.9, M: 8.9, G: 8.9 },
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
    precos: { P: 69.9, M: 69.9, G: 69.9 },
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
    precos: { P: 69.9, M: 69.9, G: 69.9 },
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
    precos: { P: 69.9, M: 69.9, G: 69.9 },
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
    precos: { P: 69.9, M: 69.9, G: 69.9 },
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
    precos: { P: 69.9, M: 69.9, G: 69.9 },
    massas: massasPadrao,
    adicionais: adicionaisPadrao,
  },
]

/** Slugs antigos (receitas de massa / molho) → id de produto atual. */
const slugLegadoParaId: Record<string, string> = {
  'dom-camilo': 'p33',
  margherita: 'p1',
  calabresa: 'p2',
  'esfiha-carne': 'p7',
  'massa-napoletana': 'p1',
  'massa-romana-al-teglia': 'p1',
  /** Antigo pepperoni (p4) — redireciona para pizza salgada genérica do cardápio */
  'massa-new-york': 'p5',
  'massa-chicago-deep-dish': 'p5',
  'massa-detroit': 'p6',
  /** Antiga moda da casa (ex-p12) */
  'massa-siciliana': 'p33',
  'molho-caseiro': 'p1',
  'romeu-e-julieta': 'p13',
  'm-m': 'p13',
  'frango-catupiry': 'p6',
  'frango-com-catupiry': 'p6',
  'carne-seca-cream-cheese': 'p10',
  'moda-da-casa': 'p33',
  pepperoni: 'p2',
  /* Pizzas removidas do cardápio */
  p31: 'p30',
  'calabresa-com-banana': 'p30',
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
