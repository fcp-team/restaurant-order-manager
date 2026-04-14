import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"
import { Funcao } from "@/server/classes/usuario"
import { requireRole } from "@/server/lib/auth"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    requireRole(
      request.headers.get("X-User-Token") || "",
      Funcao.GARCOM
    )

    const { idPedido, idItem, quantidade } = await request.json()

    if (!idPedido || !idItem || !quantidade) {
      return NextResponse.json(
        { error: "Os campos 'idPedido', 'idItem' e 'quantidade' devem ser informados" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.acrescentarItem(idPedido, idItem, quantidade)

    await fetch("http://localhost:3000/ws/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "pedido:acrescentar-item", payload: pedido })
    })

    return NextResponse.json(pedido)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao acrescentar item ao pedido" },
      { status: 500 }
    )
  }
}
