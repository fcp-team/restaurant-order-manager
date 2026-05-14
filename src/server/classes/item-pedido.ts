import { StatusItemPedido } from "@/lib/enums/status-item-pedido"

export class ItemPedido {
  private id: string | null = null
  private status: StatusItemPedido = StatusItemPedido.PENDENTE
  
  constructor(
    private readonly idItemMenu: string,
    private nome: string,
    private quantidade: number,
    private precoUnitario: number,
    public observacao?: string,
  ) { }

  get Id(): string | null { return this.id }

  set Id(valor: string) {
    if (this.id) throw new Error("Não é possível atribuir um novo id ao item do pedido")
    this.id = valor
  }

  get Nome() {return this.nome}
  
  get IdItemMenu() { return this.idItemMenu }

  get Status() { return this.status }

  set Status(valor: StatusItemPedido) {
    this.status = valor
  }

  get Quantidade() { return this.quantidade }

  calcularSubtotal(): number {
    return this.precoUnitario * this.quantidade
  }

  atualizar(dados: {
    quantidade?: number
    observacao?: string
    status?: StatusItemPedido
  }) {
    if (dados.quantidade !== undefined) {
      if (dados.quantidade <= 0) throw new Error("Quantidade inválida")
      this.quantidade = dados.quantidade
    }

    if (dados.quantidade !== undefined)
      this.observacao = dados.observacao

    if (dados.status !== undefined)
      this.status = dados.status
  }

  // alterarStatus(status: StatusItemPedido) {
  //   this.status = status
  // }
}
