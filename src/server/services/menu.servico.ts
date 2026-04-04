import { IRepositorioMenu } from "../repositories/menu.repositorio"
import { ItemMenu } from "../classes/item-menu"
import { Menu } from "../classes/menu"

export type ItemMenuPayload = {
  nome: string
  preco: number
  descricao?: string
}

export type MenuPayload = {
  nome: string
  itens: ItemMenuPayload[]
}

export default class ServicoMenu {
  constructor(
    private repositorio: IRepositorioMenu
  ) { }

  async criarMenu(payload: MenuPayload): Promise<Menu> {
    if (!payload.nome) throw new Error("Nome do menu é obrigatório")

    const itens = payload.itens.map(i => {
      if (!i.nome) throw new Error("Nome do item é obrigatório")
      if (i.preco < 0) throw new Error(`Preço inválido para o item "${i.nome}"`)
      return new ItemMenu(i.nome, i.descricao ?? "", i.preco)
    })

    const menu = new Menu(payload.nome, itens)
    await this.repositorio.criarMenu(menu)
    return menu
  }

  async buscarMenu(id: string): Promise<Menu> {
    const menu = await this.repositorio.buscarMenu(id)
    if (!menu) throw new Error("Menu não encontrado")
    return menu
  }

  async atualizarMenu(id: string, payload: MenuPayload): Promise<Menu> {
    const menu = await this.buscarMenu(id)
    // Como o nome é privado na classe, atualizamos via repositório direto
    const menuAtualizado = new Menu(payload.nome, menu.Itens)
    menuAtualizado.Id = menu.Id
    return await this.repositorio.atualizarMenu(menuAtualizado)
  }

  async buscarItem(idMenu: string, idItem: string): Promise<ItemMenu> {
    const item = await this.repositorio.buscarItem(idMenu, idItem)
    if (!item) throw new Error("Item não encontrado")
    return item
  }

  async adicionarItem(idMenu: string, payload: ItemMenuPayload): Promise<Menu> {
    if (!payload.nome) throw new Error("Nome do item é obrigatório")
    if (payload.preco < 0) throw new Error("Preço do item não pode ser negativo")

    await this.buscarMenu(idMenu) // valida se o menu existe

    const item = new ItemMenu(payload.nome, payload.descricao ?? "", payload.preco)
    return await this.repositorio.adicionarItem(idMenu, item)
  }

  async removerItem(idMenu: string, idItem: string): Promise<Menu> {
    await this.buscarItem(idMenu, idItem) // valida se o item existe
    return await this.repositorio.removerItem(idMenu, idItem)
  }

  async atualizarItem(idMenu: string, idItem: string, payload: ItemMenuPayload): Promise<ItemMenu | null> {
    if (!payload.nome) throw new Error("Nome do item é obrigatório")
    if (payload.preco < 0) throw new Error("Preço do item não pode ser negativo")

    const item = await this.buscarItem(idMenu, idItem) // valida se existe
    item.alterarPreco(payload.preco)
    item.alterarDescricao(payload.descricao ?? item.Descricao)

    return await this.repositorio.atualizarItem(idMenu, item)
  }
}