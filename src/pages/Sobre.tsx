import { usePageTitle } from '@/hooks/usePageTitle'

export function Sobre() {
  usePageTitle('Sobre — Nossa História')
  return (
    <div className="page-section">
      <div className="container sobre-page" style={{ maxWidth: 720 }}>
        <h1>Sobre o Don Salerno</h1>
        <p>
          Somos uma pizzaria e esfiharia de Goiânia com raízes italianas e coração brasileiro. Aqui a receita não vem de
          manual corporativo — vem da cozinha, do forno e do cuidado com cada pedido.
        </p>
        <p>
          Nossa massa descansa por <strong>48 horas</strong>. Nosso molho é feito todo dia, com tomates selecionados.
          Não somos uma fábrica: somos uma cozinha que ama o que faz. Vem sentir o cheiro do forno a lenha.
        </p>
        <p>
          Cada pizza, esfiha e calzone é montado na hora, com ingredientes frescos e o padrão de sabor que você
          reconhece a cada visita. Informamos alérgenos com transparência, em conformidade com a legislação brasileira.
        </p>

        <h2>Nossa cozinha</h2>
        <p>
          Trabalhamos com processos abertos — da preparação à saída do forno — porque confiança se constrói vendo o
          trabalho acontecer.
        </p>
        <p>O que não abrimos mão:</p>
        <ul className="sobre-page__lista">
          <li>Massa fermentada com tempo, não com pressa</li>
          <li>Molho preparado diariamente</li>
          <li>Ingredientes selecionados e porções honestas</li>
          <li>Atendimento próximo, como em casa</li>
        </ul>
        <p>
          O resultado é simples: comida que aquece, cheiro de pizza no ar e a vontade de pedir de novo na semana que vem.
        </p>
      </div>
    </div>
  )
}
