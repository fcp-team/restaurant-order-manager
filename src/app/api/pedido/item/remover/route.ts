import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function DELETE(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    console.log(params)

    const idPedido = params.get("id-pedido") ?? ""
    const idItem = params.get("id-item") ?? ""
    const pedido = await servicoPedido.removerItem(idPedido, idItem)

    await fetch("http://localhost:8080/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido)
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
