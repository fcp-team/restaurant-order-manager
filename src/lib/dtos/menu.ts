export type ItemMenuDTO = {
  id: string
  nome: string
  descricao: string
  preco: number
}

export type MenuDTO = {
  id: string
  nome: string
  itens: ItemMenuDTO[]
}
