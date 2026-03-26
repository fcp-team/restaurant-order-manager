export enum Funcao {
  ADMIN = "ADMIN",
  GARCOM = "GARCOM",
  COZINHA = "COZINHA"
}

export class Usuario {
  private id: string | null = null

  constructor(
    private nome: string,
    private email: string,
    private funcao: Funcao
  ) { }

  get Id() { return String(this.id) }

  set Id(valor: string) {
    if (this.id) throw new Error("Não é possível atribuir um novo id ao usuário")
    this.id = valor
  }

  get Nome() { return this.nome }

  get Email() { return this.email }
  
  get Funcao() { return this.funcao }
}
