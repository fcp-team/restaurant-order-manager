export enum StatusItemPedido {
  PENDENTE = "PENDENTE",
  PREPARANDO = "PREPARANDO",
  PRONTO = "PRONTO"
}

export class ItemPedido {
  
  constructor(
    private id: string,
    private readonly idItemMenu: string,
    private readonly nome: string,
    private quantidade: number,
    private readonly precoUnitario: number,
    private observacao?: string,
    private status: StatusItemPedido = StatusItemPedido.PENDENTE
  ) {}

  get Id() {
    return this.id;
  }

  set Id(valor: string) {
    this.id = valor
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
