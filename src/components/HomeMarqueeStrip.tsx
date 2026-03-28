import './HomeMarqueeStrip.css'

/** Palavras da faixa (única) em estilo display. */
const TEXTO_DISPLAY = [
  'Pizza napolitana',
  'Esfiha aberta',
  'Calzone',
  'Forno alto',
  'Massa fresca',
  'Tradição italiana',
] as const

function renderChunk(items: readonly string[], className: string, keyPrefix: string) {
  return (
    <ul className={`home-marquee-strip__list ${className}`}>
      {items.map((text, i) => (
        <li key={`${keyPrefix}-${i}-${text}`} className="home-marquee-strip__item">
          <span className="home-marquee-strip__label">{text}</span>
        </li>
      ))}
    </ul>
  )
}

export function HomeMarqueeStrip() {
  return (
    <div className="home-marquee-strip" aria-label="Destaques do cardápio em texto">
      <div className="home-marquee-strip__row home-marquee-strip__row--display">
        <div className="home-marquee-strip__viewport">
          <div className="home-marquee-strip__track">
            <div className="home-marquee-strip__segment">
              {renderChunk(TEXTO_DISPLAY, 'home-marquee-strip__list--display', 'd-a')}
            </div>
            <div className="home-marquee-strip__segment" aria-hidden="true">
              {renderChunk(TEXTO_DISPLAY, 'home-marquee-strip__list--display', 'd-b')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
