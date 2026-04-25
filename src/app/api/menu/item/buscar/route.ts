import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"

const servicoMenu = new ServicoMenu(new RepositorioMenu())

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    const idMenu = params.get("id-menu")
    const idItem = params.get("id-item")

    if (!idMenu || !idItem) {
      return NextResponse.json(
        { error: "Os parâmetros 'id-menu' e 'id-item' são obrigatórios" },
        { status: 400 }
      )
    }

    const item = await servicoMenu.buscarItem(idMenu, idItem)
    return NextResponse.json(item)

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao buscar item do menu" },
      { status: 500 }
    )
  }
}