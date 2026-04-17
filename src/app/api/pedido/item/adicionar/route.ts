import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function POST(request: Request) {
  try {
    const { idPedido, novoItem } = await request.json()

    if (!idPedido || !novoItem) {
      return NextResponse.json(
        { error: "Os campos 'idPedido' e 'novoItem' devem ser informados" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.adicionarItem(novoItem.idPedido, novoItem.item)

    await fetch("http://localhost:3000/ws/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "pedido:adicionar-item", payload: pedido })
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
