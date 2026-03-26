import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { Usuario, Funcao } from "../classes/usuario"

export interface IRepositorioUsuario {
  criarUsuario(usuario: Usuario): Promise<void>
  buscarUsuario(id: string): Promise<Usuario | null>
  removerUsuario(id: string): Promise<void>
  listarUsuarios(): Promise<Usuario[]>
  listarPorFuncao(funcao: Funcao): Promise<Usuario[]>
  atualizarUsuario(usuario: Usuario): Promise<Usuario>
}

export class RepositorioUsuario implements IRepositorioUsuario {
  async criarUsuario(usuario: Usuario): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // const [res] = await conn.execute<ResultSetHeader>()

      await conn.commit()
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async buscarUsuario(id: string): Promise<Usuario | null> { }
  
  async listarUsuarios(): Promise<Usuario[]> { }

  async listarPorFuncao(funcao: Funcao): Promise<Usuario[]> { }

  async atualizarUsuario(usuario: Usuario): Promise<Usuario> { }

  async removerUsuario(id: string): Promise<void> { }
}
