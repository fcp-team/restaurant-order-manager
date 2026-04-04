export class ItemMenu {
  private id: string | null = null

  constructor(
    private nome: string,
    private descricao: string,
    private preco: number
  ) { }

  get Id() { return String(this.id) }

  set Id(valor: string) {
    if (this.id) throw new Error("Não é possível atribuir um novo id ao item do menu")
    this.id = valor
  }

  get Nome() { return this.nome }

  get Descricao() { return this.descricao }

  get Preco() { return this.preco }

  alterarPreco(novoPreco: number): void {
    if (novoPreco < 0) {
      throw new Error("O preço não pode ser negativo.")
    }
    this.preco = novoPreco
  }

  alterarDescricao(novaDescricao: string): void {
    this.descricao = novaDescricao
  }
}
