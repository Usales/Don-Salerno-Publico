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

/** MVP: autenticação simulada em localStorage (sem backend real). */
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,

      login: async (email, senha) => {
        const raw = localStorage.getItem('don-salerno-users')
        const map = raw ? (JSON.parse(raw) as Record<string, { hash: string; usuario: Usuario }>) : {}
        const entry = map[email.toLowerCase()]
        if (!entry || entry.hash !== hashSimples(senha)) {
          return { ok: false, erro: 'E-mail ou senha incorretos.' }
        }
        const token = `mock.${btoa(email)}.${Date.now()}`
        set({ usuario: entry.usuario, token })
        return { ok: true }
      },

      registrar: async (d) => {
        const email = d.email.toLowerCase()
        const raw = localStorage.getItem('don-salerno-users')
        const map = raw ? (JSON.parse(raw) as Record<string, { hash: string; usuario: Usuario }>) : {}
        if (map[email]) return { ok: false, erro: 'E-mail já cadastrado.' }
        const usuario: Usuario = {
          id: novoId(),
          nome: d.nome,
          email,
          telefone: d.telefone,
          endereco: d.endereco,
        }
        map[email] = { hash: hashSimples(d.senha), usuario }
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
        const map = raw ? (JSON.parse(raw) as Record<string, { hash: string; usuario: Usuario }>) : {}
        const key = u.email.toLowerCase()
        if (map[key]) map[key] = { ...map[key], usuario: atualizado }
        localStorage.setItem('don-salerno-users', JSON.stringify(map))
      },
    }),
    { name: 'don-salerno-auth' },
  ),
)

function novoId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `u-${Date.now()}`
}

/** Não usar em produção — apenas demonstração local */
function hashSimples(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return String(h)
}
