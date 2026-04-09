export type Categoria = 'pizzas' | 'esfihas' | 'calzones' | 'combos' | 'sobremesas' | 'bebidas'

export type TamanhoCodigo = 'P' | 'M' | 'G'

/** Pizza inteira ou meio a meio (segundo sabor pode ser indicado nas observações). */
export type PartesPizza = 'inteira' | 'meio-meio'

/** Adicional escolhido no carrinho (snapshot de nome e preço). */
export interface CarrinhoAdicional {
  id: string
  nome: string
  preco: number
}

/** Outra metade da pizza em pedido meio a meio. */
export interface CarrinhoSegundoSabor {
  produtoId: string
  nome: string
}

export interface OpcaoMassa {
  id: string
  nome: string
  descricao: string
  adicional: number
}

export interface Adicional {
  id: string
  nome: string
  preco: number
}

/** Linha de ingrediente com medida. */
export interface IngredienteMedido {
  nome: string
  quantidade: string
}

export interface SecaoIngredientesMedidos {
  titulo: string
  itens: IngredienteMedido[]
}

/** Ficha técnica resumida (massa: farinha / hidratação; molho: tomate / acidez / textura). */
export interface ReceitaFichaTecnica {
  origem: string
  farinhaTipo?: string
  proteina?: string
  hidratacao?: string
  tomate?: string
  acidez?: string
  textura?: string
}

/** Conteúdo editorial “como criar a receita” (categoria massas e similares). */
export interface ReceitaDetalhe {
  /** Rótulos curtos ex.: Fermentação lenta, Azeite */
  topicos: string[]
  /** Texto introdutório da receita */
  resumo: string
  /** Sobrescreve o título da seção “Como criar a receita” (opcional). */
  tituloSecaoComo?: string
  fichaTecnica?: ReceitaFichaTecnica
  /** Medidas por seção (ex.: massa para 1 kg de farinha). */
  ingredientesPorSecao?: SecaoIngredientesMedidos[]
  etapas: { titulo: string; texto: string }[]
}

export interface Produto {
  id: string
  nome: string
  slug: string
  categoria: Categoria
  descricao: string
  /** Quando presente, a página prioriza “Como criar a receita” e os tópicos. */
  receita?: ReceitaDetalhe
  ingredientes: string[]
  /** Linha única estilo cardápio (ex.: “Molho, mussarela, … e orégano”). */
  ingredientesCardapio?: string
  /** Texto legal para exibição destacada */
  alergenos: string[]
  tempoPreparoMin: number
  imagem: string
  /** Foto alternativa para hero / marquee quando a página do produto usa `imagem` diferente. */
  imagemDestaque?: string
  /** Combos: pizza ao fundo + bebida em primeiro plano (cardápio e página do produto). */
  comboVisual?: { pizza: string; bebida: string }
  precos: Record<TamanhoCodigo, number>
  massas: OpcaoMassa[]
  adicionais: Adicional[]
}

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone: string
  endereco?: string
}

export interface Avaliacao {
  id: string
  produtoId: string
  usuarioId: string
  nome: string
  nota: number
  comentario: string
  data: string
}
