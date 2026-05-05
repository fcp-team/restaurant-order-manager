import jwt, { Secret, SignOptions } from "jsonwebtoken"
import { Usuario } from "@/server/classes/usuario"
import { Funcao } from "./enums/funcao"

const rotasPorFuncao: Record<Funcao, string[]> = {
  [Funcao.ADMIN]: [
    "",
  ],
  [Funcao.GARCOM]: [
    "/garcom",
    "/api/pedido/criar",
    "/api/pedido/atualizar-status",
    "/api/pedido/item/adicionar",
    "/api/pedido/item/acrescentar",
    "/api/pedido/item/remover",
    "/api/pedido/item/reduzir",
    "/api/pedido/item/adicionar",
    // "/api/usuarios/[id]/atualizar",
  ],
  [Funcao.COZINHA]: [
    "/cozinha",
    "/api/pedido/item/atualizar-status",
    // "/api/usuarios/[id]/atualizar",
  ]
}

export type TokenPayload = {
  id_usuario: string
  email: string
  funcao: Funcao
}

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = "AuthError"
  }
}

export function autorizar(usuario: TokenPayload, pathname: string): boolean {
  const rotasPermitidas = rotasPorFuncao[usuario.funcao] || []
  return rotasPermitidas.some(rota => pathname.startsWith(rota))
}

const JWT_SECRET = process.env.JWT_SECRET as Secret
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"]

export function gerarToken(usuario: Usuario): string {
  const payload: TokenPayload = {
    id_usuario: usuario.Id,
    email: usuario.Email,
    funcao: usuario.Funcao,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verificarToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET)

  if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) {
    throw new Error("Token inválido")
  }

  const { id_usuario, email, funcao } = decoded as TokenPayload
  if (!id_usuario || !email || !funcao) {
    throw new Error("Token inválido")
  }

  return { id_usuario, email, funcao }
}
