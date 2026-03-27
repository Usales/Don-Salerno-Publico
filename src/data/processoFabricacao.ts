/** Conteúdo editorial — processo artesanal por categoria */

export const processoFabricacao = {
  massas: [
    { passo: 1, titulo: 'Massa', texto: 'Abrir e modelar a massa à mão até o diâmetro do tamanho escolhido.', icone: 'massa' as const },
    { passo: 2, titulo: 'Molho', texto: 'Espalhar molho de tomate artesanal com movimentos circulares.', icone: 'tomate' as const },
    { passo: 3, titulo: 'Cobertura', texto: 'Distribuir queijos e coberturas com equilíbrio.', icone: 'queijo' as const },
    { passo: 4, titulo: 'Forno', texto: 'Assar em forno alto até cor dourada e borda levemente inflada.', icone: 'forno' as const },
    { passo: 5, titulo: 'Servir', texto: 'Finalizar com azeite ou manjericão e servir quente.', icone: 'servir' as const },
  ],
  molhos: [
    { passo: 1, titulo: 'Abrir massa', texto: 'Formar discos finos mantendo borda um pouco mais espessa.', icone: 'massa' as const },
    { passo: 2, titulo: 'Rechear', texto: 'Recheio temperado e encorpado, sem excesso de líquido.', icone: 'tomate' as const },
    { passo: 3, titulo: 'Formato', texto: 'Aberta ou fechada conforme receita; selagem firme se fechada.', icone: 'queijo' as const },
    { passo: 4, titulo: 'Assar', texto: 'Forno até dourar a base e o recheio borbulhar.', icone: 'forno' as const },
    { passo: 5, titulo: 'Entrega', texto: 'Embalar ou servir na mesa com limão se desejar.', icone: 'servir' as const },
  ],
  recheios: [
    { passo: 1, titulo: 'Disco', texto: 'Abrir massa em disco fino com borda levemente mais alta.', icone: 'massa' as const },
    { passo: 2, titulo: 'Recheios', texto: 'Metade do disco com recheios equilibrados (não exagerar).', icone: 'queijo' as const },
    { passo: 3, titulo: 'Fechar', texto: 'Dobrar em meia-lua; selar borda com água ou pressão.', icone: 'tomate' as const },
    { passo: 4, titulo: 'Forno', texto: 'Furar o topo; assar até dourar e chiar por dentro.', icone: 'forno' as const },
    { passo: 5, titulo: 'Servir', texto: 'Cortar ao meio e servir quente.', icone: 'servir' as const },
  ],
} as const
