import { Funcao, Usuario } from "../classes/usuario"
import type { TokenPayload } from "./autenticacao.servico"

export interface IServicoAutorizacao {
  autorizar(usuario: TokenPayload, funcao: Funcao): boolean
}

export class ServicoAutorizacao implements IServicoAutorizacao {
  autorizar(usuario: TokenPayload, funcao: Funcao): boolean {
    return usuario.funcao.toLocaleUpperCase() === funcao
  }
}
