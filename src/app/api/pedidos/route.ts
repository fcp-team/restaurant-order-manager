import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"
import { StatusPedido } from "@/server/classes/pedido"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    let pedidos = {}

    const status = searchParams.get("status")
    if (status) {
      pedidos = await servicoPedido.listarPorStatus(status as StatusPedido)
      return NextResponse.json(pedidos)
    }

    const dataInicio = new Date(searchParams.get("data-inicio") ?? new Date())
    const dataFim = new Date(searchParams.get("data-fim") ?? dataInicio)
  
    pedidos = await servicoPedido.listarPorPeriodo(dataInicio, dataFim)
    return NextResponse.json(pedidos)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    )
  }
}
