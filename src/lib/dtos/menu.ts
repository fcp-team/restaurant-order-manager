export type ItemMenuPayload = {
  nome: string
  descricao: string
  preco: number
}

export type MenuPayload = {
  nome: string
  itens: ItemMenuPayload[]
}

export type ItemMenuDTO = {
  id: string
  idMenu: string
  nome: string
  descricao: string
  preco: number
}

export type MenuDTO = {
  id: string
  nome: string
  itens: ItemMenuDTO[]
}
