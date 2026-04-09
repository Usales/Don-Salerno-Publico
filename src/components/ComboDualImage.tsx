import './ComboDualImage.css'

type Layout = 'card' | 'hero'

export function ComboDualImage({
  pizzaSrc,
  bebidaSrc,
  alt,
  layout,
}: {
  pizzaSrc: string
  bebidaSrc: string
  alt: string
  layout: Layout
}) {
  return (
    <div
      className={`combo-dual combo-dual--${layout}`}
      role="img"
      aria-label={`${alt}: pizza e bebida`}
    >
      <img className="combo-dual__pizza" src={pizzaSrc} alt="" decoding="async" loading={layout === 'hero' ? 'eager' : 'lazy'} />
      <img className="combo-dual__bebida" src={bebidaSrc} alt="" decoding="async" loading={layout === 'hero' ? 'eager' : 'lazy'} />
    </div>
  )
}
