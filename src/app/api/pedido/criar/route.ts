import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const pedido = await request.json()
    console.log(pedido)

    // TODO: validar e salvar pedido no banco de dados

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
