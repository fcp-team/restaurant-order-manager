export enum StatusItemPedido {
  PENDENTE = "PENDENTE",
  PREPARANDO = "PREPARANDO",
  PRONTO = "PRONTO"
}

export class ItemPedido {
  private status: StatusItemPedido = StatusItemPedido.PENDENTE

  constructor(
    private readonly id: string,
    private readonly idItemMenu: string,
    private readonly nome: string,
    private quantidade: number,
    private readonly precoUnitario: number,
    private observacao?: string,
  ) {}

  get Id() {
    return this.id;
  }

  get IdItemMenu() {
    return this.idItemMenu
  }

  get Status() {
    return this.status;
  }

  get Quantidade() {
    return this.quantidade;
  }

  calcularSubtotal(): number {
    return this.precoUnitario * this.quantidade;
  }

  acrescentar(): void {
    this.quantidade++;
  }

  reduzir(): void {
    if (this.quantidade <= 1) {
      throw new Error("Quantidade não pode ser menor que 1");
    }
    this.quantidade--;
  }

  alterarStatus(status: StatusItemPedido) {
    this.status = status;
  }
}
