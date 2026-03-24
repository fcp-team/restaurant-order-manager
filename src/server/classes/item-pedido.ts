export enum StatusItemPedido {
  PENDENTE = "PENDENTE",
  PREPARANDO = "PREPARANDO",
  PRONTO = "PRONTO"
}

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

  get Id() { return String(this.id) }

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

  acrescentar(): void {
    this.quantidade++
  }

  reduzir(): void {
    if (this.quantidade <= 1) {
      throw new Error("Quantidade não pode ser menor que 1")
    }
    this.quantidade--
  }

  alterarStatus(status: StatusItemPedido) {
    this.status = status
  }
}
