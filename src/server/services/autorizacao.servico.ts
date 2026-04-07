import { Funcao, Usuario } from "../classes/usuario"

export interface IServicoAutorizacao {
  autorizar(usuario: Usuario, funcao: Funcao): boolean
}

export class ServicoAutorizacao implements IServicoAutorizacao {
  autorizar(usuario: Usuario, funcao: Funcao): boolean {
    return usuario.Funcao === funcao
  }
}
