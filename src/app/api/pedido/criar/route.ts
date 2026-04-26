import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function POST(request: Request) {
  try {
    const novoPedido = await request.json()

    if (!novoPedido) {
      return NextResponse.json(
        { error: "O campo 'novoPedido' deve ser informado" },
        { status: 400 }
      )
    }

    const pedido = await servicoPedido.criarPedido(novoPedido)

    await fetch("http://localhost:3000/ws/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "pedido:criar", payload: pedido })
    })

    return NextResponse.json(pedido)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    )
  }
}
