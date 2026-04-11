import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"

const servicoMenu = new ServicoMenu(new RepositorioMenu())

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    const idMenu = params.get("id-menu")

    if (!idMenu) {
      return NextResponse.json(
        { error: "O parâmetro 'id-menu' é obrigatório" },
        { status: 400 }
      )
    }

    const menu = await servicoMenu.buscarMenu(idMenu)
    return NextResponse.json(menu)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao buscar menu" },
      { status: 500 }
    )
  }
}