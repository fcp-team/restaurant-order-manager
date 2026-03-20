import { PedidoRepository } from "../repositories/pedido.repository"
import { AuthorizationService } from "./authorization.service"
import { OrderStatus } from "../repositories/pedido.repository"

export default class OrderService {

  repository: PedidoRepository
  authorization: AuthorizationService

  constructor(repositorio: PedidoRepository, authorizacao: AuthorizationService) {
    this.repository = repositorio
    this.authorization = authorizacao}

    async criarPedido(table: number) {
        if (table <= 0) {
        throw new Error("Número de mesa inválido")
                       }
      const order = await this.repository.criarPedido(table)

       return order}

    async buscarPedido(id: string) {

      const order = await this.repository.buscarPedido(id)

       if (!order) {
       throw new Error("Pedido não encontrado")
       }

      return order}

    async adicionarItem(orderId: number, menuItemId: number, quantity: number) {

       if (quantity <= 0) {
    throw new Error("Quantidade inválida") }

     await this.repository.adicionarItem(orderId, menuItemId, quantity)}

    async removerItem(orderId: number, menuItemId: number, ){
      await this.repository.removerItem(orderId, menuItemId, )}
    
    async listarPorStatus(status:OrderStatus){
      const orders =await this.repository.listarPorStatus(status)
      return orders}

    async mudarStatus(id: string, status: OrderStatus) {
      await this.repository.atualizarStatusPedido(id, status)}

    async fecharPedido(id: string) {
      await this.repository.atualizarStatusPedido(id, "fechado")}
  
    async cancelarPedido(id: string){
      await this.repository.atualizarStatusPedido(id,"cancelado")
    }







}