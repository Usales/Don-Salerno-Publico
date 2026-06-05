import { useState, type FormEvent } from 'react'
import { useAuth } from '@/stores/useAuth'
import { useReviews } from '@/stores/useReviews'
import type { Avaliacao } from '@/types'

interface ProdutoReviewsProps {
  produtoId: string
  avaliacoes: Avaliacao[]
}

export function ProdutoReviews({ produtoId, avaliacoes }: ProdutoReviewsProps) {
  const usuario = useAuth((s) => s.usuario)
  const adicionarReview = useReviews((s) => s.adicionar)
  const editarReview = useReviews((s) => s.editar)
  const removerReview = useReviews((s) => s.remover)
  const jaAvaliou = useReviews((s) => s.jaAvaliou(produtoId, usuario?.id ?? ''))

  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [erroReview, setErroReview] = useState<string | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNota, setEditNota] = useState(5)
  const [editComentario, setEditComentario] = useState('')

  function enviarReview(e: FormEvent) {
    e.preventDefault()
    if (!usuario) return
    setErroReview(null)
    const resultado = adicionarReview({
      produtoId,
      usuarioId: usuario.id,
      nome: usuario.nome,
      nota,
      comentario: comentario.trim() || 'Sem comentário',
    })
    if (!resultado.ok) {
      setErroReview(resultado.erro ?? 'Erro ao publicar avaliação.')
      return
    }
    setComentario('')
    setNota(5)
  }

  function iniciarEdicao(r: Avaliacao) {
    setEditandoId(r.id)
    setEditNota(r.nota)
    setEditComentario(r.comentario)
  }

  function salvarEdicao() {
    if (!usuario || !editandoId) return
    editarReview(editandoId, usuario.id, editNota, editComentario)
    setEditandoId(null)
  }

  function confirmarRemocao(id: string) {
    if (!usuario) return
    if (window.confirm('Deseja remover esta avaliação?')) {
      removerReview(id, usuario.id)
    }
  }

  return (
    <section className="produto-reviews" aria-labelledby="reviews-titulo">
      <h2 id="reviews-titulo" className="processo__titulo">
        Avaliações
      </h2>
      {avaliacoes.length === 0 && <p>Nenhuma avaliação ainda. Seja o primeiro a nos avaliar!</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {avaliacoes.map((r) => (
          <li key={r.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            {editandoId === r.id ? (
              <div>
                <label htmlFor="edit-nota" style={{ display: 'block', fontWeight: 600 }}>Nota</label>
                <select id="edit-nota" value={editNota} onChange={(e) => setEditNota(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <label htmlFor="edit-com" style={{ display: 'block', fontWeight: 600, marginTop: 8 }}>Comentário</label>
                <textarea
                  id="edit-com"
                  value={editComentario}
                  onChange={(e) => setEditComentario(e.target.value)}
                  rows={3}
                  maxLength={500}
                  style={{ width: '100%', maxWidth: '100%' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="button" className="btn btn--primario" onClick={salvarEdicao}>Salvar</button>
                  <button type="button" className="btn btn--secundario" onClick={() => setEditandoId(null)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <strong>{r.nome}</strong> — {r.nota}/5
                <p style={{ margin: '0.35rem 0 0' }}>{r.comentario}</p>
                {usuario && usuario.id === r.usuarioId && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      className="btn btn--secundario"
                      style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                      onClick={() => iniciarEdicao(r)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--secundario"
                      style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                      onClick={() => confirmarRemocao(r.id)}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {usuario ? (
        jaAvaliou ? (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted, #666)' }}>
            Você já avaliou este produto.
          </p>
        ) : (
          <form onSubmit={enviarReview} style={{ marginTop: '1rem' }}>
            {erroReview && <p role="alert" style={{ color: 'var(--color-alergia-texto, red)' }}>{erroReview}</p>}
            <label htmlFor="nota" style={{ display: 'block', fontWeight: 600 }}>
              Nota
            </label>
            <select id="nota" value={nota} onChange={(e) => setNota(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <label htmlFor="com" style={{ display: 'block', fontWeight: 600, marginTop: 8 }}>
              Comentário
            </label>
            <textarea
              id="com"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              maxLength={500}
              style={{ width: '100%', maxWidth: '100%' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #666)' }}>
              {comentario.length}/500
            </p>
            <button type="submit" className="btn btn--secundario" style={{ marginTop: 8 }}>
              Publicar
            </button>
          </form>
        )
      ) : (
        <p style={{ marginTop: '1rem', color: 'var(--text-muted, #666)' }}>
          Faça login para avaliar este produto.
        </p>
      )}
    </section>
  )
}
