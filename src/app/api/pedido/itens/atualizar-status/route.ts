import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  try {
    const { itens } = await request.json()
    console.log(itens)

    // TODO: atualizar itens do pedido no banco de dados

    await fetch("http://localhost:8080/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: "itens-pedido:atualizar-status",
        payload: { itens }
      })
    })

    return NextResponse.json({ success: true })

  } catch (reason) {
    console.log(reason)
    return NextResponse.json(
      { error: "Erro ao atualizar status dos itens" },
      { status: 500 }
    )
  }
}
