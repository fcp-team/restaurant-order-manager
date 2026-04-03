import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    const { idPedido, idItem, status } = await request.json()

    if (!idPedido || !idItem || !status) {
      return NextResponse.json(
        { error: "Os campos 'idPedido', 'idItem' e 'status' devem ser informados" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.alterarStatusItem(idPedido, idItem, status)

    // TODO: ajustar mensagem de broadcast
    await fetch("http://localhost:3000/ws/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: "itens-pedido:atualizar-status",
        payload: JSON.stringify({ type: "pedido:atualizar-status-item", payload: pedido })
      })
    })

    return NextResponse.json(pedido)

  } catch (reason) {
    console.log(reason)
    return NextResponse.json(
      { error: "Erro ao atualizar status do item" },
      { status: 500 }
    )
  }
}
