import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    const payload = await request.json()
    console.log(payload)

    // TODO: atualizar itens do pedido no banco de dados
    const pedido = await servicoPedido.alterarStatusPedido(payload.idPedido, payload.status)

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
