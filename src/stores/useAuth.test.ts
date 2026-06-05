import { useAuth } from './useAuth'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill TextEncoder/TextDecoder para jsdom
Object.assign(globalThis, { TextEncoder, TextDecoder })

// Mock crypto.subtle para jsdom (não nativo)
const mockSubtle = {
  digest: jest.fn(async (_algo: string, data: ArrayBuffer) => {
    // Hash fakeiro determinístico baseado no conteúdo
    const bytes = new Uint8Array(data)
    const hash = new Uint8Array(32)
    for (let i = 0; i < bytes.length; i++) hash[i % 32] ^= bytes[i]
    return hash.buffer
  }),
}

Object.defineProperty(globalThis, 'crypto', {
  value: {
    subtle: mockSubtle,
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256)
      return arr
    },
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2, 8),
  },
})

beforeEach(() => {
  useAuth.setState({ usuario: null, token: null })
  localStorage.clear()
})

describe('useAuth', () => {
  it('registra um novo usuário', async () => {
    const r = await useAuth.getState().registrar({
      nome: 'João',
      email: 'joao@test.com',
      telefone: '62999999999',
      senha: 'senha123',
    })
    expect(r.ok).toBe(true)
    expect(useAuth.getState().usuario?.nome).toBe('João')
    expect(useAuth.getState().usuario?.email).toBe('joao@test.com')
    expect(useAuth.getState().token).toBeTruthy()
  })

  it('rejeita e-mail duplicado no registro', async () => {
    await useAuth.getState().registrar({
      nome: 'João',
      email: 'joao@test.com',
      telefone: '62999999999',
      senha: 'senha123',
    })
    const r = await useAuth.getState().registrar({
      nome: 'João2',
      email: 'joao@test.com',
      telefone: '62999999999',
      senha: 'outra',
    })
    expect(r.ok).toBe(false)
    expect(r.erro).toMatch(/já cadastrado/i)
  })

  it('faz login com credenciais corretas', async () => {
    await useAuth.getState().registrar({
      nome: 'Maria',
      email: 'maria@test.com',
      telefone: '62988888888',
      senha: '123456',
    })
    useAuth.setState({ usuario: null, token: null })

    const r = await useAuth.getState().login('maria@test.com', '123456')
    expect(r.ok).toBe(true)
    expect(useAuth.getState().usuario?.nome).toBe('Maria')
  })

  it('rejeita login com senha incorreta', async () => {
    await useAuth.getState().registrar({
      nome: 'Maria',
      email: 'maria@test.com',
      telefone: '62988888888',
      senha: '123456',
    })
    useAuth.setState({ usuario: null, token: null })

    const r = await useAuth.getState().login('maria@test.com', 'errada')
    expect(r.ok).toBe(false)
    expect(r.erro).toMatch(/incorretos/i)
  })

  it('rejeita login com e-mail inexistente', async () => {
    const r = await useAuth.getState().login('nobody@test.com', '123')
    expect(r.ok).toBe(false)
  })

  it('faz logout', async () => {
    await useAuth.getState().registrar({
      nome: 'Teste',
      email: 'teste@test.com',
      telefone: '111',
      senha: 'abc',
    })
    expect(useAuth.getState().usuario).toBeTruthy()
    useAuth.getState().logout()
    expect(useAuth.getState().usuario).toBeNull()
    expect(useAuth.getState().token).toBeNull()
  })

  it('atualiza perfil do usuário', async () => {
    await useAuth.getState().registrar({
      nome: 'Carlos',
      email: 'carlos@test.com',
      telefone: '111',
      senha: 'abc',
    })
    useAuth.getState().atualizarPerfil({ telefone: '222', endereco: 'Rua X' })
    expect(useAuth.getState().usuario?.telefone).toBe('222')
    expect(useAuth.getState().usuario?.endereco).toBe('Rua X')
  })

  it('normaliza e-mail para lowercase', async () => {
    await useAuth.getState().registrar({
      nome: 'User',
      email: 'USER@Test.COM',
      telefone: '111',
      senha: 'abc',
    })
    expect(useAuth.getState().usuario?.email).toBe('user@test.com')
  })
})
