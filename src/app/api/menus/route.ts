import { NextResponse } from "next/server"
import { RepositorioMenu } from "@/server/repositories/menu.repositorio"
import ServicoMenu from "@/server/services/menu.servico"
 
const servicoMenu = new ServicoMenu(new RepositorioMenu())
 
export async function GET() {
  try {
    const menus = await servicoMenu.listarMenus()
    return NextResponse.json(menus)
  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao listar menus" },
      { status: 500 }
    )
  }
}