import { IRepositorioPedido } from "../repositories/pedido.repositorio"

import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"

interface ServicoAutorizacao {
  autorizar(): boolean
}

export type NovoPedidoItemPayload = {
  idItemMenu: string
  quantidade: number
  observacao?: string
}

export type NovoPedidoPayload = {
  numeroMesa: number
  itens: NovoPedidoItemPayload[]
}

export default class ServicoPedido {
  constructor(
    private repositorio: IRepositorioPedido,
    // private autorizacao: ServicoAutorizacao
  ) { }

  async criarPedido(payload: NovoPedidoPayload): Promise<Pedido> {
    const { numeroMesa, itens } = payload

    if (!numeroMesa || numeroMesa <= 0) {
      throw new Error("Número de mesa inválido")
    }

    if (!itens) {
      throw new Error("O pedido deve conter itens válidos")
    }

    const result = await this.repositorio.criarPedido(payload)
    if (!result) throw new Error("Falha ao criar pedido no repositório")

    return result
  }

  async buscarPedido(id: string): Promise<Pedido> {
    const pedido = await this.repositorio.buscarPedido(id)
    if (!pedido) throw new Error("Pedido não encontrado")

    return pedido
  }

  async adicionarItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido> {
    if (quantidade <= 0) throw new Error("Quantidade inválida")
    const item = await this.repositorio.adicionarItem(idPedido, idItemMenu, quantidade)
    if (!item) throw new Error('Falha ao adicionar item')

    return item
  }

  async acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<ItemPedido> {
    if (quantidade <= 0) throw new Error("Quantidade inválida")
    const item = await this.repositorio.acrescentarItem(idPedido, idItem, quantidade)
    if (!item) throw new Error('Falha ao adicionar item')

    return item
  }

  async removerItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido> {
    const item = await this.repositorio.removerItem(idPedido, idItemMenu, quantidade)
    if (!item) throw new Error('Falha ao remover item')

    return item
  }

  async reduzirItem(idPedido: string, idItem: string, quantidade: number): Promise<ItemPedido> {
    if (quantidade <= 0) throw new Error("Quantidade inválida")
    const item = await this.repositorio.reduzirItem(idPedido, idItem, quantidade)
    if (!item) throw new Error('Falha ao adicionar item')

    return item
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const pedidos = await this.repositorio.listarPorStatus(status)
    return pedidos
  }

  async mudarStatus(id: string, status: StatusPedido) {
    await this.repositorio.atualizarStatusPedido(id, status)
  }

  async mudarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido) {
    await this.repositorio.atualizarStatusItem(idPedido, idItem, status)
  }

  async fecharPedido(id: string) {
    // if (!this.autorizacao.autorizar()) throw new Error("Não autorizado")
    const pedido = await this.buscarPedido(id)
    pedido.fechar("0")

    await this.repositorio.atualizarStatusPedido(id, StatusPedido.FECHADO)
  }

  async cancelarPedido(id: string) {
    // if (!this.autorizacao.autorizar()) throw new Error("Não autorizado")
    const pedido = await this.buscarPedido(id)
    pedido.cancelar()

    await this.repositorio.atualizarStatusPedido(id, StatusPedido.CANCELADO)
  }
}
