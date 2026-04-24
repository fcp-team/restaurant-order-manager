import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"

const servicoMenu = new ServicoMenu(new RepositorioMenu())

export async function PATCH(request: Request) {
  try {
    const { idMenu, idItem, payload } = await request.json()

    if (!idMenu || !idItem || !payload) {
      return NextResponse.json(
        { error: "Os campos 'idMenu', 'idItem' e 'payload' devem ser informados" },
        { status: 400 }
      )
    }

    const item = await servicoMenu.atualizarItem(idMenu, idItem, payload)
    return NextResponse.json(item)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao atualizar item do menu" },
      { status: 500 }
    )
  }
}