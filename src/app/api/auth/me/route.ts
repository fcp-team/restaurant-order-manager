import { NextResponse } from "next/server"
import { verificarToken } from "@/lib/auth"
import { RepositorioUsuario } from "@/server/repositories/usuario.repositorio"
import { cookies } from "next/headers"

const repositorio = new RepositorioUsuario()

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const payload = verificarToken(token)
    const usuario = await repositorio.buscarUsuario(payload.id_usuario)
    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      id_usuario: usuario.Id,
      nome: usuario.Nome,
      email: usuario.Email,
      funcao: usuario.Funcao,
    })
  } catch {
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}