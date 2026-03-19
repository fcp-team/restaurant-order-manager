import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"
import { StatusPedido } from "../classes/pedido"

interface Pedido extends RowDataPacket {
  id: string
  table: number
  items: string[]
  total: number
  createdAt: Date
  status: StatusPedido
}

export interface IOrderRepository {
  buscarPedido(id: string): Promise<Pedido | null>
  listarPedido(): Promise<Pedido[]>
  listPedidosPorStatus(status: StatusPedido): Promise<Pedido[]>
}

export class OrderRepository implements IOrderRepository {
  async buscarPedido(id: string): Promise<Pedido | null> {
    const [rows] = await pool.query<Pedido[]>("SELECT * FROM Orders WHERE id_order = ?", [id])
    if (rows.length === 0) return null
    return rows[0]
  }

  async listarPedido(): Promise<Pedido[]> {
    const [rows] = await pool.query<Pedido[]>("SELECT * FROM Orders")
    return rows
  }

  async criarPedido(table: number) {
    const [result] = await pool.query(
      "INSERT INTO Orders (table_number, total, createdAt, status) VALUES (?, ?, NOW(), ?)",
      [table, 0, "aberto"]
    )

    return result
  }

  async adicionarItem(orderId: number, menuItemId: number, quantity: number) {

    await pool.query(
      "INSERT INTO OrderItems (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
      [orderId, menuItemId, quantity]
    )

  }
  async removerItem(orderId: number, menuItemId: number, quantity: number) {
    await pool.query(
      "DELETE FROM OrderItems (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
      [orderId, menuItemId]
    )
  }

  async listarPorStatus(status: string): Promise<Pedido[]> {
    const [rows] = await pool.query<Pedido[]>(
      "SELECT * FROM Orders WHERE status = ?",
      [status])

    return rows
  }

  async atualizarStatusPedido(id: string, status: OrderStatus): Promise<void> {
    await pool.query(
      "UPDATE Orders SET status = ? WHERE id_order = ?",
      [status, id])
  }
}
