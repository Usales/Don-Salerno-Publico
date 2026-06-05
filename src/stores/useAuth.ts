import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario } from '@/types'

interface AuthState {
  usuario: Usuario | null
  token: string | null
  login: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>
  registrar: (d: Omit<Usuario, 'id'> & { senha: string }) => Promise<{ ok: boolean; erro?: string }>
  logout: () => void
  atualizarPerfil: (p: Partial<Usuario>) => void
}

function novoId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `u-${Date.now()}`
}

/** Gera salt aleatório em hex. */
function gerarSalt(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Hash SHA-256 com salt — seguro para uso em client-side MVP. */
async function hashSenha(senha: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + senha)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** MVP: autenticação simulada em localStorage (sem backend real). */
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,

      login: async (email, senha) => {
        const raw = localStorage.getItem('don-salerno-users')
        const map = raw ? (JSON.parse(raw) as Record<string, { hash: string; salt: string; usuario: Usuario }>) : {}
        const entry = map[email.toLowerCase()]
        if (!entry) return { ok: false, erro: 'E-mail ou senha incorretos.' }
        const hashVerificado = await hashSenha(senha, entry.salt)
        if (hashVerificado !== entry.hash) {
          return { ok: false, erro: 'E-mail ou senha incorretos.' }
        }
        const token = `mock.${btoa(email)}.${Date.now()}`
        set({ usuario: entry.usuario, token })
        return { ok: true }
      },

      registrar: async (d) => {
        const email = d.email.toLowerCase()
        const raw = localStorage.getItem('don-salerno-users')
        const map = raw ? (JSON.parse(raw) as Record<string, { hash: string; salt: string; usuario: Usuario }>) : {}
        if (map[email]) return { ok: false, erro: 'E-mail já cadastrado.' }
        const usuario: Usuario = {
          id: novoId(),
          nome: d.nome,
          email,
          telefone: d.telefone,
          endereco: d.endereco,
        }
        const salt = gerarSalt()
        const hash = await hashSenha(d.senha, salt)
        map[email] = { hash, salt, usuario }
        localStorage.setItem('don-salerno-users', JSON.stringify(map))
        const token = `mock.${btoa(email)}.${Date.now()}`
        set({ usuario, token })
        return { ok: true }
      },

      logout: () => set({ usuario: null, token: null }),

      atualizarPerfil: (p) => {
        const u = get().usuario
        if (!u) return
        const atualizado = { ...u, ...p }
        set({ usuario: atualizado })
        const raw = localStorage.getItem('don-salerno-users')
        const map = raw ? (JSON.parse(raw) as Record<string, { hash: string; salt: string; usuario: Usuario }>) : {}
        const key = u.email.toLowerCase()
        if (map[key]) map[key] = { ...map[key], usuario: atualizado }
        localStorage.setItem('don-salerno-users', JSON.stringify(map))
      },
    }),
    {
      name: 'don-salerno-auth',
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) console.warn('[useAuth] Falha ao restaurar sessão do localStorage.')
        }
      },
    },
  ),
)
