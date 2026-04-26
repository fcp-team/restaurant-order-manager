import { IRepositorioPedido } from "../repositories/pedido.repositorio"

import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"

export type NovoPedidoItemPayload = {
  idItemMenu: string
  quantidade: number
  observacao?: string
}

export type NovoPedidoPayload = {
  numeroMesa: string
  itens: NovoPedidoItemPayload[]
}

export default class ServicoPedido {
  constructor(
    private repositorio: IRepositorioPedido,
  ) { }

  async criarPedido(payload: NovoPedidoPayload): Promise<Pedido> {
    const { numeroMesa, itens } = payload

    if (!numeroMesa) {
      throw new Error("Número de mesa inválido")
    }

    if (!itens) {
      throw new Error("O pedido deve conter itens válidos")
    }

    // TODO: substituir o mock pela busca de dados dos itens do cardápio

    // MOCK
    const itensMenu = itens.map((i, index) => ({
      ...i,
      nome: `Item ${index}`,
      preco: 10
    }))

    const pedidoItens = itensMenu.map(i => new ItemPedido(
      i.idItemMenu,
      i.nome,
      i.quantidade,
      i.preco,
      i.observacao
    ))
    const pedido = new Pedido(numeroMesa, pedidoItens)

    await this.repositorio.criarPedido(pedido)
    return pedido
  }

  async buscarPedido(id: string): Promise<Pedido> {
    const pedido = await this.repositorio.buscarPedido(id)
    if (!pedido) throw new Error("Pedido não encontrado")

    return pedido
  }

  async adicionarItem(idPedido: string, itemPayload: NovoPedidoItemPayload): Promise<Pedido> {
    if (itemPayload.quantidade <= 0) throw new Error("Quantidade inválida")

    // TODO: substituir o mock pela busca de dados do item do cardápio

    // MOCK
    const itemMenu = {
      ...itemPayload,
      nome: `Item ${itemPayload.idItemMenu}`,
      preco: 10
    }

    const novoItem = new ItemPedido(
      itemMenu.idItemMenu,
      itemMenu.nome,
      itemMenu.quantidade,
      itemMenu.preco,
      itemMenu.observacao
    )

    const pedido = await this.repositorio.adicionarItem(idPedido, novoItem)
    if (!pedido) throw new Error('Falha ao adicionar item')

    return pedido
  }

  async acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido> {
    if (quantidade <= 0) throw new Error("Quantidade inválida")
    const pedido = await this.repositorio.acrescentarItem(idPedido, idItem, quantidade)
    if (!pedido) throw new Error('Falha ao adicionar item')

    return pedido
  }

  async removerItem(idPedido: string, idItem: string): Promise<Pedido> {
    const pedido = await this.repositorio.removerItem(idPedido, idItem)
    if (!pedido) throw new Error('Falha ao remover item')

    return pedido
  }

  async reduzirItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido> {
    if (quantidade <= 0) throw new Error("Quantidade inválida")
    const pedido = await this.repositorio.reduzirItem(idPedido, idItem, quantidade)
    if (!pedido) throw new Error('Falha ao adicionar item')

    return pedido
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const pedidos = await this.repositorio.listarPorStatus(status)
    return pedidos
  }

  async listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]> {
    const pedidos = await this.repositorio.listarPorPeriodo(inicio, fim)
    return pedidos
  }

  async alterarStatusPedido(id: string, status: StatusPedido): Promise<Pedido> {
    return await this.repositorio.atualizarStatusPedido(id, status)
  }

  async alterarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<Pedido> {
    return await this.repositorio.atualizarStatusItem(idPedido, idItem, status)
  }

  async fecharPedido(id: string) {
    // if (!this.autorizacao.autorizar()) throw new Error("Não autorizado")
    const pedido = await this.buscarPedido(id)
    pedido.fechar()

    await this.repositorio.atualizarStatusPedido(id, StatusPedido.FECHADO)
  }

  async cancelarPedido(id: string) {
    // if (!this.autorizacao.autorizar()) throw new Error("Não autorizado")
    const pedido = await this.buscarPedido(id)
    pedido.cancelar()

    await this.repositorio.atualizarStatusPedido(id, StatusPedido.CANCELADO)
  }
}
