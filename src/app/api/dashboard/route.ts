import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function GET() {
  try {
    const inicio = new Date("2000-01-01")
    const fim = new Date()

    const pedidos = await servicoPedido.listarPorPeriodo(inicio, fim)

    return NextResponse.json(pedidos)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro no dashboard" },
      { status: 500 }
    )
  }
}