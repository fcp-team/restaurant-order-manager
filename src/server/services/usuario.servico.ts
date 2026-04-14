import { IRepositorioUsuario } from "../repositories/usuario.repositorio"
import { Usuario, Funcao } from "../classes/usuario"

export type UsuarioPayload = {
  nome: string
  email: string
  senha: string
  funcao: Funcao
}

export default class ServicoUsuario {
  constructor(
    private repositorio: IRepositorioUsuario,
  ) { }
  
  async criarUsuario(usuario: UsuarioPayload): Promise<Usuario> {
    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.funcao) {
      throw new Error("Todos os campos são obrigatórios")
    }
    
    const novoUsuario = new Usuario(
      "0",
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.funcao
    )
    
    await this.repositorio.criarUsuario(novoUsuario)
    return novoUsuario
  }
  
  async autenticarUsuario(email: string, senha: string): Promise<Usuario> {
    if (!email || !senha) {
      throw new Error("Email e senha são obrigatórios")
    }

    const usuarios = await this.repositorio.listarUsuarios()
    const usuario = usuarios.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    )

    if (!usuario || usuario.senha !== senha) {
      throw new Error("Credenciais inválidas")
    }

    return usuario
  }
  
  async buscarUsuario(id: number): Promise<Usuario> {
    const usuario = await this.repositorio.buscarUsuario(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }
    
    return usuario
  }
  
  async listarUsuarios(): Promise<Usuario[]> {
    return await this.repositorio.listarUsuarios()
  }

  async listarPorFuncao(funcao: Funcao): Promise<Usuario[]> {
    return await this.repositorio.listarPorFuncao(funcao)
  }

  async atualizarUsuario(id: number, payload: UsuarioPayload): Promise<Usuario> {
    const usuario = await this.repositorio.buscarUsuario(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    usuario.nome = payload.nome ?? usuario.nome
    usuario.email = payload.email ?? usuario.email
    usuario.senha = payload.senha ?? usuario.senha

    return await this.repositorio.atualizarUsuario(usuario)
  }

  async removerUsuario(id: number): Promise<void> {
    const usuario = await this.repositorio.buscarUsuario(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    await this.repositorio.removerUsuario(id)
  }
}
