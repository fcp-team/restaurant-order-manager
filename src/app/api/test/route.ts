import { NextResponse } from "next/server"
import { InMemoryRepositorioPedido } from "@/server/repositories/pedido.repositorio"
import ServicoPedido from "@/server/services/pedido.servico"

const service = new ServicoPedido(
  new InMemoryRepositorioPedido()
)

const pedidoPayload = {
  numeroMesa: 1,
  itens: [
    {
      idItemMenu: "1",
      quantidade: 2,
    },
    {
      idItemMenu: "15",
      quantidade: 1,
      observacao: "Sem cebola"
    },
  ]
}

export async function GET() {
  try {
    await service.criarPedido(pedidoPayload)
    let pedido = await service.buscarPedido("1")

    await service.adicionarItem(String(pedido.Id), "1", 2)
    pedido = await service.buscarPedido("1")

    return NextResponse.json({ pedido })

  } catch (reason) {
    console.error(reason)

    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    )
  }

}
