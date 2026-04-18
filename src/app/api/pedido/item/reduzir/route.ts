import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    const { idPedido, idItem, quantidade } = await request.json()

    if (!idPedido || !idItem || !quantidade) {
      return NextResponse.json(
        { error: "Os campos 'idPedido', 'idItem' e 'quantidade' devem ser informados" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.reduzirItem(idPedido, idItem, quantidade)

    await fetch("http://localhost:3000/ws/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "pedido:reduzir-item", payload: pedido })
    })

    return NextResponse.json(pedido)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao reduzir item ao pedido" },
      { status: 500 }
    )
  }
}
