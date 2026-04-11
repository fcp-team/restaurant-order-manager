import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"

const servicoMenu = new ServicoMenu(new RepositorioMenu())

export async function POST(request: Request) {
  try {
    const novoMenu = await request.json()

    if (!novoMenu) {
      return NextResponse.json(
        { error: "O campo 'novoMenu' deve ser informado" },
        { status: 400 }
      )
    }

    const menu = await servicoMenu.criarMenu(novoMenu)
    return NextResponse.json(menu)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao criar menu" },
      { status: 500 }
    )
  }
}