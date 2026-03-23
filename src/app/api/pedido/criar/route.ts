import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

import type { NovoPedidoPayload } from "@/server/services/pedido.servico"

const servico = new ServicoPedido(new RepositorioPedido())

const pedidoPayload: NovoPedidoPayload = {
  numeroMesa: "1",
  itens: [
    {
      idItemMenu: "1",
      quantidade: 2,
    },
    {
      idItemMenu: "2",
      quantidade: 5,
    },
    {
      idItemMenu: "3",
      quantidade: 1,
    },
  ]
}

export async function GET() {
  try {
    const pedido = await servico.buscarPedido("4")

    return NextResponse.json({
      response: pedido,
      success: true
  })

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { message: reason },
      { status: 500 }
    )
  }
}
