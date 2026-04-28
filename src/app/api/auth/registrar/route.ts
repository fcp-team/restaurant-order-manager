import { NextResponse } from "next/server"
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio"
import ServicoUsuario, { UsuarioPayload } from "@/server/services/usuario.servico"
import { gerarToken } from "@/lib/auth"

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())

export async function POST(request: Request) {
  try {
    const payload: UsuarioPayload = await request.json()
    const { email, senha } = payload

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const usuario = await servicoUsuario.criarUsuario(payload)
    const token = gerarToken(usuario)


    const response = NextResponse.json({ message: "Usuário registrado com sucesso!" })

    response.cookies.set("auth_token", token, {
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
      { error: "Falha ao registrar usuário" },
      { status: 401 }
    )
  }
}
