/** Ícones SVG 64×64 — animação CSS curta, loop suave. viewBox 0 0 64 64 */
import './IngredientIcon.css'

export type IconeIngrediente = 'massa' | 'tomate' | 'queijo' | 'forno' | 'servir'

const base = {
  width: 64,
  height: 64,
  viewBox: '0 0 64 64',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IngredientIcon({ tipo, label }: { tipo: IconeIngrediente; label: string }) {
  return (
    <span className={`ing-icon ing-icon--${tipo}`} role="img" aria-label={label}>
      {tipo === 'massa' && (
        <svg {...base} className="ing-icon__svg">
          <circle className="ing-icon__ball" cx="32" cy="36" r="14" />
          <path className="ing-icon__stretch" d="M18 36h28" opacity="0.5" />
        </svg>
      )}
      {tipo === 'tomate' && (
        <svg {...base} className="ing-icon__svg">
          <circle className="ing-icon__tomate" cx="32" cy="34" r="12" />
          <path d="M32 14v8" />
        </svg>
      )}
      {tipo === 'queijo' && (
        <svg {...base} className="ing-icon__svg">
          <path className="ing-icon__drip" d="M24 20 L32 36 L40 20" />
          <path d="M28 36v8M36 36v8" />
        </svg>
      )}
      {tipo === 'forno' && (
        <svg {...base} className="ing-icon__svg">
          <rect x="14" y="18" width="36" height="34" rx="4" />
          <path className="ing-icon__flame" d="M26 28h4M32 26h4M38 28h4" />
        </svg>
      )}
      {tipo === 'servir' && (
        <svg {...base} className="ing-icon__svg">
          <path d="M18 40 L32 22 L46 40" />
          <path className="ing-icon__steam" d="M28 18v6M32 14v8M36 18v6" opacity="0.6" />
        </svg>
      )}
    </span>
  )
}
