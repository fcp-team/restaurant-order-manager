import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { Usuario } from "../classes/usuario"
import { Funcao } from "@/lib/enums/funcao"

export interface IRepositorioUsuario {
  criarUsuario(usuario: Usuario): Promise<void>
  buscarUsuario(id: number): Promise<Usuario | null>
  removerUsuario(id: number): Promise<void>
  listarUsuarios(): Promise<Usuario[]>
  listarPorFuncao(funcao: Funcao): Promise<Usuario[]>
  atualizarUsuario(usuario: Usuario): Promise<Usuario>
}

export class RepositorioUsuario implements IRepositorioUsuario {

  async criarUsuario(usuario: Usuario): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const result = await conn.execute<ResultSetHeader>(
        `INSERT INTO Usuarios (nome, email, senha, funcao)
         VALUES (?, ?, ?, ?)`,
        [usuario.nome, usuario.email, usuario.senha, usuario.funcao]
      )

      usuario.id_usuario = String(result[0].insertId)

      await conn.commit()
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async buscarUsuario(id: number): Promise<Usuario | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Usuarios 
       WHERE id_usuario = ? AND excluido = 0`,
      [id]
    )

    if (rows.length === 0) return null

    const row = rows[0]

    return new Usuario(
      row.id_usuario,
      row.nome,
      row.email,
      row.senha,
      row.funcao as Funcao,
      Boolean(row.excluido)
    )
  }

  async listarUsuarios(): Promise<Usuario[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Usuarios WHERE excluido = 0`
    )

    return rows.map(row => new Usuario(
      row.id_usuario,
      row.nome,
      row.email,
      row.senha,
      row.funcao as Funcao,
      Boolean(row.excluido)
    ))
  }

  async listarPorFuncao(funcao: Funcao): Promise<Usuario[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Usuarios 
       WHERE funcao = ? AND excluido = 0`,
      [funcao]
    )

    return rows.map(row => new Usuario(
      row.id_usuario,
      row.nome,
      row.email,
      row.senha,
      row.funcao as Funcao,
      Boolean(row.excluido)
    ))
  }

  async atualizarUsuario(usuario: Usuario): Promise<Usuario> {
    await pool.execute(
      `UPDATE Usuarios 
       SET nome = ?, email = ?, senha = ?, funcao = ?
       WHERE id_usuario = ? AND excluido = 0`,
      [usuario.nome, usuario.email, usuario.senha, usuario.funcao, usuario.id_usuario]
    )

    return usuario
  }

  async removerUsuario(id: number): Promise<void> {
    await pool.execute(
      `UPDATE Usuarios 
       SET excluido = 1 
       WHERE id_usuario = ?`,
      [id]
    )
  }
}
