import { processoFabricacao } from '@/data/processoFabricacao'
import type { Categoria } from '@/types'
import { IngredientIcon, type IconeIngrediente } from './IngredientIcon'

const mapCategoria: Record<Categoria, keyof typeof processoFabricacao> = {
  pizzas: 'pizzas',
  esfihas: 'esfihas',
  sobremesas: 'sobremesas',
  bebidas: 'bebidas',
}

export function ProcessSteps({ categoria }: { categoria: Categoria }) {
  const passos = processoFabricacao[mapCategoria[categoria]] ?? []
  return (
    <section className="processo" aria-labelledby="processo-titulo">
      <h2 id="processo-titulo" className="processo__titulo">
        Como preparamos
      </h2>
      <ol className="processo__lista">
        {passos.map((p) => (
          <li key={p.passo} className="processo__item">
            <div className="processo__icone" aria-hidden>
              <IngredientIcon tipo={p.icone as IconeIngrediente} label={p.titulo} />
            </div>
            <div>
              <span className="processo__passo">Passo {p.passo}</span>
              <h3 className="processo__sub">{p.titulo}</h3>
              <p className="processo__txt">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
