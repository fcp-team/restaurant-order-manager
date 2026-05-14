import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { Pedido } from "../classes/pedido"
import { ItemPedido } from "../classes/item-pedido"
import { StatusItemPedido } from "@/lib/enums/status-item-pedido"
import { StatusPedido } from "@/lib/enums/status-pedido"

export interface IRepositorioPedido {
  criarPedido(pedido: Pedido): Promise<void>
  atualizarPedido(pedido: Pedido): Promise<void>
  buscarPedido(id: string): Promise<Pedido | null>
  listarPorStatus(status: StatusPedido): Promise<Pedido[]>
  listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]>
}

export class RepositorioPedido implements IRepositorioPedido {
  async criarPedido(pedido: Pedido): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO Pedidos (id_usuario, mesa, abertura, total, status) VALUES (?, ?, ?, ?, ?)`,
        [1, pedido.numeroMesa, pedido.CriadoEm, pedido.calcularTotal(), "aberto"]
      )

      const idPedido = res.insertId
      pedido.Id = String(idPedido)

      for (const item of pedido.Itens) {
        const [r] = await conn.execute<ResultSetHeader>(
          `INSERT INTO ItensPedidos (id_pedido, id_item, quantidade, nota, status) VALUES (?, ?, ?, ?, ?)`,
          [idPedido, item.IdItemMenu, item.Quantidade, item.observacao ?? null, "preparando"]
        )

        const idItemPedido = r.insertId
        item.Id = String(idItemPedido)
      }

      await conn.commit()
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async atualizarPedido(pedido: Pedido): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      await conn.execute(
        `UPDATE Pedidos
          SET mesa = ?,
          status = ?,
          fechamento = ?,
          total = ?
        WHERE id_pedido = ? AND excluido = 0`,
        [pedido.numeroMesa, pedido.Status, pedido.FechadoEm ?? null, pedido.calcularTotal(), pedido.Id]
      )

      const idItens = pedido.Itens.map((item) => item.Id)
      if (idItens.length > 0) {
        const placeholders = idItens.map(() => "?").join(", ")

        await conn.execute(
          `UPDATE ItensPedidos SET excluido = 1
            WHERE id_pedido = ? AND id_itempedido NOT IN (${placeholders})`,
          [pedido.Id, ...idItens]
        )
      }

      for (const item of pedido.Itens) {
        if (!item.Id) {
          const [res] = await conn.execute<ResultSetHeader>(
            `INSERT INTO ItensPedidos (id_pedido, id_item, quantidade, nota, status) VALUES (?, ?, ?, ?, ?)`,
            [pedido.Id, item.IdItemMenu, item.Quantidade, item.observacao ?? null, item.Status]
          )

          const idItemPedido = res.insertId
          item.Id = String(idItemPedido)
          continue
        }

        await conn.execute(
          `UPDATE ItensPedidos
              SET quantidade = ?,
              nota = ?,
              status = ?
            WHERE id_itempedido = ? AND id_pedido = ? AND excluido = 0`,
          [item.Quantidade, item.observacao ?? null, item.Status, item.Id, pedido.Id]
        )
      }

      await conn.commit()
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async buscarPedido(id: string): Promise<Pedido | null> {
    const [rowsPedidos] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Pedidos WHERE id_pedido = ? AND excluido = 0`,
      [Number(id)]
    )
    const pedidoRow = rowsPedidos[0]
    if (!pedidoRow) return null

    const [rowsItens] = await pool.execute<RowDataPacket[]>(
      `SELECT
        ip.id_itempedido,
        ip.id_item,
        ip.quantidade,
        ip.nota,
        ip.status,
        it.nome,
        it.valor
      FROM ItensPedidos ip
        JOIN Itens it ON ip.id_item = it.id_item
        WHERE ip.id_pedido = ? AND ip.excluido = 0`,
      [Number(id)]
    )

    const itens: ItemPedido[] = rowsItens.map(r => {
      const item = new ItemPedido(
        String(r.id_item),
        r.nome,
        Number(r.quantidade),
        Number(r.valor),
        r.nota ?? undefined
      )
      item.Id = String(r.id_itempedido)
      item.Status = r.status
      return item
    })

    const pedido = new Pedido(String(pedidoRow.mesa), itens)
    pedido.Id = id
    pedido.Status = pedidoRow.status
    if (pedidoRow.fechamento) {
      pedido.FechadoEm = new Date(pedidoRow.fechamento)
    }

    return pedido
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const dbStatus = status
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Pedidos WHERE status = ? AND excluido = 0`,
      [dbStatus]
    )

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
        const item = new ItemPedido(
          String(i.id_item),
          i.nome,
          Number(i.quantidade),
          Number(i.valor),
          i.nota ?? undefined
        )
        item.Id = String(i.id_itempedido)
        item.Status = i.status
        return item
      })


      const pedido = new Pedido(String(r.mesa), itens)
      pedido.Id = String(r.id_pedido)
      pedido.Status = r.status
      if (r.fechamento) {
        pedido.FechadoEm = new Date(r.fechamento)
      }
      pedidos.push(pedido)
    }

    return pedidos
  }

  async listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Pedidos WHERE abertura BETWEEN ? AND ? AND excluido = 0`,
      [inicio, fim]
    )

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
        const item = new ItemPedido(
          String(i.id_item),
          i.nome,
          Number(i.quantidade),
          Number(i.valor),
          i.nota ?? undefined
        )
        item.Id = String(i.id_itempedido)
        item.Status = i.status
        return item
      })

      const pedido = new Pedido(String(r.mesa), itens)
      pedido.Id = String(r.id_pedido)
      pedido.Status = r.status
      if (r.fechamento) {
        pedido.FechadoEm = new Date(r.fechamento)
      }
      pedidos.push(pedido)
    }

    return pedidos
  }
}
