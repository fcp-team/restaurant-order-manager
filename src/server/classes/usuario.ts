export enum Funcao {
  ADMIN = "ADMIN",
  GARCOM = "GARCOM",
  COZINHA = "COZINHA"
}

export class Usuario {

  constructor(
    public id_usuario: string,
    public nome: string,
    public email: string,
    public senha: string,
    public funcao: Funcao,
    public excluido: boolean = false
  ) { }

  get Id() { return this.id_usuario }

  get Nome() { return this.nome }

  get Email() { return this.email }
  
  get Funcao() { return this.funcao }
}
