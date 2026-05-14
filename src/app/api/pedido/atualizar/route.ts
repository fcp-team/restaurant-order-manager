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

    const pedido = await servicoPedido.atualizarPedido(pedidoAtualizado)
    return NextResponse.json(pedido)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao atualizar pedido: " + (error as Error).message },
      { status: 500 }
    )
  }
}
