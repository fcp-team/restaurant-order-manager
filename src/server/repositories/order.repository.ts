import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"

type OrderStatus = "open" | "closed" | "cancelled"

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
  getOrder(id: string): Promise<Order | null>
  listOrders(): Promise<Order[]>
  // listOrdersByStatus(status: OrderStatus): Promise<Order[]>
  // listOrdersByPeriod(start: Date, end: Date): Promise<Order[]>
}

export class OrderRepository implements IOrderRepository {
  async getOrder(id: string): Promise<Order | null> {
    const [rows] = await pool.query<Order[]>("SELECT * FROM Orders WHERE id_order = ?", [id])
    if (rows.length === 0) return null
    return rows[0]
  }

  async listOrders(): Promise<Order[]> {
    const [rows] = await pool.query<Order[]>("SELECT * FROM Orders")
    return rows
  }
}
