import { IRepositorioUsuario } from "../repositories/usuario.repositorio"
import { Usuario, Funcao } from "../classes/usuario"

export type UsuarioPayload = {
  nome: string
  email: string
  senha: string
}

export default class ServicoPedido {
  constructor(
    private repositorio: IRepositorioUsuario,
    // private autorizacao: ServicoAutorizacao
  ) { }
  
  async criarUsuario(usuario: UsuarioPayload): Promise<void> { }

  async buscarUsuario(id: string): Promise<Usuario> { }
  
  async listarUsuarios(): Promise<Usuario[]> { }

  async listarPorFuncao(funcao: Funcao): Promise<Usuario[]> { }

  async atualizarUsuario(id: string, payload: UsuarioPayload): Promise<Usuario> { }

  async removerUsuario(id: string): Promise<void> { }
}
