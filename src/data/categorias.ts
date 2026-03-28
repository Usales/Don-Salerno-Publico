import type { Categoria } from '@/types'

export const rotulosCategoria: Record<Categoria, string> = {
  pizzas: 'Pizzas',
  esfihas: 'Esfihas',
  calzones: 'Calzones',
  sobremesas: 'Sobremesas',
  bebidas: 'Bebidas',
}

export const categoriasOrdenadas: Categoria[] = ['pizzas', 'esfihas', 'calzones', 'sobremesas', 'bebidas']
