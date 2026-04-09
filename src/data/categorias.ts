import type { Categoria } from '@/types'

export const rotulosCategoria: Record<Categoria, string> = {
  pizzas: 'Pizzas',
  esfihas: 'Esfihas',
  calzones: 'Calzones',
  combos: 'Combos',
  sobremesas: 'Sobremesas',
  bebidas: 'Bebidas',
}

export const categoriasOrdenadas: Categoria[] = [
  'pizzas',
  'esfihas',
  'calzones',
  'combos',
  'sobremesas',
  'bebidas',
]
