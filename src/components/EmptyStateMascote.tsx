import './EmptyStateMascote.css'

export const EMPTY_STATE_MASCOTE_SRC = '/empty-state-mascote.png'

type Props = {
  alt?: string
  className?: string
}

/** Ilustração do mascote para “nada aqui” (cardápio vazio, 404, carrinho, produto inexistente). */
export function EmptyStateMascote({ alt = 'Don Salerno — nada por aqui', className }: Props) {
  return (
    <img
      src={EMPTY_STATE_MASCOTE_SRC}
      alt={alt}
      className={className ?? 'empty-state-mascote'}
      width={320}
      height={320}
      decoding="async"
    />
  )
}
