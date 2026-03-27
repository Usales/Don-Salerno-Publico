import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
      <h1>Página não encontrada</h1>
      <p>
        <Link to="/">Voltar ao início</Link>
      </p>
    </div>
  )
}
