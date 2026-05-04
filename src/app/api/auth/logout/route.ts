import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout realizado com sucesso!"
    })

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0
    })

    return response

  } catch (reason) {
    console.error(reason)
    return NextResponse.json(
      { error: "Falha ao realizar logout" },
      { status: 500 }
    )
  }
}
