import { NextResponse } from "next/server"
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio"
import ServicoUsuario from "@/server/services/usuario.servico"
import { UsuarioPayload } from "@/lib/dtos/usuario"

const servicoUsuario = new ServicoUsuario(new RepositorioUsuario())

export async function POST(request: Request) {
  try {
    const payload: UsuarioPayload = await request.json()
    
    const { nome, email, senha, funcao } = payload
    if (!nome || !email || !senha || !funcao) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }
    
    await servicoUsuario.criarUsuario(payload)
    return NextResponse.json({ message: "Usuário criado com sucesso!" })

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Falha ao registrar usuário" },
      { status: 401 }
    )
  }
}
