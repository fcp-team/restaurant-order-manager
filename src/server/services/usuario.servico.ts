import bcrypt from 'bcrypt'

import { IRepositorioUsuario } from "../repositories/usuario.repositorio"
import { Usuario } from "../classes/usuario"
import { UsuarioPayload } from "@/lib/dtos/usuario"
import { Funcao } from "@/lib/enums/funcao"

export default class ServicoUsuario {
  constructor(
    private repositorio: IRepositorioUsuario,
  ) { }
  
  async criarUsuario(usuario: UsuarioPayload): Promise<Usuario> {
    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.funcao) {
      throw new Error("Todos os campos são obrigatórios")
    }

    if (!usuario.email.includes("@")) {
      throw new Error("Email inválido")
    }

    if (!Object.values(Funcao).includes(usuario.funcao)) {
      throw new Error("Função inválida")
    }

    const saltRounds = 10
    const senhaHash = await bcrypt.hash(usuario.senha, saltRounds)
    
    const novoUsuario = new Usuario(
      "0",
      usuario.nome,
      usuario.email,
      senhaHash,
      usuario.funcao
    )
    
    await this.repositorio.criarUsuario(novoUsuario)
    return novoUsuario
  }
  
  async autenticarUsuario(email: string, senha: string): Promise<Usuario> {
    if (!email || !senha) {
      throw new Error("Email e senha são obrigatórios")
    }

    if (!email.includes("@")) {
      throw new Error("Email inválido")
    }

    const usuario = await this.repositorio.buscarPorEmail(email)
    if (!usuario) throw new Error("Credenciais inválidas")

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) throw new Error("Credenciais inválidas")

    return usuario
  }
  
  async buscarUsuario(id: string): Promise<Usuario> {
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

  async atualizarUsuario(id: string, payload: Partial<UsuarioPayload>): Promise<Usuario> {
    const { nome, email, senha, funcao } = payload

    if (!nome && !email && !senha && !funcao) {
      throw new Error("Pelo menos um campo deve ser fornecido para atualização")
    }

    if (email && !email.includes("@")) {
      throw new Error("Email inválido")
    }

    const usuario = await this.repositorio.buscarUsuario(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    usuario.nome = nome ?? usuario.nome
    usuario.email = email ?? usuario.email
    usuario.senha = senha ?? usuario.senha
    usuario.funcao = funcao ?? usuario.funcao

    return await this.repositorio.atualizarUsuario(usuario)
  }

  async removerUsuario(id: string): Promise<void> {
    const usuario = await this.repositorio.buscarUsuario(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    await this.repositorio.removerUsuario(id)
  }
}
