import { ItemPedido } from "./item-pedido"
import { StatusPedido } from "@/lib/enums/status-pedido"
import { StatusItemPedido } from "@/lib/enums/status-item-pedido"

export class Pedido {
  private id: string | null = null
  private readonly criadoEm: Date = new Date()
  private status: StatusPedido = StatusPedido.ABERTO
  private fechadoEm?: Date

  constructor(
    public numeroMesa: string,
    private itens: ItemPedido[],
  ) { }

  get Id() { return String(this.id) }

  set Id(valor: string) {
    if (this.id) throw new Error("Não é possível atribuir um novo id ao pedido")
    this.id = valor
  }

  get CriadoEm() { return this.criadoEm }

  get Itens() { return [...this.itens] }
  
  get Status() { return this.status }

  set Status(valor: StatusPedido) {
    this.status = valor
  }

  get FechadoEm(): Date | undefined {
    if (this.fechadoEm) return new Date(this.fechadoEm)
  }

  set FechadoEm(data: Date) {
    if (this.status === StatusPedido.ABERTO) {
      throw new Error("Não é possível atribuir uma data de fechamento para um pedido que ainda está aberto")
    }
    this.fechadoEm = data
  }

  adicionarItem(item: ItemPedido) {
    this.assegurarPedidoAberto()
    this.itens.push(item)
  }

  removerItem(idItem: string) {
    this.assegurarPedidoAberto()
    this.itens = this.itens.filter(i => i.Id !== idItem)
  }

  atualizarItem(
    idItem: string,
    dados: {
      quantidade?: number
      observacao?: string
      status?: StatusItemPedido
    }
  ) {
    this.assegurarPedidoAberto()
    const item = this.pegarItem(idItem)
    item.atualizar(dados)
  }

  listarItensPorStatus(status: StatusItemPedido) {
    return this.itens.filter(i => i.Status === status)
  }

  calcularTotal(): number {
    return this.itens
      .map(i => i.calcularSubtotal())
      .reduce((ac, valor) => ac + valor, 0)
  }

  alterarStatus(status: StatusPedido) {
    if (!Object.values(StatusPedido).includes(status))
      throw new Error("Status inválido para o pedido")

    switch (status) {
      case StatusPedido.FECHADO:
        this.fechar()
        break

      case StatusPedido.CANCELADO:
        this.cancelar()
        break

      case StatusPedido.ABERTO:
        this.status = status
        this.fechadoEm = undefined
        break
    }
  }

  private fechar() {
    this.assegurarPedidoAberto()

    this.status = StatusPedido.FECHADO
    this.fechadoEm = new Date()
  }

  private cancelar() {
    if (this.status === StatusPedido.FECHADO) {
      throw new Error("Pedidos fechados não podem ser cancelados")
    }

    this.status = StatusPedido.CANCELADO
    this.fechadoEm = new Date()
  }

  pegarItem(idItem: string): ItemPedido {
    const item = this.itens.find(i => i.Id === idItem)

    if (!item) {
      throw new Error("Item não encontrado")
    }

    return item
  }

  private assegurarPedidoAberto() {
    if (this.status !== StatusPedido.ABERTO) {
      throw new Error("O pedido não está aberto")
    }
  }
}
