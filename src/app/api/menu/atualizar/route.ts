import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"

const servicoMenu = new ServicoMenu(new RepositorioMenu())

export async function PATCH(request: Request) {
  try {
    const { idMenu, payload } = await request.json()

    if (!idMenu || !payload) {
      return NextResponse.json(
        { error: "Os campos 'idMenu' e 'payload' devem ser informados" },
        { status: 400 }
      )
    }

    const menu = await servicoMenu.atualizarMenu(idMenu, payload)
    return NextResponse.json(menu)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao atualizar menu" },
      { status: 500 }
    )
  }
}