import { NextRequest, NextResponse } from "next/server";
import ServicoPedido from "@/server/services/pedido.servico";
import { RepositorioPedido } from "@/server/repositories/pedido.repositorio";
import { PedidoAtualizadoDTO } from "@/lib/dtos/pedido";

const servicoPedido = new ServicoPedido(new RepositorioPedido())

export async function PATCH(request: NextRequest) {
  try {
    const pedidoAtualizado: PedidoAtualizadoDTO = await request.json()

    if (!pedidoAtualizado.id) return NextResponse.json(
      { error: "ID do pedido não informado" },
      { status: 400 }
    )

    if (pedidoAtualizado.itensAdicionados !== undefined) {
      await servicoPedido.adicionarItens(pedidoAtualizado.id, pedidoAtualizado.itensAdicionados)
    }

    if (pedidoAtualizado.itensRemovidos !== undefined) {
      await servicoPedido.removerItens(pedidoAtualizado.id, pedidoAtualizado.itensRemovidos)
    }

    return NextResponse.json({ message: "Pedido atualizado" })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao atualizar pedido: " + (error as Error).message },
      { status: 500 }
    )
  }
}
