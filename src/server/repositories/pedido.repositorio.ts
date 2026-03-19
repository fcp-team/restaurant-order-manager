import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"

type NovoPedidoItemPayload = {
  idItemMenu: string
  quantidade: number
  observacao?: string
}

type NovoPedidoPayload = {
  numeroMesa: number
  itens: NovoPedidoItemPayload[]
}

export interface IRepositorioPedido {
  criarPedido(pedido: NovoPedidoPayload): Promise<Pedido>
  buscarPedido(id: string): Promise<Pedido | null>
  listPedidosPorStatus(status: StatusPedido): Promise<Pedido[]>
  listarPedidosPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]>
  adicionarItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido>
  removerItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido>
  atualizarStatusPedido(id: string, status: StatusPedido): Promise<void>
  atualizarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<void>
}

type StoredPedido = {
  pedido: Pedido
  status: StatusPedido
  criadoEm: Date
  fechadoEm?: Date
  atualizadoEm?: Date
}

export class InMemoryRepositorioPedido implements IRepositorioPedido {
  private pedidos: Map<string, StoredPedido> = new Map()
  private nextPedidoId = 1
  private nextItemId = 1

  async criarPedido(payload: NovoPedidoPayload): Promise<Pedido> {
    const pedidoId = this.nextPedidoId++

    const itens: ItemPedido[] = (payload.itens || []).map(i => {
      const itemId = this.nextItemId++
      const menuIdNum = Number(i.idItemMenu) || 0
      const nome = `Item ${i.idItemMenu}`
      const precoUnitario = 0

      return new ItemPedido(itemId, menuIdNum, nome, i.quantidade, precoUnitario, i.observacao)
    })

    const pedido = new Pedido(pedidoId, payload.numeroMesa, itens)

    const key = String(pedido.Id)
    this.pedidos.set(key, {
      pedido,
      status: StatusPedido.ABERTO,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    })

    return pedido
  }

  async buscarPedido(id: string): Promise<Pedido | null> {
    const entry = this.pedidos.get(id)
    return entry ? entry.pedido : null
  }

  async listPedidosPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const results: Pedido[] = []
    for (const entry of this.pedidos.values()) {
      if (entry.status === status) results.push(entry.pedido)
    }
    return results
  }

  async listarPedidosPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]> {
    const results: Pedido[] = []
    for (const entry of this.pedidos.values()) {
      const criado = entry.criadoEm
      if (criado >= inicio && criado <= fim) results.push(entry.pedido)
    }
    return results
  }

  async adicionarItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido> {
    const entry = this.pedidos.get(idPedido)
    if (!entry) throw new Error("Pedido não encontrado")

    const itemId = this.nextItemId++
    const menuIdNum = Number(idItemMenu) || 0
    const nome = `Item ${idItemMenu}`
    const precoUnitario = 0

    const item = new ItemPedido(itemId, menuIdNum, nome, quantidade, precoUnitario)
    entry.pedido.adicionarItem(item)
    entry.atualizadoEm = new Date()

    return item
  }

  async removerItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido> {
    const entry = this.pedidos.get(idPedido)
    if (!entry) throw new Error("Pedido não encontrado")

    const itemId = Number(idItemMenu)
    if (!itemId) throw new Error("ID de item inválido")

    // tentar localizar o item antes de remover
    const itens = entry.pedido.Itens
    const item = itens.find(i => i.Id === itemId)
    if (!item) throw new Error("Item não encontrado no pedido")

    if (quantidade >= item.Quantidade) {
      // remover completamente
      entry.pedido.removerItem(itemId)
      entry.atualizadoEm = new Date()
      return item
    }

    // reduzir quantidade
    for (let k = 0; k < quantidade; k++) {
      item.reduzir()
    }

    entry.atualizadoEm = new Date()
    return item
  }

  async atualizarStatusPedido(id: string, status: StatusPedido): Promise<void> {
    const entry = this.pedidos.get(id)
    if (!entry) throw new Error("Pedido não encontrado")

    entry.status = status
    if (status === StatusPedido.FECHADO || status === StatusPedido.CANCELADO) {
      entry.fechadoEm = new Date()
    }
    entry.atualizadoEm = new Date()
  }

  async atualizarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<void> {
    const entry = this.pedidos.get(idPedido)
    if (!entry) throw new Error("Pedido não encontrado")

    const itemId = Number(idItem)
    if (!itemId) throw new Error("ID de item inválido")

    entry.pedido.alterarItemStatus(itemId, status)
    entry.atualizadoEm = new Date()
  }
}
