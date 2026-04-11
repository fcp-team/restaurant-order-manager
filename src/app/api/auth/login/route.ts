import { NextResponse } from "next/server"
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio"
import ServicoUsuario from "@/server/services/usuario.servico"
import { ServicoAutenticacao } from "@/server/services/autenticacao.servico"

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())
const servicoAutenticacao = new ServicoAutenticacao()

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
    const token = servicoAutenticacao.gerarToken(usuario)

    const response = NextResponse.json({ message: "Login realizado com sucesso!" })

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
