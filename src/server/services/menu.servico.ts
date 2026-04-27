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
 
  async listarMenus(): Promise<Menu[]> {
    return await this.repositorio.listarMenus()
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
 
  async atualizarItem(idMenu: string, idItem: string, payload: Partial<ItemMenuPayload>): Promise<ItemMenu | null> {
    const camposEnviados = Object.keys(payload).filter(k => (payload as any)[k] !== undefined)
    if (camposEnviados.length === 0) {
      throw new Error("Nenhum campo foi enviado para atualização")
    }
 
    if (payload.nome !== undefined) {
      if (typeof payload.nome !== "string" || !payload.nome.trim()) {
        throw new Error("Nome do item deve ser uma string não vazia")
      }
    }
 
    if (payload.preco !== undefined) {
      if (typeof payload.preco !== "number" || isNaN(payload.preco)) {
        throw new Error("Preço do item deve ser um número válido")
      }
      if (payload.preco < 0) {
        throw new Error("Preço do item não pode ser negativo")
      }
    }
 
    if (payload.descricao !== undefined) {
      if (typeof payload.descricao !== "string" || !payload.descricao.trim()) {
        throw new Error("Descrição do item deve ser uma string não vazia")
      }
    }
 
    const item = await this.buscarItem(idMenu, idItem)
 
    if (payload.nome !== undefined) item.alterarNome(payload.nome.trim())
    if (payload.preco !== undefined) item.alterarPreco(payload.preco)
    if (payload.descricao !== undefined) item.alterarDescricao(payload.descricao.trim())
 
    return await this.repositorio.atualizarItem(idMenu, item)
  }
}