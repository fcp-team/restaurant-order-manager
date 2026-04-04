import { ItemMenu } from "./item-menu"

export class Menu {
  private id: string | null = null

  constructor(
    private nome: string,
    private itens: ItemMenu[]
  ) { }

  get Id() { return String(this.id) }

  set Id(valor: string) {
    if (this.id) throw new Error("Não é possível atribuir um novo id ao menu")
    this.id = valor
  }

  get Nome() { return this.nome }

  get Itens() { return [...this.itens] }

  adicionarItem(item: ItemMenu): void {
    const existente = this.itens.find(i => i.Id === item.Id)
    if (existente) {
      throw new Error(`Item com id ${item.Id} já existe.`)
    }
    this.itens.push(item)
  }

  removerItem(id: string): void {
    const indice = this.itens.findIndex(i => i.Id === id)
    if (indice === -1) {
      throw new Error(`Item com id ${id} não encontrado.`)
    }
    this.itens.splice(indice, 1)
  }

  pegarItem(id: string): ItemMenu {
    const item = this.itens.find(i => i.Id === id)
    if (!item) {
      throw new Error(`Item com id ${id} não encontrado.`)
    }
    return item
  }

  alterarPrecoItem(id: string, novoPreco: number): void {
    const item = this.pegarItem(id)
    item.alterarPreco(novoPreco)
  }

  alterarDescricaoItem(id: string, novaDescricao: string): void {
    const item = this.pegarItem(id)
    item.alterarDescricao(novaDescricao)
  }
}
