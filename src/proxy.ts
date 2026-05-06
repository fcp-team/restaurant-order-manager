import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { autorizar, verificarToken } from "./lib/auth";
import ServicoUsuario from "./server/services/usuario.servico";
import { RepositorioUsuario } from "./server/repositories/usuario.repositorio";
import { Funcao } from "./lib/enums/funcao";

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    if (pathname === "/") {
      const admins = await new ServicoUsuario(new RepositorioUsuario())
        .listarPorFuncao(Funcao.ADMIN) || []

      if (admins.length > 0) return NextResponse.redirect(new URL("/login", request.url))
      return NextResponse.redirect(new URL("/cadastro", request.url))
    }

    if (
      pathname.startsWith("/cadastro") ||
      pathname.startsWith("/api/auth/cadastrar")
    ) {
      const admins = await new ServicoUsuario(new RepositorioUsuario())
        .listarPorFuncao(Funcao.ADMIN) || []

      if (admins.length > 0) return NextResponse.json(
        { error: "Recurso indisponível" },
        { status: 404 }
      )
      return NextResponse.next()
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || ""

    const usuario = verificarToken(token)

    if (pathname.startsWith("/api/pedidos")) {
      return NextResponse.next()
    }

    const autorizado = autorizar(usuario, pathname)
    if (!autorizado) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    if (
      pathname.startsWith("/api/usuarios/") &&
      pathname.endsWith("/atualizar")
    ) {
      if (usuario.funcao === Funcao.ADMIN) return NextResponse.next()

      const idPattern = /\d+/
      const match = pathname.match(idPattern)
      const id = match ? match[0] : null
      
      if (String(id) !== String(usuario.id_usuario)) {
        return NextResponse.json(
          { error: "Acesso negado" },
          { status: 403 }
        )
      }
    }

    return NextResponse.next()

  } catch (reason) {
    console.log(reason)
    return NextResponse.json(
      { error: "Acesso negado" },
      { status: 403 }
    )
  }
}

export const config = {
  matcher: [
    "/api/pedido/:path*",
    "/api/pedidos",
    "/api/usuarios/:path*",
    "/api/auth/cadastrar",
    "/cadastro",
    "/",
    "/admin/:path*",
    "/garcom/:path*",
    "/cozinha/:path*"
  ]
}
