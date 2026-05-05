import { NextRequest, NextResponse } from "next/server";
import ServicoUsuario from "@/server/services/usuario.servico";
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio";

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())

export async function DELETE(request: NextRequest) {
  try {
    const params = new URL(request.url).searchParams
    const id = params.get("id")

    if (!id) return NextResponse.json(
      { error: "O parâmetro 'id' é obrigatório" },
      { status: 400 }
    )

    await servicoUsuario.removerUsuario(id)
    return NextResponse.json({ message: "Usuário removido com sucesso" })

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao remover usuário: " + (reason as Error).message },
      { status: 500 }
    )
  }
}
