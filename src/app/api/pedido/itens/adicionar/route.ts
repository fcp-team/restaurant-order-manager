import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

import type { NovoPedidoItemPayload } from "@/server/services/pedido.servico"

type NovoItemPayload = {
  idPedido: string,
  item: NovoPedidoItemPayload
}

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function POST(request: Request) {
  try {
    const novoItem: NovoItemPayload = await request.json()
    console.log(novoItem)

    const pedido = await servicoPedido.adicionarItem(novoItem.idPedido, novoItem.item)

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
      { error: "Erro ao adicionar item ao pedido" },
      { status: 500 }
    )
  }
}
