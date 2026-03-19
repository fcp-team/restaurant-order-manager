import { ItemPedido, StatusItemPedido } from "./item-pedido";

export enum StatusPedido {
  ABERTO = "ABERTO",
  FECHADO = "FECHADO",
  CANCELADO = "CANCELADO"
}

export class Pedido {
  private itens: ItemPedido[] = [];
  private status: StatusPedido = StatusPedido.ABERTO;
  private fechadoEm?: Date;
  private pagamentoId?: number;

  constructor(
    private readonly id: number,
    private numeroMesa: number,
    private readonly criadoEm: Date = new Date()
  ) {}

  get Id() {
    return this.id
  }

  get Itens() {
    return [...this.itens];
  }

  adicionarItem(item: ItemPedido) {
    this.assegurarPedidoAberto();

    this.itens.push(item);
  }

  removerItem(itemId: number) {
    this.assegurarPedidoAberto();

    this.itens = this.itens.filter(i => i.Id !== itemId);
  }

  acrescentarItem(itemId: number) {
    this.assegurarPedidoAberto();

    const item = this.pegarItem(itemId);
    item.acrescentar();
  }

  reduzirItem(itemId: number) {
    this.assegurarPedidoAberto();

    const item = this.pegarItem(itemId);
    item.reduzir();
  }

  alterarItemStatus(itemId: number, status: StatusItemPedido) {
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

  fechar(pagamentoId: number) {
    this.assegurarPedidoAberto();

    this.pagamentoId = pagamentoId;
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

  private pegarItem(itemId: number): ItemPedido {
    const item = this.itens.find(i => i.Id === itemId);

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
