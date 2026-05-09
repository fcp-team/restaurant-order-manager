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

export type NovoItemPedidoPayload = {
  idItemMenu: string
  idMenu: string
  quantidade: number
  observacao?: string
}

export type NovoPedidoPayload = {
  numeroMesa: string
  itens: NovoItemPedidoPayload[]
}
