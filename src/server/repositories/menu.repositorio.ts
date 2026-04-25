import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ItemMenu } from "../classes/item-menu"
import { Menu } from "../classes/menu"
 
export interface IRepositorioMenu {
  criarMenu(menu: Menu): Promise<void>
  buscarMenu(id: string): Promise<Menu | null>
  listarMenus(): Promise<Menu[]>
  atualizarMenu(menu: Menu): Promise<Menu>
  buscarItem(idMenu: string, idItem: string): Promise<ItemMenu | null>
  adicionarItem(idMenu: string, item: ItemMenu): Promise<Menu>
  removerItem(idMenu: string, idItem: string): Promise<Menu>
  atualizarItem(idMenu: string, item: ItemMenu): Promise<ItemMenu | null>
}
 
export class RepositorioMenu implements IRepositorioMenu {
 
  async criarMenu(menu: Menu): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
 
      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO Menus (nome) VALUES (?)`,
        [menu.Nome]
      )
      menu.Id = String(res.insertId)
 
      for (const item of menu.Itens) {
        const [r] = await conn.execute<ResultSetHeader>(
          `INSERT INTO Itens (id_menu, nome, descricao, valor) VALUES (?, ?, ?, ?)`,
          [res.insertId, item.Nome, item.Descricao, item.Preco]
        )
        item.Id = String(r.insertId)
      }
 
      await conn.commit()
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }
 
  async buscarMenu(id: string): Promise<Menu | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.id_menu, m.nome,
              i.id_item, i.nome AS item_nome, i.descricao AS item_descricao, i.valor
       FROM Menus m
       LEFT JOIN Itens i ON i.id_menu = m.id_menu AND i.excluido = 0
       WHERE m.id_menu = ? AND m.excluido = 0`,
      [Number(id)]
    )
 
    if (rows.length === 0) return null
 
    const primeira = rows[0]
 
    const itens: ItemMenu[] = rows
      .filter(r => r.id_item !== null)
      .map(r => {
        const item = new ItemMenu(r.item_nome, r.item_descricao ?? "", Number(r.valor))
        item.Id = String(r.id_item)
        return item
      })
 
    const menu = new Menu(primeira.nome, itens)
    menu.Id = String(primeira.id_menu)
    return menu
  }
 
  async listarMenus(): Promise<Menu[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id_menu FROM Menus WHERE excluido = 0`
    )
    const menus: Menu[] = []
    for (const r of rows) {
      const menu = await this.buscarMenu(String(r.id_menu))
      if (menu) menus.push(menu)
    }
    return menus
  }
 
  async atualizarMenu(menu: Menu): Promise<Menu> {
    await pool.execute(
      `UPDATE Menus SET nome = ? WHERE id_menu = ? AND excluido = 0`,
      [menu.Nome, Number(menu.Id)]
    )
 
    const atualizado = await this.buscarMenu(menu.Id)
    if (!atualizado) throw new Error("Menu não encontrado após atualizar")
    return atualizado
  }
 
  async buscarItem(idMenu: string, idItem: string): Promise<ItemMenu | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Itens WHERE id_item = ? AND id_menu = ? AND excluido = 0`,
      [Number(idItem), Number(idMenu)]
    )
 
    const row = rows[0]
    if (!row) return null
 
    const item = new ItemMenu(row.nome, row.descricao ?? "", Number(row.valor))
    item.Id = String(row.id_item)
    return item
  }
 
  async adicionarItem(idMenu: string, item: ItemMenu): Promise<Menu> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
 
      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO Itens (id_menu, nome, descricao, valor) VALUES (?, ?, ?, ?)`,
        [Number(idMenu), item.Nome, item.Descricao, item.Preco]
      )
      item.Id = String(res.insertId)
 
      await conn.commit()
 
      const menu = await this.buscarMenu(idMenu)
      if (!menu) throw new Error("Menu não encontrado após inserir item")
      return menu
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }
 
  async removerItem(idMenu: string, idItem: string): Promise<Menu> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
 
      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT * FROM Itens WHERE id_item = ? AND id_menu = ? AND excluido = 0`,
        [Number(idItem), Number(idMenu)]
      )
      const row = rows[0]
      if (!row) throw new Error("Item não encontrado")
 
      await conn.execute(
        `UPDATE Itens SET excluido = 1 WHERE id_item = ?`,
        [Number(idItem)]
      )
      await conn.commit()
 
      const menu = await this.buscarMenu(idMenu)
      if (!menu) throw new Error("Menu não encontrado após remover item")
      return menu
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }
 
  async atualizarItem(idMenu: string, item: ItemMenu): Promise<ItemMenu | null> {
    await pool.execute(
      `UPDATE Itens SET nome = ?, descricao = ?, valor = ? WHERE id_item = ? AND id_menu = ? AND excluido = 0`,
      [item.Nome, item.Descricao, item.Preco, Number(item.Id), Number(idMenu)]
    )
 
    return await this.buscarItem(idMenu, item.Id)
  }
}
