/** Conteúdo editorial — processo artesanal por categoria */

export const processoFabricacao = {
  pizzas: [
    { passo: 1, titulo: 'Massa', texto: 'Abrir e modelar a massa à mão até o diâmetro do tamanho escolhido.', icone: 'massa' as const },
    { passo: 2, titulo: 'Molho', texto: 'Espalhar molho de tomate artesanal com movimentos circulares.', icone: 'tomate' as const },
    { passo: 3, titulo: 'Cobertura', texto: 'Distribuir queijos e coberturas com equilíbrio.', icone: 'queijo' as const },
    { passo: 4, titulo: 'Forno', texto: 'Assar em forno alto até cor dourada e borda levemente inflada.', icone: 'forno' as const },
    { passo: 5, titulo: 'Servir', texto: 'Finalizar com azeite ou manjericão e servir quente.', icone: 'servir' as const },
  ],
  esfihas: [
    { passo: 1, titulo: 'Abrir massa', texto: 'Formar discos finos mantendo borda um pouco mais espessa.', icone: 'massa' as const },
    { passo: 2, titulo: 'Rechear', texto: 'Recheio temperado e encorpado, sem excesso de líquido.', icone: 'tomate' as const },
    { passo: 3, titulo: 'Formato', texto: 'Aberta ou fechada conforme receita; selagem firme se fechada.', icone: 'queijo' as const },
    { passo: 4, titulo: 'Assar', texto: 'Forno até dourar a base e o recheio borbulhar.', icone: 'forno' as const },
    { passo: 5, titulo: 'Entrega', texto: 'Embalar ou servir na mesa com limão se desejar.', icone: 'servir' as const },
  ],
  sobremesas: [
    { passo: 1, titulo: 'Preparação', texto: 'Ingredientes medidos e ambiente higienizado; refrigeração sob controle.', icone: 'queijo' as const },
    { passo: 2, titulo: 'Montagem', texto: 'Camadas e texturas conforme ficha técnica da receita.', icone: 'massa' as const },
    { passo: 3, titulo: 'Finalização', texto: 'Acabamento visual, conservação e apresentação no padrão Don Salerno.', icone: 'servir' as const },
  ],
  bebidas: [
    { passo: 1, titulo: 'Seleção', texto: 'Produtos conferidos, validade e integridade das embalagens.', icone: 'tomate' as const },
    { passo: 2, titulo: 'Resfriamento', texto: 'Cadeia de frio mantida até o atendimento ao cliente.', icone: 'queijo' as const },
    { passo: 3, titulo: 'Servir', texto: 'Copos e utensílios higienizados; bebida no ponto ideal de temperatura.', icone: 'servir' as const },
  ],
} as const
