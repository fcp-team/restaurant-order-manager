import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"
import { Funcao } from "@/server/classes/usuario"
import { requireRole } from "@/server/lib/auth"
import { cookies } from "next/headers"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || ""
    requireRole(token, Funcao.GARCOM)

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
