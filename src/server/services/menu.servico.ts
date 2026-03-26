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

export default class ServicoPedido {
  constructor(
    private repositorio: IRepositorioPedido
  ) { }

  async criarMenu(payload: MenuPayload): Promise<Menu> { }

  async buscarMenu(id: string): Promise<Menu> { }

  async atualizarMenu(menu: Menu): Promise<Menu> { }

  async buscarItem(idMenu: string, idItem: String): Promise<Menu> { }

  async adicionarItem(idMenu: string, payload: ItemMenuPayload): Promise<Menu> { }
  
  async removerItem(idMenu: string, idItem: string): Promise<Menu> { }

  async atualizarItem(idMenu: string, item: ItemMenu): Promise<ItemMenu | null> { }
}
