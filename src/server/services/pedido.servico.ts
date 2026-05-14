import { IRepositorioPedido } from "../repositories/pedido.repositorio"
import { IRepositorioMenu, RepositorioMenu } from "../repositories/menu.repositorio"

import { Pedido } from "../classes/pedido"
import { ItemPedido } from "../classes/item-pedido"

import { NovoPedidoDTO, NovoItemPedidoDTO, PedidoAtualizadoDTO, ItemPedidoAtualizadoDTO } from "@/lib/dtos/pedido"
import { StatusPedido } from "@/lib/enums/status-pedido"
import { StatusItemPedido } from "@/lib/enums/status-item-pedido"
import { ItemMenu } from "../classes/item-menu"

export default class ServicoPedido {
  constructor(
    private repositorio: IRepositorioPedido,
    private repositorioMenu: IRepositorioMenu = new RepositorioMenu(),
  ) { }

  async criarPedido(payload: NovoPedidoDTO): Promise<Pedido> {
    const { numeroMesa, itens } = payload

    if (!numeroMesa) {
      throw new Error("Número de mesa inválido")
    }

    if (!itens) {
      throw new Error("O pedido deve conter itens válidos")
    }

    const pedidoItens: ItemPedido[] = []

    for (const i of itens) {
      const itemMenu = await this.repositorioMenu.buscarItem(i.idItemMenu)
      if (!itemMenu) throw new Error(`Item de menu não encontrado: ${i.idItemMenu}`)

      pedidoItens.push(new ItemPedido(
        itemMenu.Id,
        itemMenu.Nome,
        i.quantidade,
        itemMenu.Preco,
        i.observacao
      ))
    }
    const pedido = new Pedido(numeroMesa, pedidoItens)

    await this.repositorio.criarPedido(pedido)
    return pedido
  }

  async buscarPedido(id: string): Promise<Pedido> {
    const pedido = await this.repositorio.buscarPedido(id)
    if (!pedido) throw new Error("Pedido não encontrado")

    return pedido
  }

  async atualizarPedido(payload: PedidoAtualizadoDTO): Promise<Pedido> {
    if (!payload.id) throw new Error("ID do pedido não informado")

    const idPedido = payload.id
    const pedido = await this.repositorio.buscarPedido(idPedido)
    if (!pedido) throw new Error(`Pedido não encontrado - ID: ${idPedido}`)

    if (payload.numeroMesa !== undefined)
      pedido.numeroMesa = payload.numeroMesa
    
    if (payload.status !== undefined) { }
    
    if (payload.itensAdicionados !== undefined)
      await this.adicionarItens(pedido, payload.itensAdicionados)
    
    if (payload.itensRemovidos !== undefined)
      await this.removerItens(pedido, payload.itensRemovidos)
    
    if (payload.itensAlterados !== undefined)
      await this.atualizarItens(pedido, payload.itensAlterados)

    console.log(pedido)

    await this.repositorio.atualizarPedido(pedido)
    return pedido
  }

  private async adicionarItens(pedido: Pedido, itens: NovoItemPedidoDTO[]): Promise<void> {
    if (itens.length === 0)
      throw new Error("Não foram passados os itens a serem adicionados ao pedido")

    for (const item of itens) {
      if (!item.idItemMenu) throw new Error("Item do cardápio não informado.")
      if (item.quantidade <= 0) throw new Error("Item com quantidade inválida")

      const itemMenu = await this.repositorioMenu.buscarItem(item.idItemMenu)
      if (!itemMenu) throw new Error(`Item do cardápio não encontrado - ID: ${item.idItemMenu}`)

      const novoItem = new ItemPedido(
        itemMenu.Id,
        itemMenu.Nome,
        item.quantidade,
        itemMenu.Preco,
        item.observacao
      )

      pedido.adicionarItem(novoItem)
    }
  }

  private async removerItens(pedido: Pedido, idItens: string[]): Promise<void> {
    if (idItens.length === 0)
      throw new Error("Não foram indicados os itens a serem removidos do pedido")

    idItens.forEach((id) => pedido.removerItem(id))
  }

  private async atualizarItens(pedido: Pedido, itens: ItemPedidoAtualizadoDTO[]): Promise<void> {
    if (itens.length === 0)
      throw new Error("Não foram passados os itens a serem atualizados")

    if (pedido.Itens.length === 0)
      throw new Error("Não há itens a serem atualizados no pedido")

    console.log(itens)

    for (const item of itens) {
      if (!item.id) throw new Error("ID do item não informado")
      
      if (item.quantidade && item.quantidade <= 0)
        throw new Error("Item com quantidade inválida")

      if (item.status && !Object.values(StatusItemPedido).includes(item.status))
        throw new Error("Status inválido para o item")

      pedido.atualizarItem(item.id, {
        quantidade: item.quantidade,
        observacao: item.observacao,
        status: item.status
      })
    }
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const pedidos = await this.repositorio.listarPorStatus(status)
    return pedidos
  }

  async listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]> {
    const pedidos = await this.repositorio.listarPorPeriodo(inicio, fim)
    return pedidos
  }

  // async alterarStatusPedido(id: string, status: StatusPedido): Promise<Pedido> {
  //   return await this.repositorio.atualizarStatusPedido(id, status)
  // }

  // async alterarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<Pedido> {
  //   return await this.repositorio.atualizarStatusItem(idPedido, idItem, status)
  // }

  // async fecharPedido(id: string) {
  //   const pedido = await this.buscarPedido(id)
  //   pedido.fechar()

  //   await this.repositorio.atualizarStatusPedido(id, StatusPedido.FECHADO)
  // }

  // async cancelarPedido(id: string) {
  //   const pedido = await this.buscarPedido(id)
  //   pedido.cancelar()

  //   await this.repositorio.atualizarStatusPedido(id, StatusPedido.CANCELADO)
  // }
}
