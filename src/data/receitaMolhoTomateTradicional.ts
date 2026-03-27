import type { ReceitaDetalhe } from '@/types'

/** Receita editorial: molho cru / triturado para pizza (estilo tradicional). */
export const receitaMolhoTomateTradicional: ReceitaDetalhe = {
  topicos: [
    'Sem cozimento (ou cozimento leve opcional)',
    'Tomate pelado de qualidade',
    'Baixa hidratação (molho espesso)',
    'Uso direto na pizza',
  ],
  resumo:
    'Molho cru ou minimamente processado, focado no sabor natural do tomate. Baixa intervenção, sem cozimento prévio (no caso napolitano) ou cozimento leve (para estilos americanos).',
  tituloSecaoComo: 'Como criar a receita (nível profissional)',
  fichaTecnica: {
    origem: 'Itália',
    tomate: 'Tomate pelado (preferência: italiano tipo San Marzano ou similar)',
    acidez: 'pH ~4.2 – 4.5',
    textura: 'Rústica / levemente triturada (não líquida)',
  },
  ingredientesPorSecao: [
    {
      titulo: 'Molho base (para ~4–6 pizzas)',
      itens: [
        { nome: 'Tomate pelado', quantidade: '400 g' },
        { nome: 'Sal', quantidade: '5–7 g' },
        { nome: 'Azeite (opcional)', quantidade: '5–10 g' },
        { nome: 'Manjericão (opcional)', quantidade: '2–4 folhas' },
      ],
    },
  ],
  etapas: [
    {
      titulo: 'Seleção do tomate (fundamento do molho)',
      texto:
        'Usar tomate pelado inteiro (não usar extrato).\n\nPreferir:\n• baixo teor de água\n• sabor levemente doce\n• pouca acidez agressiva\n• Recomendado: comprar tomates italianos e misturá-los com uma lata de tomates inteiros em conserva; lavar bem, cortar em pedaços e cozinhar em panela elétrica com tampa, preservando aroma e sabor.\n\n👉 Matéria-prima ruim = molho ruim (não existe correção depois)',
    },
    {
      titulo: 'Preparação',
      texto:
        'Escorrer todo o líquido da lata para um recipiente (não descartar).\nO líquido da lata é o que dá sabor e pode ser utilizado para ir adicionando ao molho quando precisar de mais fluido — prefira-o em vez de água pura.',
    },
    {
      titulo: 'Trituração (ponto crítico)',
      texto:
        'Amassar com a mão ou colher de madeira OU\nPulsar rapidamente (NÃO liquidificar).\n\n👉 Objetivo:\n• Não se deve usar certos metais, especialmente alumínio e cobre, ao fazer molho de tomate devido à alta acidez do tomate, que provoca uma reação química corrosiva. Essa reação libera íons metálicos para o alimento, gerando riscos à saúde e alterando o sabor.\n• textura rústica\n• pedaços pequenos visíveis\n\n❌ Molho liso demais = perde identidade',
    },
    {
      titulo: 'Ajuste de sal',
      texto:
        'Adicionar 5–7 g de sal por 400 g.\nMisturar bem.\n\n👉 Não exagerar — o forno intensifica o sabor',
    },
    {
      titulo: 'Ajuste de textura',
      texto:
        'Muito grosso → adicionar um pouco do líquido reservado\nMuito líquido → escorrer mais\n\n👉 Molho ideal:\n• espalha fácil\n• NÃO escorre na massa',
    },
    {
      titulo: 'Aromatização (opcional e controlada)',
      texto:
        'Azeite: adiciona corpo e aroma\nManjericão: leve, sem excesso\nAlho: 1 dente a cada 400 g de molho\n\n👉 Nunca mascarar o tomate',
    },
    {
      titulo: 'Descanso (opcional, mas recomendado)',
      texto: '15–30 minutos antes de usar.\n\n👉 Isso estabiliza o sabor',
    },
    {
      titulo: 'Aplicação na pizza',
      texto:
        'Quantidade: 60–80 g por pizza (30 cm)\nEspalhar em movimento circular\nNÃO pressionar na massa',
    },
  ],
}
