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

    // TODO: ajustar mensagem de broadcast
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
      { error: "Erro ao criar pedido" },
      { status: 500 }
    )
  }
}
