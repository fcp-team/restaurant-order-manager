export type NovoPedidoItemPayload = {
  idItemMenu: string
  idMenu: string
  quantidade: number
  observacao?: string
}

export type NovoPedidoPayload = {
  numeroMesa: string
  itens: NovoPedidoItemPayload[]
}
