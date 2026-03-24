import { NextResponse } from "next/server"
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

// import { StatusPedido } from "@/server/classes/pedido"
import type { NovoPedidoItemPayload, NovoPedidoPayload } from "@/server/services/pedido.servico"
import { StatusItemPedido } from "@/server/classes/item-pedido"

const servico = new ServicoPedido(new RepositorioPedido())

const pedidoPayload: NovoPedidoPayload = {
  numeroMesa: "1",
  itens: [
    {
      idItemMenu: "1",
      quantidade: 2,
    },
    {
      idItemMenu: "2",
      quantidade: 5,
    },
    {
      idItemMenu: "3",
      quantidade: 1,
    },
  ]
}

const itemPayload: NovoPedidoItemPayload = {
  idItemMenu: "5",
  quantidade: 2,
  observacao: "Sem cebola"
}

export async function GET() {
  try {
    const pedido = await servico.alterarStatusItem("4", "11", StatusItemPedido.PRONTO)

    return NextResponse.json({
      response: pedido,
      success: true
    })

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { message: reason },
      { status: 500 }
    )
  }
}
