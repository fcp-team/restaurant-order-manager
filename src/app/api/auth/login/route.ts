import { NextResponse } from "next/server"
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio"
import ServicoUsuario from "@/server/services/usuario.servico"
import { gerarToken } from "@/lib/auth"
import { Funcao } from "@/lib/enums/funcao"

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())

const rotas = {
  [Funcao.ADMIN]: "/admin",
  [Funcao.GARCOM]: "/garcom",
  [Funcao.COZINHA]: "/cozinha"
}

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const usuario = await servicoUsuario.autenticarUsuario(email, senha)
    const token = gerarToken(usuario)

    const route = rotas[usuario.funcao] || "/"

    const response = NextResponse.json({
      message: "Login realizado com sucesso!",
      redirectTo: route
    })

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
      { error: "Falha ao autenticar usuário" },
      { status: 401 }
    )
  }
}
