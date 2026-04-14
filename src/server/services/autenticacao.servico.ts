import jwt, { Secret } from "jsonwebtoken"
import { Funcao, Usuario } from "../classes/usuario"

export type TokenPayload = {
  id_usuario: string
  email: string
  funcao: Funcao
}

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev-secret"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d"

export class ServicoAutenticacao {
  gerarToken(usuario: Usuario): string {
    const payload: TokenPayload = {
      id_usuario: usuario.Id,
      email: usuario.Email,
      funcao: usuario.Funcao,
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  verificarToken(token: string): TokenPayload {
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
}
