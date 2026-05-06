import { NextRequest, NextResponse } from "next/server";
import ServicoUsuario from "@/server/services/usuario.servico";
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio";
import { UsuarioPayload } from "@/lib/dtos/usuario";
import { gerarToken } from "@/lib/auth";

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload: Partial<UsuarioPayload> = await request.json()

    const usuario = await servicoUsuario.atualizarUsuario(id, payload)
    const novoToken = gerarToken(usuario)

    const response = NextResponse.json(usuario)
    response.cookies.set("auth_token", novoToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600
    })

    return response

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Erro ao atualizar usuário: " + (reason as Error).message },
      { status: 500 }
    )
  }
}
