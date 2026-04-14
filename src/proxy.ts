import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ServicoAutenticacao } from "./server/services/autenticacao.servico";

const servicoAutenticacao = new ServicoAutenticacao()

export async function proxy(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || ""

    servicoAutenticacao.verificarToken(token)

    const { pathname } = request.nextUrl
    
    if (pathname.startsWith("/api/pedidos")) {
      return NextResponse.next()
    }

    const response = NextResponse.next()
    response.headers.set("X-User-Token", token)

    return response

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
  ]
}
