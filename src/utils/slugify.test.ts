import { slugify } from './slugify'

describe('slugify', () => {
  it('remove acentos e normaliza espaços', () => {
    expect(slugify('Frango c/ Catupiry')).toBe('frango-c-catupiry')
    expect(slugify('Dois Queijos')).toBe('dois-queijos')
    expect(slugify('  Baiana  ')).toBe('baiana')
  })
})
