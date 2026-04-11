import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"
import { Funcao } from "@/server/classes/usuario"
import { requireRole } from "@/server/lib/auth"
import { cookies } from "next/headers"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || ""
    requireRole(token, Funcao.GARCOM)

    const params = new URL(request.url).searchParams
    console.log(params)

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
