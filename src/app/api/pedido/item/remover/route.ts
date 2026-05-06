import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function DELETE(request: Request) {
  try {
    const params = new URL(request.url).searchParams

    const idPedido = params.get("id-pedido")
    const idItem = params.get("id-item")

    if (!idPedido || !idItem) {
      return NextResponse.json(
        { error: "Os parâmetros 'id-pedido' e 'id-item' são obrigatórios" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.removerItem(idPedido, idItem)

    await fetch("http://localhost:3000/ws/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "pedido:remover-item", payload: pedido })
    })

    return NextResponse.json(pedido)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao remover item do pedido" },
      { status: 500 }
    )
  }
}
