import { StatusItemPedido } from "../enums/status-item-pedido"
import { StatusPedido } from "../enums/status-pedido"

export type ItemPedidoDTO = {
  id: string
  idItemMenu: string
  nome: string
  quantidade: number
  precoUnitario: number
  status: StatusItemPedido
  observacao?: string
}

export type PedidoDTO = {
  id: string
  numeroMesa: string
  itens: ItemPedidoDTO[]
  status: StatusPedido
  criadoEm?: Date
  fechadoEm?: Date
}

export type NovoItemPedidoDTO = {
  idItemMenu: string
  quantidade: number
  observacao?: string
}

export type NovoPedidoDTO = {
  numeroMesa: string
  itens: NovoItemPedidoDTO[]
}

export type ItemPedidoAtualizadoDTO = {
  id: string
  // idPedido?: string
  quantidade?: number
  observacao?: string
  status?: StatusItemPedido
}

export type PedidoAtualizadoDTO = {
  id: string
  numeroMesa?: string
  status?: StatusPedido
  itensAdicionados?: NovoItemPedidoDTO[]
  itensRemovidos?: string[]
  itensAlterados?: ItemPedidoAtualizadoDTO[]
}
