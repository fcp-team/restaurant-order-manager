import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"

import type { NovoPedidoPayload } from "../services/pedido.servico"

export interface IRepositorioPedido {
  criarPedido(pedidoPayload: NovoPedidoPayload): Promise<Pedido>
  buscarPedido(id: string): Promise<Pedido | null>
  adicionarItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido>
  acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<ItemPedido>
  removerItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido>
  reduzirItem(idPedido: string, idItem: string, quantidade: number): Promise<ItemPedido>
  listarPorStatus(status: StatusPedido): Promise<Pedido[]>
  listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]>
  atualizarStatusPedido(id: string, status: StatusPedido): Promise<void>
  atualizarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<void>
}

export class RepositorioPedido implements IRepositorioPedido {
  private mapPedidoStatusDbToEnum(dbStatus: string): StatusPedido {
    switch (dbStatus) {
      case "aberto":
        return StatusPedido.ABERTO
      case "fechado":
        return StatusPedido.FECHADO
      case "cancelado":
        return StatusPedido.CANCELADO
      default:
        return StatusPedido.ABERTO
    }
  }

  private mapPedidoStatusEnumToDb(status: StatusPedido): string {
    switch (status) {
      case StatusPedido.ABERTO:
        return "aberto"
      case StatusPedido.FECHADO:
        return "fechado"
      case StatusPedido.CANCELADO:
        return "cancelado"
      default:
        return "aberto"
    }
  }

  private mapItemStatusDbToEnum(dbStatus: string): StatusItemPedido {
    switch (dbStatus) {
      case "preparando":
        return StatusItemPedido.PREPARANDO
      case "pronto":
      case "entregue":
        return StatusItemPedido.PRONTO
      default:
        return StatusItemPedido.PENDENTE
    }
  }

  private mapItemStatusEnumToDb(status: StatusItemPedido): string {
    switch (status) {
      case StatusItemPedido.PREPARANDO:
        return "preparando"
      case StatusItemPedido.PRONTO:
        return "pronto"
      case StatusItemPedido.PENDENTE:
      default:
        return "preparando"
    }
  }

  async criarPedido(pedidoPayload: NovoPedidoPayload): Promise<Pedido> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const abertura = new Date()
      // total inicial será calculado após inserir itens
      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO Pedidos (id_usuario, id_restaurante, mesa, abertura, total, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [null, null, String(pedidoPayload.numeroMesa), abertura, 0, "aberto"]
      )

      const insertId = res.insertId

      const itensCriados: ItemPedido[] = []

      for (const item of pedidoPayload.itens) {
        // buscar dados do item no menu (nome, valor)
        const [rows] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ? AND excluido = 0`, [item.idItemMenu])
        const menu = rows[0]
        if (!menu) throw new Error("Item de menu não encontrado")

        const [r] = await conn.execute<ResultSetHeader>(
          `INSERT INTO ItensPedidos (id_pedido, id_item, quantidade, nota, status) VALUES (?, ?, ?, ?, ?)`,
          [insertId, item.idItemMenu, item.quantidade, item.observacao ?? null, "preparando"]
        )

        const idItemPedido = r.insertId

        const itemPedido = new ItemPedido(String(idItemPedido), String(item.idItemMenu), menu.nome, item.quantidade, Number(menu.valor), item.observacao)
        itensCriados.push(itemPedido)
      }

      const total = itensCriados.reduce((ac, it) => ac + it.calcularSubtotal(), 0)
      await conn.execute(`UPDATE Pedidos SET total = ? WHERE id_pedido = ?`, [total, insertId])

      await conn.commit()

      return new Pedido(String(insertId), Number(pedidoPayload.numeroMesa), itensCriados)
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async buscarPedido(id: string): Promise<Pedido | null> {
    const [rowsP] = await pool.execute<RowDataPacket[]>(`SELECT * FROM Pedidos WHERE id_pedido = ? AND excluido = 0`, [Number(id)])
    const pedidoRow = rowsP[0]
    if (!pedidoRow) return null

    const [rowsItens] = await pool.execute<RowDataPacket[]>(
      `SELECT ip.id_itempedido, ip.id_item, ip.quantidade, ip.nota, ip.status, it.nome, it.valor
       FROM ItensPedidos ip
       JOIN Itens it ON ip.id_item = it.id_item
       WHERE ip.id_pedido = ? AND ip.excluido = 0`,
      [Number(id)]
    )

    const itens: ItemPedido[] = rowsItens.map(r => {
      const itemStatus = this.mapItemStatusDbToEnum(r.status)
      return new ItemPedido(String(r.id_itempedido), String(r.id_item), r.nome, Number(r.quantidade), Number(r.valor), r.nota, itemStatus)
    })

    const pedidoStatus = this.mapPedidoStatusDbToEnum(pedidoRow.status)
    const dataFechamento: Date | undefined = new Date(pedidoRow.fechamento) ?? undefined

    const pedido = new Pedido(String(pedidoRow.id_pedido), Number(pedidoRow.mesa), itens, pedidoStatus, dataFechamento)

    return pedido
  }

  async adicionarItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [existing] = await conn.execute<RowDataPacket[]>(
        `SELECT * FROM ItensPedidos WHERE id_pedido = ? AND id_item = ? AND excluido = 0`,
        [Number(idPedido), Number(idItemMenu)]
      )

      if (existing.length > 0) {
        const row = existing[0]
        const novaQuantidade = Number(row.quantidade) + quantidade
        await conn.execute(`UPDATE ItensPedidos SET quantidade = ? WHERE id_itempedido = ?`, [novaQuantidade, row.id_itempedido])

        const [menuRows] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ?`, [Number(idItemMenu)])
        const menu = menuRows[0]

        await conn.commit()
        return new ItemPedido(String(row.id_itempedido), String(idItemMenu), menu.nome, novaQuantidade, Number(menu.valor), row.nota)
      }

      const [menuRows2] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ?`, [Number(idItemMenu)])
      const menu2 = menuRows2[0]
      if (!menu2) throw new Error("Item de menu não encontrado")

      const [r] = await conn.execute<ResultSetHeader>(
        `INSERT INTO ItensPedidos (id_pedido, id_item, quantidade, nota, status) VALUES (?, ?, ?, ?, ?)`,
        [Number(idPedido), Number(idItemMenu), quantidade, null, "preparando"]
      )

      const idItemPedido = r.insertId
      await conn.commit()

      return new ItemPedido(String(idItemPedido), String(idItemMenu), menu2.nome, quantidade, Number(menu2.valor), undefined)
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<ItemPedido> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ip.*, it.nome, it.valor
       FROM ItensPedidos ip
       JOIN Itens it ON ip.id_item = it.id_item
       WHERE ip.id_itempedido = ? AND ip.id_pedido = ? AND ip.excluido = 0`,
      [Number(idItem), Number(idPedido)]
    )
    const row = rows[0]
    if (!row) throw new Error("Item do pedido não encontrado")

    const novaQuantidade = Number(row.quantidade) + quantidade
    await pool.execute(`UPDATE ItensPedidos SET quantidade = ? WHERE id_itempedido = ?`, [novaQuantidade, Number(idItem)])

    return new ItemPedido(String(row.id_itempedido), String(row.id_item), row.nome, novaQuantidade, Number(row.valor), row.nota)
  }

  async reduzirItem(idPedido: string, idItem: string, quantidade: number): Promise<ItemPedido> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ip.*, it.nome, it.valor
       FROM ItensPedidos ip
       JOIN Itens it ON ip.id_item = it.id_item
       WHERE ip.id_itempedido = ? AND ip.id_pedido = ? AND ip.excluido = 0`,
      [Number(idItem), Number(idPedido)]
    )
    const row = rows[0]
    if (!row) throw new Error("Item do pedido não encontrado")

    const novaQuantidade = Number(row.quantidade) - quantidade
    if (novaQuantidade < 1) {
      throw new Error("Quantidade não pode ser menor que 1")
    }

    await pool.execute(`UPDATE ItensPedidos SET quantidade = ? WHERE id_itempedido = ?`, [novaQuantidade, Number(idItem)])

    return new ItemPedido(String(row.id_itempedido), String(row.id_item), row.nome, novaQuantidade, Number(row.valor), row.nota)
  }

  async removerItem(idPedido: string, idItemMenu: string, quantidade: number): Promise<ItemPedido> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM ItensPedidos WHERE id_pedido = ? AND id_item = ? AND excluido = 0`, [Number(idPedido), Number(idItemMenu)])
      const row = rows[0]
      if (!row) throw new Error("Item do pedido não encontrado")

      const restante = Number(row.quantidade) - quantidade
      if (restante > 0) {
        await conn.execute(`UPDATE ItensPedidos SET quantidade = ? WHERE id_itempedido = ?`, [restante, row.id_itempedido])

        const [menuRows] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ?`, [Number(idItemMenu)])
        const menu = menuRows[0]
        await conn.commit()
        return new ItemPedido(String(row.id_itempedido), String(idItemMenu), menu.nome, restante, Number(menu.valor), row.nota)
      }

      await conn.execute(`UPDATE ItensPedidos SET excluido = 1 WHERE id_itempedido = ?`, [row.id_itempedido])
      await conn.commit()

      const [menuRows2] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ?`, [Number(idItemMenu)])
      const menu2 = menuRows2[0]
      return new ItemPedido(String(row.id_itempedido), String(idItemMenu), menu2.nome, 0, Number(menu2.valor), row.nota)
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const dbStatus = this.mapPedidoStatusEnumToDb(status)
    const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM Pedidos WHERE status = ? AND excluido = 0`, [dbStatus])

    const pedidos: Pedido[] = []
    for (const r of rows) {
      const [rowsItens] = await pool.execute<RowDataPacket[]>(
        `SELECT ip.id_itempedido, ip.id_item, ip.quantidade, ip.nota, ip.status, it.nome, it.valor
         FROM ItensPedidos ip
         JOIN Itens it ON ip.id_item = it.id_item
         WHERE ip.id_pedido = ? AND ip.excluido = 0`,
        [r.id_pedido]
      )
      const itens = rowsItens.map(i => {
        const itemStatus = this.mapItemStatusDbToEnum(i.status)
        return new ItemPedido(String(i.id_itempedido), String(i.id_item), i.nome, Number(i.quantidade), Number(i.valor), i.nota, itemStatus)
      })

      const pedidoStatus = this.mapPedidoStatusDbToEnum(r.status)
      const pedido = new Pedido(String(r.id_pedido), Number(r.mesa), itens, pedidoStatus)
      pedidos.push(pedido)
    }

    return pedidos
  }

  async listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM Pedidos WHERE abertura BETWEEN ? AND ? AND excluido = 0`, [inicio, fim])
    const pedidos: Pedido[] = []
    for (const r of rows) {
      const [rowsItens] = await pool.execute<RowDataPacket[]>(
        `SELECT ip.id_itempedido, ip.id_item, ip.quantidade, ip.nota, ip.status, it.nome, it.valor
         FROM ItensPedidos ip
         JOIN Itens it ON ip.id_item = it.id_item
         WHERE ip.id_pedido = ? AND ip.excluido = 0`,
        [r.id_pedido]
      )

      const itens = (rowsItens).map(i => {
        const itemStatus = this.mapItemStatusDbToEnum(i.status)
        return new ItemPedido(String(i.id_itempedido), String(i.id_item), i.nome, Number(i.quantidade), Number(i.valor), i.nota, itemStatus)
      })

      const pedidoStatus = this.mapPedidoStatusDbToEnum(r.status)
      const pedido = new Pedido(String(r.id_pedido), Number(r.mesa), itens, pedidoStatus)
      pedidos.push(pedido)
    }

    return pedidos
  }

  async atualizarStatusPedido(id: string, status: StatusPedido): Promise<void> {
    const dbStatus = this.mapPedidoStatusEnumToDb(status)
    if (status === StatusPedido.FECHADO || status === StatusPedido.CANCELADO) {
      await pool.execute(
        `UPDATE Pedidos SET status = ?, fechamento = ? WHERE id_pedido = ?`,
        [dbStatus, new Date(), Number(id)]
      )
    } else {
      await pool.execute(
        `UPDATE Pedidos SET status = ?, fechamento = NULL WHERE id_pedido = ?`,
        [dbStatus, Number(id)]
      )
    }
  }

  async atualizarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<void> {
    const dbStatus = this.mapItemStatusEnumToDb(status)
    await pool.execute(
      `UPDATE ItensPedidos SET status = ? WHERE id_itempedido = ? AND id_pedido = ?`,
      [dbStatus, Number(idItem), Number(idPedido)]
    )
  }
}
