import type { Categoria } from '@/types'

export const rotulosCategoria: Record<Categoria, string> = {
  massas: 'Massas',
  molhos: 'Molhos',
  recheios: 'Recheios',
}

export const categoriasOrdenadas: Categoria[] = ['massas', 'molhos', 'recheios']
