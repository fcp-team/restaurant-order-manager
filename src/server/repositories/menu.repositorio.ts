import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ItemMenu } from "../classes/item-menu"
import { Menu } from "../classes/menu"

export interface IRepositorioMenu {
  criarMenu(menu: Menu): Promise<void>
  buscarMenu(id: string): Promise<Menu | null>
  atualizarMenu(menu: Menu): Promise<Menu>
  buscarItem(idMenu: string, idItem: string): Promise<ItemMenu | null>
  adicionarItem(idMenu: string, item: ItemMenu): Promise<Menu>
  removerItem(idMenu: string, idItem: string): Promise<Menu>
  atualizarItem(idMenu: string, item: ItemMenu): Promise<ItemMenu | null>
}

export class RepositorioMenu implements IRepositorioMenu {
  async criarMenu(pedido: Menu): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // const [res] = await conn.execute<ResultSetHeader>()

      await conn.commit()
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async buscarMenu(id: string): Promise<Menu | null> { }

  async atualizarMenu(menu: Menu): Promise<Menu> { }

  async buscarItem(idMenu: string, idItem: string): Promise<ItemMenu | null> { }

  async adicionarItem(idPedido: string, item: ItemMenu): Promise<Menu> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // await conn.execute<ResultSetHeader>()

      await conn.commit()

      const pedido = await this.buscarMenu(idPedido)
      if (!pedido) throw new Error("Pedido não encontrado após inserir item")
      return pedido
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async removerItem(idPedido: string, idItem: string): Promise<Menu> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT * FROM ItensPedidos WHERE id_pedido = ? AND id_itempedido = ? AND excluido = 0`,
        [Number(idPedido), Number(idItem)]
      )
      const row = rows[0]
      if (!row) throw new Error("Item do pedido não encontrado")

      await conn.execute(`UPDATE ItensPedidos SET excluido = 1 WHERE id_itempedido = ?`, [row.id_itempedido])
      await conn.commit()

      const pedido = await this.buscarMenu(idPedido)
      if (!pedido) throw new Error("Pedido não encontrado após remover item")
      return pedido
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async atualizarItem(idMenu: string, item: ItemMenu): Promise<ItemMenu> { }
}
