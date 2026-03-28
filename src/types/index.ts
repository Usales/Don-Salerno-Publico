export type Categoria = 'pizzas' | 'esfihas' | 'calzones' | 'sobremesas' | 'bebidas'

export type TamanhoCodigo = 'P' | 'M' | 'G'

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
  /** Texto legal para exibição destacada */
  alergenos: string[]
  tempoPreparoMin: number
  imagem: string
  /** Foto alternativa para hero / marquee quando a página do produto usa `imagem` diferente. */
  imagemDestaque?: string
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
