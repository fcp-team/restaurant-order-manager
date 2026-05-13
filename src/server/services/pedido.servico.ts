import { IRepositorioPedido } from "../repositories/pedido.repositorio"
import { IRepositorioMenu, RepositorioMenu } from "../repositories/menu.repositorio"

import { Pedido } from "../classes/pedido"
import { ItemPedido } from "../classes/item-pedido"

import { NovoPedidoDTO, NovoItemPedidoDTO } from "@/lib/dtos/pedido"
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

  async adicionarItens(idPedido: string, itens: NovoItemPedidoDTO[]): Promise<Pedido> {
    if (itens.length === 0)
      throw new Error("Não foram passados os itens a serem adicionados ao pedido")
    
    const pedido = await this.repositorio.buscarPedido(idPedido)
    if (!pedido) throw new Error(`Pedido não encontrado - ID: ${idPedido}`)
    
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
    await this.repositorio.atualizarPedido(pedido)
    return pedido
  }

  async removerItens(idPedido: string, idItens: string[]): Promise<Pedido> {
    if (idItens.length === 0)
      throw new Error("Não foram indicados os itens a serem removidos do pedido")

    const pedido = await this.repositorio.buscarPedido(idPedido)
    if (!pedido) throw new Error(`Pedido não encontrado - ID: ${idPedido}`)

    idItens.forEach((id) => pedido.removerItem(id))

    await this.repositorio.removerItens(pedido)
    return pedido
  }

  async acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido> {
    if (quantidade <= 0) throw new Error("Quantidade inválida")
    const pedido = await this.repositorio.acrescentarItem(idPedido, idItem, quantidade)
    if (!pedido) throw new Error('Falha ao adicionar item')

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
    const pedido = await this.buscarPedido(id)
    pedido.fechar()

    await this.repositorio.atualizarStatusPedido(id, StatusPedido.FECHADO)
  }

  async cancelarPedido(id: string) {
    const pedido = await this.buscarPedido(id)
    pedido.cancelar()

    await this.repositorio.atualizarStatusPedido(id, StatusPedido.CANCELADO)
  }
}
