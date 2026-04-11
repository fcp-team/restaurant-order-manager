import { Funcao } from "@/server/classes/usuario"
import { ServicoAutenticacao, TokenPayload } from "@/server/services/autenticacao.servico"
import { ServicoAutorizacao } from "@/server/services/autorizacao.servico"

const autenticacaoServico = new ServicoAutenticacao()
const autorizacaoServico = new ServicoAutorizacao()

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = "AuthError"
  }
}

export function requireAuth(request: Request): TokenPayload {
  const token = autenticacaoServico.extrairToken(request)
  if (!token) {
    throw new AuthError("Token de autenticação não encontrado", 401)
  }

  return autenticacaoServico.verificarToken(token)
}

export function requireRole(token: string, funcao: Funcao): TokenPayload {
  const usuario = autenticacaoServico.verificarToken(token)
  const autorizado = autorizacaoServico.autorizar(usuario, funcao)

  if (!autorizado) {
    throw new AuthError("Usuário não autorizado", 403)
  }

  return usuario
}
