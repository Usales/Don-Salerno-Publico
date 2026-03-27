import type { ReceitaDetalhe } from '@/types'

/** Dados de referência (base 1 kg de farinha salvo onde indicado). */
export type FichaMassa = {
  nome: string
  origem: string
  farinha: { tipo: string; proteina_percentual: string }
  hidratacao: string
  ingredientes: { item: string; quantidade: string }[]
  processo: Record<string, string>
  resumo: string
  topicos: string[]
  /** Título opcional da seção “Como criar a receita” na página do produto. */
  tituloSecaoComo?: string
}

const ORDEM_PROCESSO = [
  'preparacao',
  'mix_teglia',
  'mix_detroit',
  'descanso_dobras',
  'mistura',
  'sova_curta',
  'desenvolvimento',
  'sova',
  'puntata',
  'divisao',
  'staglio',
  'fermentacao_inicial',
  'fermentacao',
  'transferencia_forma',
  'maturacao',
  'aclimatacao',
  'teglia',
  'appretto',
  'prova_forma',
  'abertura_forma',
  'abertura',
  'formato',
  'montagem',
  'montagem_detroit',
  'recheio',
  'forno',
  'observacoes',
] as const

const TITULO_PROCESSO: Record<string, string> = {
  preparacao: 'Preparação',
  mix_teglia: 'Mistura (ponto crítico)',
  mix_detroit: 'Mistura (simples, mas correta)',
  descanso_dobras: 'Desenvolvimento (descanso + dobras leves)',
  mistura: 'Mistura',
  sova_curta: 'Sova (curta e controlada)',
  desenvolvimento: 'Desenvolvimento (dobras — substitui sova)',
  sova: 'Sova',
  puntata: 'Descanso inicial (puntata)',
  divisao: 'Divisão',
  staglio: 'Divisão e boleamento (staglio)',
  fermentacao_inicial: 'Fermentação inicial',
  fermentacao: 'Fermentação',
  transferencia_forma: 'Transferência para a forma (ponto crítico)',
  maturacao: 'Fermentação fria (maturação)',
  aclimatacao: 'Pré-uso (aclimatação)',
  teglia: 'Abertura na teglia',
  appretto: 'Fermentação final (appretto)',
  prova_forma: 'Fermentação final na forma',
  abertura_forma: 'Abertura e formato (crítico)',
  abertura: 'Abertura da massa',
  formato: 'Formato',
  montagem: 'Montagem (ordem correta — MUITA gente erra)',
  montagem_detroit: 'Montagem (característica Detroit)',
  recheio: 'Recheio',
  forno: 'Forno',
  observacoes: 'Observações críticas',
}

function processoParaEtapas(processo: Record<string, string>) {
  const etapas: { titulo: string; texto: string }[] = []
  const ordemSet = new Set<string>(ORDEM_PROCESSO)
  for (const chave of ORDEM_PROCESSO) {
    const texto = processo[chave]
    if (texto) {
      etapas.push({
        titulo: TITULO_PROCESSO[chave] ?? chave,
        texto,
      })
    }
  }
  for (const chave of Object.keys(processo)) {
    if (!ordemSet.has(chave)) {
      etapas.push({
        titulo: TITULO_PROCESSO[chave] ?? chave,
        texto: processo[chave],
      })
    }
  }
  return etapas
}

function fichaParaReceita(f: FichaMassa): ReceitaDetalhe {
  return {
    topicos: f.topicos,
    resumo: f.resumo,
    ...(f.tituloSecaoComo ? { tituloSecaoComo: f.tituloSecaoComo } : {}),
    fichaTecnica: {
      origem: f.origem,
      farinhaTipo: f.farinha.tipo,
      proteina: f.farinha.proteina_percentual,
      hidratacao: f.hidratacao,
    },
    ingredientesPorSecao: [
      {
        titulo: 'Massa (para 1 kg de farinha)',
        itens: f.ingredientes.map((i) => ({ nome: i.item, quantidade: i.quantidade })),
      },
    ],
    etapas: processoParaEtapas(f.processo),
  }
}

export const fichasMassas: FichaMassa[] = [
  {
    nome: 'Pizza Napolitana Clássica (AVPN fiel)',
    origem: 'Nápoles, Itália',
    farinha: { tipo: 'Farinha 00', proteina_percentual: '11,5% – 12,5%' },
    hidratacao: '58%',
    ingredientes: [
      { item: 'Farinha 00', quantidade: '1000 g' },
      { item: 'Água', quantidade: '580 g' },
      { item: 'Sal', quantidade: '28 g' },
      {
        item: 'Fermento fresco',
        quantidade: '1 g (ajustar conforme temperatura ambiente)',
      },
    ],
    processo: {
      preparacao:
        'Utilize água entre 18–22°C (ajuste conforme clima).\nAmbiente ideal: 20–25°C.\nSepare todos os ingredientes previamente pesados.',
      mistura:
        '1. Adicione toda a água em um recipiente.\n2. Dissolva completamente o sal.\n3. Incorpore cerca de 10% da farinha e misture até formar um líquido espesso.\n4. Adicione o fermento fresco e dissolva completamente.\n5. Incorpore o restante da farinha gradualmente.\n6. Misture até formar uma massa homogênea (sem farinha seca visível).',
      sova:
        'Sovar por 10–15 minutos.\nObjetivo: massa lisa, elástica e levemente pegajosa.\nTeste: esticar sem rasgar rapidamente (janela de glúten leve).',
      puntata:
        'Deixe a massa descansar em bloco por 2 horas em recipiente fechado.\nCobrir para evitar ressecamento.',
      staglio:
        '1. Divida em porções de 250 g.\n2. Boleie criando tensão superficial (movimento circular contra a bancada).\n3. Armazene em caixa fechada ou recipiente com tampa.',
      appretto:
        'Deixe as bolas fermentarem por 6–22 horas em temperatura ambiente.\n\nMassa pronta quando:\n• Aumenta de volume\n• Está macia ao toque\n• Retorna lentamente ao pressionar',
      abertura:
        'NÃO usar rolo.\nPressionar do centro para as bordas, preservando o ar no cornicione.\nDiâmetro final: 28–32 cm.',
      forno:
        'Temperatura: 450–480°C.\nTempo: 60–90 segundos.\nAssar diretamente na pedra ou piso do forno.',
      observacoes:
        'Ajustar fermento conforme temperatura:\n• 18°C → até 2 g\n• 25°C → ~1 g\n• 30°C → 0,5 g ou menos\n\nMassa muito fermentada: perde estrutura.\nMassa pouco fermentada: abre difícil e assa pesada.\nFarinha define o resultado final mais do que qualquer outro fator.',
    },
    resumo:
      'Ficha em escala de produção (1 kg de farinha 00): hidratação 58%, fermento fresco e fermentação tradicional em temperatura ambiente. Forno o mais quente possível; tempos típicos de forno à lenha.',
    topicos: [
      '58% hidratação',
      'Farinha 00',
      'Fermento fresco (baixo)',
      '8–24 h em temperatura ambiente',
      '450–480 °C',
    ],
  },
  {
    nome: 'Pizza Romana al Teglia (Alta hidratação)',
    origem: 'Roma, Itália',
    farinha: {
      tipo: 'Farinha tipo 0 forte (W300–330)',
      proteina_percentual: '13% – 14%',
    },
    hidratacao: '80%',
    tituloSecaoComo: 'Como criar a receita (nível profissional)',
    ingredientes: [
      { item: 'Farinha tipo 0 forte', quantidade: '1000 g' },
      { item: 'Água gelada', quantidade: '800 g' },
      { item: 'Sal', quantidade: '22 g' },
      {
        item: 'Fermento fresco',
        quantidade: '1–2 g (ajustar conforme tempo/temperatura)',
      },
      { item: 'Azeite', quantidade: '30 g' },
    ],
    processo: {
      preparacao:
        'Água bem fria: 4–8°C (controla fermentação).\nAmbiente ideal: até 25°C.\nMassa extremamente hidratada → espere textura pegajosa.',
      mix_teglia:
        'Coloque 90% da água no recipiente.\nAdicione toda a farinha.\nMisture até massa irregular (sem desenvolver demais).\nAdicione o fermento dissolvido no restante da água.\nIncorpore o sal.\nAdicione o azeite por último.\nMisture até massa homogênea.\n\n👉 Não buscar ponto perfeito aqui — o glúten vai desenvolver depois.',
      desenvolvimento:
        'Fazer 3 a 5 séries de dobras a cada 20–30 minutos.\nTécnica:\n• puxar e dobrar sobre si mesma\n• girar o recipiente\n\n👉 Isso cria estrutura sem rasgar a rede de glúten.',
      maturacao:
        'Levar para geladeira (4°C).\nTempo: 24–48 horas.\n\n👉 Aqui acontece:\n• desenvolvimento de sabor\n• digestibilidade\n• estrutura alveolada',
      aclimatacao:
        'Retirar da geladeira 2–3 horas antes do uso.\nMassa deve relaxar completamente.',
      teglia:
        'Untar generosamente a forma com azeite.\nTransferir a massa SEM desgaseificar.\nEspalhar suavemente com as mãos.\nSe retrair → aguarde 10–15 min e continue.\n\n👉 Nunca forçar — isso destrói os alvéolos.',
      prova_forma:
        'Descanso de 1–2 horas.\nMassa deve:\n• preencher a forma\n• apresentar bolhas visíveis',
      forno:
        'Temperatura: 250–280°C.\nTempo: 15–20 minutos.\n\n👉 Opcional profissional:\n• pré-assar base 5–8 min\n• adicionar cobertura depois\n• finalizar forno alto',
    },
    resumo:
      'Alta hidratação (80%) com farinha forte; mínima sova e desenvolvimento por dobras. Fermentação longa em frio com maturação controlada. Abertura diretamente na teglia bem untada.',
    topicos: [
      '80% hidratação',
      'Farinha forte (W300–330)',
      'Fermento fresco (baixo)',
      '24–48 h em frio',
      'Teglia (assadeira)',
      '250–280 °C',
    ],
  },
  {
    nome: 'Pizza New York Style',
    origem: 'Nova York, EUA',
    farinha: { tipo: 'Farinha de pão', proteina_percentual: '12–13%' },
    hidratacao: '65%',
    ingredientes: [
      { item: 'Farinha de pão', quantidade: '1000 g' },
      { item: 'Água', quantidade: '650 g' },
      { item: 'Sal', quantidade: '20 g' },
      { item: 'Açúcar', quantidade: '20 g' },
      { item: 'Fermento seco', quantidade: '3 g' },
      { item: 'Azeite', quantidade: '30 g' },
    ],
    processo: {
      mistura: 'Misturar tudo até formar massa.',
      sova: '8–10 minutos.',
      fermentacao: '24–72 h na geladeira.',
      divisao: 'Bolas de 300 g.',
      forno: '260 °C por 10–15 min.',
    },
    resumo:
      'Massa do estilo fatia grande: açúcar e azeite ajudam cor em forno doméstico; fermentação fria longa desenvolve sabor.',
    topicos: ['65% hidratação', 'Bread flour', '24–72 h frio', 'Bola 300 g', '260 °C'],
  },
  {
    nome: 'Pizza Chicago Deep Dish',
    origem: 'Chicago, EUA',
    farinha: {
      tipo: 'Farinha comum (ou blend com farinha de pão leve)',
      proteina_percentual: '11% – 12%',
    },
    hidratacao: '55–58%',
    tituloSecaoComo: 'Como criar a receita (nível profissional)',
    ingredientes: [
      { item: 'Farinha', quantidade: '1000 g' },
      { item: 'Água', quantidade: '550–580 g' },
      { item: 'Sal', quantidade: '20 g' },
      { item: 'Fermento seco', quantidade: '3–5 g' },
      { item: 'Óleo de milho', quantidade: '80–100 g' },
    ],
    processo: {
      preparacao:
        'Água: 20–25°C.\nAmbiente: 22–26°C.\nMassa deve ficar mais firme que napolitana.',
      mistura:
        'Misture água + fermento.\nAdicione farinha e comece a incorporar.\nAdicione o sal.\nIncorpore o óleo aos poucos no final.\nMisture até massa homogênea.\n\n👉 Aqui o óleo entra para “encurtar” o glúten → textura mais macia e menos elástica.',
      sova_curta:
        '5–8 minutos apenas.\nObjetivo:\n• massa lisa\n• NÃO muito elástica\n\n👉 Excesso de glúten = massa borrachuda (erro clássico).',
      fermentacao:
        '2–4 horas em temperatura ambiente.\nMassa deve crescer levemente, não dobrar.\n\n👉 Deep dish não depende de fermentação longa.',
      abertura_forma:
        'Untar generosamente a forma (óleo ou manteiga).\nAbrir a massa com rolo ou mãos.\nForrar fundo e laterais (subindo bem).\nEspessura: média (não fina como napolitana).\n\n👉 Borda alta é estrutural — segura o recheio.',
      montagem:
        'Ordem tradicional:\n\n• Queijo (direto na massa)\n• Recheios (opcional: linguiça, vegetais)\n• Molho de tomate por cima\n• Finalizar com parmesão\n\n👉 Isso evita que a massa queime antes do recheio cozinhar.',
      forno:
        'Temperatura: 230–240°C.\nTempo: 20–30 minutos.\n\n👉 Assar até:\n• borda dourada\n• fundo firme\n• topo levemente gratinado',
    },
    resumo:
      'Massa enriquecida com óleo, textura mais firme e levemente amanteigada. Fermentação curta, abertura direta na forma funda e montagem em camadas invertidas (queijo primeiro, molho por cima).',
    topicos: [
      '55–58% hidratação',
      'Óleo de milho (ou manteiga + óleo)',
      'Forma funda (deep dish)',
      '2–4 h em temperatura ambiente',
      '230–240 °C',
    ],
  },
  {
    nome: 'Pizza Detroit Style',
    origem: 'Detroit, EUA',
    farinha: { tipo: 'Farinha de pão', proteina_percentual: '12% – 13%' },
    hidratacao: '73%',
    tituloSecaoComo: 'Como criar a receita (nível profissional)',
    ingredientes: [
      { item: 'Farinha de pão', quantidade: '1000 g' },
      { item: 'Água', quantidade: '730 g' },
      { item: 'Sal', quantidade: '20 g' },
      { item: 'Fermento seco', quantidade: '3–5 g' },
      {
        item: 'Azeite (ou óleo)',
        quantidade: '30–50 g (para a forma e leve incorporação)',
      },
    ],
    processo: {
      preparacao:
        'Água: 20–25°C.\nAmbiente: 22–27°C.\nMassa será pegajosa — isso é correto.',
      mix_detroit:
        'Misture água + fermento.\nAdicione a farinha.\nMisture até não haver farinha seca.\nAdicione o sal.\nMisture até massa homogênea.\n\n👉 Não buscar ponto perfeito — sem sova pesada.',
      descanso_dobras:
        'Descansar 20 minutos.\nFazer 2–3 dobras leves (opcional, mas recomendado).\n\n👉 Isso melhora estrutura sem perder leveza.',
      fermentacao_inicial:
        '1,5–3 horas em temperatura ambiente.\nMassa deve crescer visivelmente e criar bolhas.',
      transferencia_forma:
        'Untar generosamente a forma com óleo.\nTransferir a massa com cuidado.\nEspalhar levemente (sem forçar).\n\n👉 Se a massa retrair → esperar 10–15 min e continuar.',
      prova_forma:
        '30–90 minutos.\nMassa deve:\n• preencher toda a forma\n• apresentar bolhas grandes',
      montagem_detroit:
        'Espalhar queijo (preferência: muçarela de baixa umidade).\nLevar o queijo até as bordas (isso cria a crosta caramelizada).\nAdicionar molho por cima em linhas (não misturar).\n\n👉 Ordem correta define o estilo.',
      forno:
        'Temperatura: 270–290°C.\nTempo: 12–15 minutos.\n\n👉 Resultado ideal:\n• bordas escuras e crocantes\n• fundo dourado\n• interior leve e aerado',
    },
    resumo:
      'Alta hidratação, massa leve e aerada, praticamente sem sova. Fermentação curta e crescimento direto na forma retangular bem untada. Característica principal: borda caramelizada com queijo até o limite.',
    topicos: [
      '73% hidratação',
      'Farinha de pão',
      'Fermento seco',
      '2–4 h em temperatura ambiente',
      'Forma retangular (steel pan)',
      '270–290 °C',
    ],
  },
  {
    nome: 'Pizza Siciliana (Focaccia Pizza)',
    origem: 'Sicília / EUA',
    farinha: { tipo: 'Farinha comum ou pão', proteina_percentual: '11–12%' },
    hidratacao: '70%',
    ingredientes: [
      { item: 'Farinha', quantidade: '1000 g' },
      { item: 'Água', quantidade: '700 g' },
      { item: 'Sal', quantidade: '20 g' },
      { item: 'Fermento seco', quantidade: '5 g' },
      { item: 'Azeite', quantidade: '80 g' },
    ],
    processo: {
      mistura: 'Mistura até homogêneo.',
      sova: 'Leve.',
      fermentacao: '2–24 h (conforme planejamento).',
      formato: 'Assadeira alta.',
      forno: '280 °C por 15–20 min.',
    },
    resumo:
      'Estilo bandeja com bastante azeite; fermentação flexível (2–24 h). Miolo alto e base crocante.',
    topicos: ['70% hidratação', 'Muito azeite', 'Assadeira alta', '280 °C'],
  },
  {
    nome: 'Massa Esfiha',
    origem: 'Receita de produção (esfiha)',
    farinha: { tipo: 'Farinha de trigo', proteina_percentual: '11–12%' },
    hidratacao: '~53%',
    ingredientes: [
      { item: 'Farinha de trigo', quantidade: '1000 g' },
      { item: 'Sal', quantidade: '10 g' },
      { item: 'Fermento biológico fresco', quantidade: '20 g (ou fermento seco 10 g)' },
      { item: 'Açúcar refinado', quantidade: '60 g' },
      { item: 'Água', quantidade: '530 g' },
    ],
    processo: {
      mistura:
        'Misturar todos os ingredientes secos (farinha, sal, açúcar e fermento). Em seguida incorporar os líquidos (água). Se a rotina da cozinha incluir óleo ou gordura de soja, incorporar nessa fase líquida e ajustar farinha ou água se necessário.',
      sova: 'Sovar até obter consistência semelhante à de massa de pão.',
      staglio:
        'Boleie cada esfiha com ~70 g por unidade (referência: cerca de 25 unidades para 1 kg de farinha).',
      fermentacao:
        'Após o boleamento: descanso de 40 minutos a 1 hora a ~22 °C, até o ponto de crescimento desejado. Não prolongar demais: fermentação excessiva pode gerar muito álcool e acidez láctica, deixando a esfiha amarga.',
      recheio:
        'Pegue uma unidade e abra com os polegares; use farinha de milho (fubá) na parte onde será recheada.\nRecheio de até 50 g por unidade.',
      forno: 'Assar ~2 minutos a 310–320 °C.',
    },
    resumo:
      'Massa para esfiha em escala de 1 kg de farinha: ~53% de hidratação, açúcar para alimentar o fermento, boleamento ~70 g (~25 unidades), fermentação curta à ~22 °C e forno bem quente (~2 min a 310–320 °C).',
    topicos: [
      '~53% hidratação',
      'Bolas ~70 g (~25 unidades)',
      'Fermento fresco 20 g ou seco 10 g',
      '40 min–1 h a ~22 °C',
      '~2 min · 310–320 °C',
      'Evitar fermentação longa demais',
    ],
  },
]

export function receitaMassaPorIndice(i: number): ReceitaDetalhe {
  const f = fichasMassas[i]
  if (!f) throw new Error(`Ficha massa ${i} não encontrada`)
  return fichaParaReceita(f)
}
