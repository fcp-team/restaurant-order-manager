import { Funcao } from "../enums/funcao"

export type UsuarioPayload = {
  nome: string
  email: string
  senha: string
  funcao: Funcao
}
