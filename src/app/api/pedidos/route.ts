import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

const dataFim = new Date()
const dataInicio = new Date(dataFim.getTime() - 24 * 3600000)

export async function GET() {
  try {
    const pedidos = await servicoPedido.listarPorPeriodo(dataInicio, dataFim)
    return NextResponse.json(pedidos)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    )
  }
}
