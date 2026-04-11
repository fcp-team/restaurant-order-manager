import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"
import { requireRole } from "@/server/lib/auth"
import { Funcao } from "@/server/classes/usuario"
import { cookies } from "next/headers"


const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || ""
    requireRole(token, Funcao.COZINHA)

    const { idPedido, idItem, status } = await request.json()

    if (!idPedido || !idItem || !status) {
      return NextResponse.json(
        { error: "Os campos 'idPedido', 'idItem' e 'status' devem ser informados" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.alterarStatusItem(idPedido, idItem, status)

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
