import type { Categoria } from '@/types'

export const rotulosCategoria: Record<Categoria, string> = {
  pizzas: 'Pizzas',
  esfihas: 'Esfihas',
  sobremesas: 'Sobremesas',
  bebidas: 'Bebidas',
}

export const categoriasOrdenadas: Categoria[] = ['pizzas', 'esfihas', 'sobremesas', 'bebidas']
