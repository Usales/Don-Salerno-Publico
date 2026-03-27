import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Erro desconhecido.' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Don Salerno]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container page-section">
          <h1 className="page-title">Não foi possível carregar esta página</h1>
          <p className="page-lead" style={{ color: 'var(--text-muted)' }}>
            {this.state.message}
          </p>
          <p>
            <button type="button" className="btn btn--primario" onClick={() => window.location.assign('/')}>
              Voltar ao início
            </button>
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
