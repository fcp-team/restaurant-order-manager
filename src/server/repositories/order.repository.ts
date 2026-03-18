import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"

export type OrderStatus = "aberto" | "fechado" | "cancelado"

interface Order extends RowDataPacket {
  id: string
  table: number
  items: string[]
  total: number
  createdAt: Date
  status: OrderStatus
}

interface IOrderRepository {
  // save(order: Order): Promise<void>
  buscarPedido(id: string): Promise<Order | null>
  listarPedido(): Promise<Order[]>
  

  // listOrdersByStatus(status: OrderStatus): Promise<Order[]>
  // listOrdersByPeriod(start: Date, end: Date): Promise<Order[]>
}

export class OrderRepository implements IOrderRepository {
  async buscarPedido(id: string): Promise<Order | null> {
    const [rows] = await pool.query<Order[]>("SELECT * FROM Orders WHERE id_order = ?", [id])
    if (rows.length === 0) return null
    return rows[0]
  }

  async listarPedido(): Promise<Order[]> {
    const [rows] = await pool.query<Order[]>("SELECT * FROM Orders")
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
  async removerItem(orderId: number, menuItemId: number, quantity: number ){
    await pool.query(
       "DELETE FROM OrderItems (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
    [orderId, menuItemId]
    )}

  async listarPorStatus(status: string): Promise<Order[]> {
  const [rows] = await pool.query<Order[]>(
    "SELECT * FROM Orders WHERE status = ?",
    [status])

  return rows}
   
  async atualizarStatusPedido(id: string, status: OrderStatus): Promise<void> {
  await pool.query(
    "UPDATE Orders SET status = ? WHERE id_order = ?",
    [status, id])}
  

}
