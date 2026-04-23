import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"

const servicoMenu = new ServicoMenu(new RepositorioMenu())

export async function POST(request: Request) {
  try {
    const { idMenu, item } = await request.json()

    if (!idMenu || !item) {
      return NextResponse.json(
        { error: "Os campos 'idMenu' e 'item' devem ser informados" },
        { status: 400 }
      )
    }

    const menu = await servicoMenu.adicionarItem(idMenu, item)
    return NextResponse.json(menu)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao adicionar item ao menu" },
      { status: 500 }
    )
  }
}