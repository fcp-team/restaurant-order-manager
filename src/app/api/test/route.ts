import { NextResponse } from "next/server"
import { RowDataPacket } from "mysql2"
import pool from "@/lib/db"

interface User extends RowDataPacket {
  id: number
  name: string
  email: string
}

export async function GET() {
  try {
    const [rows] = await pool.query<User[]>("SELECT * FROM Users")
    return NextResponse.json(rows)

  } catch (reason) {
    console.error(reason)
    
    return NextResponse.json(
      {error: "Erro ao buscar usuários"},
      {status: 500}
    )
  }
}
