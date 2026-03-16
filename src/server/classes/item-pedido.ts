export enum StatusItemPedido {
  PENDENTE = "PENDENTE",
  PREPARANDO = "PREPARANDO",
  PRONTO = "PRONTO"
}

export class ItemPedido {
  constructor(
    private readonly id: number,
    private readonly itemMenuId: number,
    private readonly nome: string,
    private quantidade: number,
    private readonly precoUnitario: number,
    private observacao?: string,
    private status: StatusItemPedido = StatusItemPedido.PENDENTE
  ) {}

  get Id() {
    return this.id;
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
      throw new Error("Quantity cannot be less than 1");
    }

    this.quantidade--;
  }

  alterarStatus(status: StatusItemPedido) {
    this.status = status;
  }
}
