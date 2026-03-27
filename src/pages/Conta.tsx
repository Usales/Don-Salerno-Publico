import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/stores/useAuth'

export function Conta() {
  const usuario = useAuth((s) => s.usuario)
  const login = useAuth((s) => s.login)
  const registrar = useAuth((s) => s.registrar)
  const logout = useAuth((s) => s.logout)
  const atualizarPerfil = useAuth((s) => s.atualizarPerfil)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    const r = await login(email, senha)
    if (!r.ok) setErro(r.erro ?? 'Erro')
  }

  async function handleReg(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    const r = await registrar({ nome, email, telefone, endereco, senha })
    if (!r.ok) setErro(r.erro ?? 'Erro')
  }

  useEffect(() => {
    if (usuario) {
      setTelefone(usuario.telefone)
      setEndereco(usuario.endereco ?? '')
    }
  }, [usuario])

  function salvar() {
    if (!usuario) return
    atualizarPerfil({
      telefone: telefone || usuario.telefone,
      endereco: endereco || usuario.endereco,
    })
  }

  if (!usuario) {
    return (
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: 480 }}>
        <h1 style={{ fontSize: '2rem' }}>Minha conta</h1>
        <div className="tabs" style={{ marginBottom: '1rem' }}>
          <button type="button" className={modo === 'login' ? 'is-active' : ''} onClick={() => setModo('login')}>
            Entrar
          </button>
          <button type="button" className={modo === 'cadastro' ? 'is-active' : ''} onClick={() => setModo('cadastro')}>
            Cadastro
          </button>
        </div>
        {erro && (
          <p role="alert" style={{ color: 'var(--color-alergia-texto)' }}>
            {erro}
          </p>
        )}
        {modo === 'login' ? (
          <form onSubmit={handleLogin}>
            <label htmlFor="em" style={{ display: 'block', fontWeight: 600 }}>
              E-mail
            </label>
            <input id="em" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label htmlFor="sn" style={{ display: 'block', fontWeight: 600 }}>
              Senha
            </label>
            <input id="sn" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" required aria-describedby="priv-dica" />
              <span id="priv-dica">Li e aceito a política de privacidade e o tratamento de dados (LGPD).</span>
            </label>
            <button type="submit" className="btn btn--primario">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleReg}>
            <label htmlFor="no" style={{ display: 'block', fontWeight: 600 }}>
              Nome
            </label>
            <input id="no" required value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label htmlFor="em2" style={{ display: 'block', fontWeight: 600 }}>
              E-mail
            </label>
            <input id="em2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label htmlFor="tel" style={{ display: 'block', fontWeight: 600 }}>
              Telefone
            </label>
            <input id="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label htmlFor="end" style={{ display: 'block', fontWeight: 600 }}>
              Endereço
            </label>
            <textarea id="end" value={endereco} onChange={(e) => setEndereco(e.target.value)} rows={2} style={{ width: '100%', marginBottom: 8 }} />
            <label htmlFor="sn2" style={{ display: 'block', fontWeight: 600 }}>
              Senha
            </label>
            <input id="sn2" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" required />
              <span>Consentimento para cadastro conforme LGPD.</span>
            </label>
            <button type="submit" className="btn btn--primario">
              Criar conta
            </button>
          </form>
        )}
        <p style={{ marginTop: '1rem' }}>
          <Link to="/privacidade">Política de privacidade</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '2rem' }}>Olá, {usuario.nome}</h1>
      <p>{usuario.email}</p>
      <section style={{ margin: '1.5rem 0' }}>
        <h2 className="processo__titulo" style={{ fontSize: '1.25rem' }}>
          Dados de contato
        </h2>
        <label htmlFor="tel2" style={{ display: 'block', fontWeight: 600 }}>
          Telefone
        </label>
        <input id="tel2" value={telefone || usuario.telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: '100%', padding: 8 }} />
        <label htmlFor="end2" style={{ display: 'block', fontWeight: 600, marginTop: 8 }}>
          Endereço
        </label>
        <textarea id="end2" value={endereco || usuario.endereco || ''} onChange={(e) => setEndereco(e.target.value)} rows={2} style={{ width: '100%' }} />
        <button type="button" className="btn btn--primario" style={{ marginTop: 8 }} onClick={salvar}>
          Salvar
        </button>
      </section>
      <button type="button" className="btn btn--secundario" style={{ marginTop: '1rem' }} onClick={logout}>
        Sair
      </button>
    </div>
  )
}
