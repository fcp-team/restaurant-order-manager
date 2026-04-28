import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { autorizar, verificarToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || ""

    const usuario = verificarToken(token)

    const { pathname } = request.nextUrl

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
    // "/api/auth/registrar"
  ]
}
