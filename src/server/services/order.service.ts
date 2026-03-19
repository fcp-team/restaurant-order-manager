import { IOrderRepository } from "../repositories/order.repository"
import { AuthorizationService } from "./authorization.service"
import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"

type NovoPedidoItemPayload = {
  menuItemId: number
  quantidade: number
  observacao?: string
}

type NovoPedidoPayload = {
  numeroMesa: number
  itens?: NovoPedidoItemPayload[]
}

export default class PedidoService {
  constructor(
    private repository: IOrderRepository,
    private authorization: AuthorizationService
  ) {
    this.repository = repository
    this.authorization = authorization
  }

  async criarPedido(payload: NovoPedidoPayload): Promise<Pedido> {
    const { numeroMesa, itens } = payload

    if (!numeroMesa || numeroMesa <= 0) {
      throw new Error("Número de mesa inválido")
    }

    const result: any = await this.repository.criarPedido(numeroMesa)
    const insertedId = result?.insertId ?? result?.insert_id ?? null

    if (!insertedId) {
      throw new Error("Falha ao criar pedido no repositório")
    }

    const orderIdStr = String(insertedId)

    if (Array.isArray(itens)) {
      for (const it of itens) {
        if (!it.menuItemId || it.quantidade <= 0) continue
        await this.repository.adicionarItem(Number(insertedId), it.menuItemId, it.quantidade)
      }
    }

    const raw = await this.repository.buscarPedido(orderIdStr)
    if (!raw) throw new Error("Pedido criado, mas não foi possível recuperá-lo")

    return this.mapToPedido(raw)
  }

  async buscarPedido(id: string): Promise<Pedido> {
    const raw = await this.repository.buscarPedido(id)
    if (!raw) throw new Error("Pedido não encontrado")

    return this.mapToPedido(raw)
  }

  async adicionarItem(orderId: string, menuItemId: number, quantidade: number) {
    if (quantidade <= 0) throw new Error("Quantidade inválida")

    const pedido = await this.buscarPedido(orderId)
    const item = new ItemPedido(0, menuItemId, "", quantidade, 0)
    pedido.adicionarItem(item)

    await this.repository.adicionarItem(Number(orderId), menuItemId, quantidade)
  }

  async removerItem(orderId: string, menuItemId: number, quantidade: number) {
    const pedido = await this.buscarPedido(orderId)

    try {
      pedido.removerItem(menuItemId)
    } catch (err) {
      throw err
    }

    await this.repository.removerItem(Number(orderId), menuItemId, quantidade)
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const raws = await this.repository.listarPorStatus(status)
    return raws.map(r => this.mapToPedido(r))
  }

  async mudarStatus(id: string, status: OrderStatus) {
    await this.repository.atualizarStatusPedido(id, status)
  }

  async mudarStatusItem(orderId: string, itemId: number, status: StatusItemPedido) {
    const pedido = await this.buscarPedido(orderId)
    pedido.alterarItemStatus(itemId, status)
  }

  async fecharPedido(id: string) {
    if (!this.authorization.authorize()) throw new Error("Não autorizado")

    const pedido = await this.buscarPedido(id)
    pedido.fechar(0)

    await this.repository.atualizarStatusPedido(id, StatusPedido.FECHADO)
  }

  async cancelarPedido(id: string) {
    if (!this.authorization.authorize()) throw new Error("Não autorizado")

    const pedido = await this.buscarPedido(id)
    pedido.cancelar()

    await this.repository.atualizarStatusPedido(id, StatusPedido.CANCELADO)
  }

  private mapToPedido(raw: any): Pedido {
    const idNum = Number(raw.id ?? raw.id_order ?? raw.insertId ?? 0)
    const mesa = raw.table ?? raw.table_number ?? raw.tableNumber ?? raw.table_number
    const criado = raw.createdAt ? new Date(raw.createdAt) : raw.created_at ? new Date(raw.created_at) : new Date()

    const pedido = new Pedido(idNum, Number(mesa), criado)

    const itensRaw = raw.items ?? raw.order_items ?? null
    if (Array.isArray(itensRaw)) {
      for (const ir of itensRaw) {
        const itemId = Number(ir.id ?? ir.item_id ?? 0)
        const menuItemId = Number(ir.menu_item_id ?? ir.menuItemId ?? ir.menu_item)
        const nome = ir.name ?? ir.nome ?? ""
        const quantidade = Number(ir.quantity ?? ir.quantidade ?? 1)
        const preco = Number(ir.unit_price ?? ir.precoUnitario ?? 0)
        const observacao = ir.observation ?? ir.observacao ?? undefined
        const statusStr = (ir.status ?? "PENDENTE").toString()
        const status = this.mapToStatusItem(statusStr)

        const item = new ItemPedido(itemId, menuItemId, nome, quantidade, preco, observacao, status)
        pedido.adicionarItem(item)
      }
    }

    const statusPedidoStr = (raw.status ?? StatusPedido.ABERTO).toString()
    if (statusPedidoStr === StatusPedido.FECHADO) {
      try {
        pedido.fechar(0)
      } catch (err) {
        throw err
      }
    }

    return pedido
  }

  private mapToStatusItem(value: string): StatusItemPedido {
    const v = value.toUpperCase()
    if (v === "PREPARANDO") return StatusItemPedido.PREPARANDO
    if (v === "PRONTO") return StatusItemPedido.PRONTO
    return StatusItemPedido.PENDENTE
  }
}
