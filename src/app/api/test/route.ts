import { NextResponse } from "next/server"
import { RowDataPacket } from "mysql2"
import pool from "@/lib/db"

import OrderService from "@/server/services/pedido.service"
import { AuthorizationService } from "@/server/services/authorization.service"
import { PedidoRepository } from "@/server/repositories/pedido.repository"

interface User extends RowDataPacket {
  id: number
  name: string
  email: string
}

export async function GET() {
  try {
    const repositorioPedido = new PedidoRepository()
    const orders = await repositorioPedido.listarPedido()
    const pedido = await repositorioPedido.buscarPedido("1")
    const SerivcoAutorizacao = new AuthorizationService()
   
    const orderService = new OrderService(repositorioPedido, SerivcoAutorizacao)



    return NextResponse.json(pedido)

  } catch (reason) {
    console.error(reason)
    
    return NextResponse.json(
      {error: "Erro ao buscar pedidos"},
      {status: 500}
    )
  }
 
}
