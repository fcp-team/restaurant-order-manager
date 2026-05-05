import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio";
import ServicoUsuario from "@/server/services/usuario.servico";
import { NextRequest, NextResponse } from "next/server";

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())

export async function GET(request: NextRequest) {
  try {
    const usuarios = await servicoUsuario.listarUsuarios()
    return NextResponse.json(usuarios)
    
  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao listar usuários" },
      { status: 500 }
    )
  }
}
