import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    const { idPedido, status } = await request.json()

    if (!idPedido || !status) {
      NextResponse.json(
        { error: "Os campos 'idPedido' e 'status' devem ser informados" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.alterarStatusPedido(idPedido, status)

    // TODO: ajustar mensagem de broadcast
    await fetch("http://localhost:8080/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: "itens-pedido:atualizar-status",
        payload: JSON.stringify(pedido)
      })
    })

    return NextResponse.json(pedido)

  } catch (reason) {
    console.log(reason)
    return NextResponse.json(
      { error: "Erro ao atualizar status do pedido" },
      { status: 500 }
    )
  }
}
