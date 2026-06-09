import type { Categoria } from '@/types'

export const rotulosCategoria: Record<Categoria, string> = {
  pizzas: 'Pizzas',
  esfihas: 'Esfihas',
  calzones: 'Calzones',
  combos: 'Combos',
  bebidas: 'Bebidas',
}

export const categoriasOrdenadas: Categoria[] = [
  'pizzas',
  'esfihas',
  'calzones',
  'combos',
  'bebidas',
]

/** Categorias ocultas nas abas do cardápio (produtos e imagens permanecem no catálogo). */
const CATEGORIAS_CARDAPIO_OCULTAS: Categoria[] = ['calzones']

export const categoriasCardapioVisiveis: Categoria[] = categoriasOrdenadas.filter(
  (c) => !CATEGORIAS_CARDAPIO_OCULTAS.includes(c),
)
