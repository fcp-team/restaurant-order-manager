import { NextResponse } from "next/server"
import OrderService from "@/server/services/order.service"

const orderService = new OrderService()

export async function GET() {
  try {
    const orders = await orderService.listOrders()
    return NextResponse.json(orders)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    )
  }
}
