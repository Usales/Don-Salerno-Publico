import { EmptyStateMascote } from '@/components/EmptyStateMascote'
import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="empty-state-page">
        <EmptyStateMascote alt="Página não encontrada" />
        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', margin: '0 0 0.75rem' }}>
          Página não encontrada
        </h1>
        <p>
          <Link to="/">Voltar ao início</Link>
        </p>
      </div>
    </div>
  )
}
