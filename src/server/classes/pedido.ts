import { ItemPedido, StatusItemPedido } from "./item-pedido";

export enum StatusPedido {
  ABERTO = "ABERTO",
  FECHADO = "FECHADO",
  CANCELADO = "CANCELADO"
}

export class Pedido {
  private readonly criadoEm: Date = new Date()
  private status: StatusPedido = StatusPedido.ABERTO
  private fechadoEm?: Date
  private idPagamento?: string
  
  constructor(
    private readonly id: string,
    private numeroMesa: number,
    private itens: ItemPedido[]
  ) {}

  get Id() {
    return this.id
  }

  get Itens() {
    return [...this.itens];
  }

  adicionarItem(item: ItemPedido) {
    this.assegurarPedidoAberto()
    this.itens.push(item)
  }

  removerItem(idItem: string) {
    this.assegurarPedidoAberto()
    this.itens = this.itens.filter(i => i.Id !== idItem);
  }

  acrescentarItem(idItem: string) {
    this.assegurarPedidoAberto();

    const item = this.pegarItem(idItem);
    item.acrescentar();
  }

  reduzirItem(itemId: string) {
    this.assegurarPedidoAberto();

    const item = this.pegarItem(itemId);
    item.reduzir();
  }

  alterarItemStatus(itemId: string, status: StatusItemPedido) {
    const item = this.pegarItem(itemId);
    item.alterarStatus(status);
  }

  listarItensPorStatus(status: StatusItemPedido) {
    return this.itens.filter(i => i.Status === status);
  }

  calcularTotal(): number {
    return this.itens
      .map(i => i.calcularSubtotal())
      .reduce((ac, valor) => ac + valor, 0);
  }

  fechar(idPagamento: string) {
    this.assegurarPedidoAberto();

    this.idPagamento = idPagamento;
    this.fechadoEm = new Date();
    this.status = StatusPedido.FECHADO;
  }

  cancelar() {
    if (this.status === StatusPedido.FECHADO) {
      throw new Error("Pedidos fechados não podem ser cancelados");
    }

    this.status = StatusPedido.CANCELADO;
    this.fechadoEm = new Date();
  }

  private pegarItem(idItem: string): ItemPedido {
    const item = this.itens.find(i => i.Id === idItem);

    if (!item) {
      throw new Error("Item não encontrado");
    }

    return item;
  }

  private assegurarPedidoAberto() {
    if (this.status !== StatusPedido.ABERTO) {
      throw new Error("O pedido não está aberto");
    }
  }
}
