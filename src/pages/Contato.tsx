import { empresa } from '@/data/empresa'

/** Ponto de referência visível no Google Maps (mercado ao lado do qual ficamos). */
const PONTO_REFERENCIA_MAPA = 'Armazém Sales, Goiânia, GO, Brasil'

const MAPA_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(PONTO_REFERENCIA_MAPA)}&hl=pt&z=17&output=embed`
const MAPA_ABRIR_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PONTO_REFERENCIA_MAPA)}`
const MAPA_ENDERECO_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(empresa.endereco)}`

export function Contato() {
  return (
    <div className="page-section">
      <div className="container" style={{ paddingBottom: '2rem' }}>
        <h1>Contato</h1>
        <p>
          <strong>Endereço:</strong> {empresa.endereco}
        </p>
        <p>
          <strong>Referência:</strong> ficamos <strong>ao lado do Armazém Sales</strong> — mercado em Goiânia (GO). É o ponto mais fácil de achar no mapa.
        </p>
        <p>
          <strong>Telefone / WhatsApp:</strong>{' '}
          <a href={empresa.telefoneHref}>{empresa.telefoneLabel}</a>
        </p>
        <p>
          <strong>Horário:</strong> segunda a domingo, 17h às 23h
        </p>
        <h2>Mapa</h2>
        <p className="contato-map__lead">
          O mapa abaixo abre na região do <strong>Armazém Sales</strong>; nosso endereço fica ao lado dessa referência.
        </p>
        <div className="map-embed">
          <iframe
            title="Mapa: região do Armazém Sales, Goiânia — referência ao lado da Don Salerno"
            src={MAPA_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p className="contato-map__link-wrap">
          <a className="contato-map__link" href={MAPA_ABRIR_URL} target="_blank" rel="noopener noreferrer">
            Abrir Armazém Sales no Google Maps
          </a>
          <span className="contato-map__sep" aria-hidden>
            {' '}
            ·{' '}
          </span>
          <a className="contato-map__link contato-map__link--muted" href={MAPA_ENDERECO_URL} target="_blank" rel="noopener noreferrer">
            Abrir pelo endereço completo
          </a>
        </p>
      </div>
    </div>
  )
}
