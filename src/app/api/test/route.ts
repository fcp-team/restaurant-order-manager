import { NextResponse } from "next/server"
import { RowDataPacket } from "mysql2"
import pool from "@/lib/db"
// import OrderService from "@/server/services/order.service"
import { OrderRepository } from "@/server/repositories/order.repository"

interface User extends RowDataPacket {
  id: number
  name: string
  email: string
}

export async function GET() {
  try {
    const orderRepo = new OrderRepository()
    // const orders = await orderRepo.listOrders()
    const order = await orderRepo.getOrder("1")

    return NextResponse.json(order)

  } catch (reason) {
    console.error(reason)
    
    return NextResponse.json(
      {error: "Erro ao buscar pedidos"},
      {status: 500}
    )
  }
}
