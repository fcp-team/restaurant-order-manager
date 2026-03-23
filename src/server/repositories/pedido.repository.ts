import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"
import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"


interface PedidoRow extends RowDataPacket {
  id_order: number
  table_number: number
  createdAt: Date
}

interface IPedidoRepository {
  buscarPedido(id: string): Promise<Pedido | null>
  listarPedido(): Promise<Pedido[]>
  criarPedido(table: number): Promise<any>
  adicionarItem(orderId: number, menuItemId: number, quantity: number): Promise<void>
  removerItem(orderId: number, menuItemId: number): Promise<void>
  listarPorStatus(status: StatusPedido): Promise<Pedido[]>
  listarPorPeriodo(start: Date, end: Date): Promise<Pedido[]>
  atualizarStatusPedido(id: string, status: StatusPedido): Promise<void>
}

export class PedidoRepository implements IPedidoRepository {


  async buscarPedido(id: string): Promise<Pedido | null> {
  const [rows] = await pool.query<any[]>(
    "SELECT * FROM Orders WHERE id_order = ?",
    [id]
  )

  if (rows.length === 0) return null

  const data = rows[0]

  const pedido = new Pedido(
    data.id_order,
    data.table_number,
    data.createdAt
  )

  // buscar itens do pedido
  const [items] = await pool.query<any[]>(
    `SELECT 
        oi.id,
        oi.menu_item_id,
        oi.quantity,
        oi.status,
        m.name,
        m.price
     FROM OrderItems oi
     JOIN MenuItems m ON m.id = oi.menu_item_id
     WHERE oi.order_id = ?`,
    [id]
  )

  //mapear itens
  items.forEach(item => {
    const itemPedido = new ItemPedido(
      item.id,
      item.menu_item_id,
      item.name,
      item.quantity,
      item.price,
      undefined, 
      item.status as StatusItemPedido
    )
      
    )

    pedido.adicionarItem(itemPedido)
  })

  return pedido
}

 async listarPedido(): Promise<Pedido[]> {
  const [rows] = await pool.query<any[]>("SELECT * FROM Orders")

  const pedidos: Pedido[] = []

  for (const data of rows) {
    const pedido = new Pedido(
      data.id_order,
      data.table_number,
      data.createdAt
    )

    // buscar itens desse pedido
    const [items] = await pool.query<any[]>(
      `SELECT 
          oi.id,
          oi.menu_item_id,
          oi.quantity,
          oi.status,
          m.name,
          m.price
       FROM OrderItems oi
       JOIN MenuItems m ON m.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [data.id_order]
    )

    items.forEach(item => {
      const itemPedido = new ItemPedido(
        item.id,
        item.menu_item_id,
        item.name,
        item.quantity,
        item.price,
        undefined,
        item.status
      )

      pedido.adicionarItem(itemPedido)
    })

    pedidos.push(pedido)
  }

  return pedidos
}

 async criarPedido(table: number): Promise<Pedido> {
  const [result]: any = await pool.query(
    "INSERT INTO Orders (table_number, total, createdAt, status) VALUES (?, ?, NOW(), ?)",
    [table, 0, "ABERTO"]
  )

  const id = result.insertId

  const pedido = new Pedido(
    id,
    table,
    new Date()
  )

  return pedido
}
  
  async adicionarItem(orderId: number, menuItemId: number, quantity: number) {

  await pool.query(
    "INSERT INTO OrderItems (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
    [orderId, menuItemId, quantity]
  )

}
  async removerItem(orderId: number, menuItemId: number) {
    await pool.query(
      "DELETE FROM OrderItems WHERE order_id = ? AND menu_item_id = ?",
      [orderId, menuItemId]
    )
  }

  async listarPorStatus(status: string): Promise<Pedido[]> {
  const [rows] = await pool.query<any[]>(
    "SELECT * FROM Orders WHERE status = ?",
    [status]
  )

  return rows.map(data =>
    new Pedido(
      data.id_order,
      data.table_number,
      data.createdAt
    )
  )
}
   
 async atualizarStatusPedido(id: string, status: StatusPedido): Promise<void> {
  await pool.query(
    "UPDATE Orders SET status = ? WHERE id_order = ?",
    [status, id]
  )
}
    
  async listarPorPeriodo(start: Date, end: Date): Promise<Pedido[]> {
  const [rows] = await pool.query<any[]>(
    "SELECT * FROM Orders WHERE createdAt BETWEEN ? AND ?",
    [start, end]
  )

  return rows.map(data =>
    new Pedido(
      data.id_order,
      data.table_number,
      data.createdAt
    )
  )
} }
