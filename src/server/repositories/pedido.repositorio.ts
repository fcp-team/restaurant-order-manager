import pool from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { Pedido, StatusPedido } from "../classes/pedido"
import { ItemPedido, StatusItemPedido } from "../classes/item-pedido"

export interface IRepositorioPedido {
  criarPedido(pedido: Pedido): Promise<void>
  buscarPedido(id: string): Promise<Pedido | null>
  adicionarItem(idPedido: string, item: ItemPedido): Promise<Pedido>
  acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido>
  removerItem(idPedido: string, idItem: string): Promise<Pedido>
  reduzirItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido>
  listarPorStatus(status: StatusPedido): Promise<Pedido[]>
  listarPorPeriodo(inicio: Date, fim: Date): Promise<Pedido[]>
  atualizarStatusPedido(id: string, status: StatusPedido): Promise<Pedido>
  atualizarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<Pedido>
}

export class RepositorioPedido implements IRepositorioPedido {
  async criarPedido(pedido: Pedido): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO Pedidos (id_usuario, id_restaurante, mesa, abertura, total, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [1, 1, pedido.numeroMesa, pedido.CriadoEm, pedido.calcularTotal(), "aberto"]
      )

      const idPedido = res.insertId
      pedido.Id = String(idPedido)

      for (const item of pedido.Itens) {
        // buscar dados do item no menu (nome, valor)
        // const [rows] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ? AND excluido = 0`, [item.idItemMenu])
        // const menu = rows[0]
        // if (!menu) throw new Error("Item de menu não encontrado")

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

  async buscarPedido(id: string): Promise<Pedido | null> {
    const [rowsPedidos] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM Pedidos WHERE id_pedido = ? AND excluido = 0`,
      [Number(id)]
    )
    const pedidoRow = rowsPedidos[0]
    if (!pedidoRow) return null

    const [rowsItens] = await pool.execute<RowDataPacket[]>(
      `SELECT ip.id_itempedido, ip.id_item, ip.quantidade, ip.nota, ip.status, it.nome, it.valor
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
      item.Status = this.mapItemStatusDbToEnum(r.status)
      return item
    })

    const pedido = new Pedido(String(pedidoRow.mesa), itens)
    pedido.Id = id
    pedido.Status = this.mapPedidoStatusDbToEnum(pedidoRow.status)
    if (pedidoRow.fechamento) {
      pedido.FechadoEm = new Date(pedidoRow.fechamento)
    }

    return pedido
  }

  async adicionarItem(idPedido: string, item: ItemPedido): Promise<Pedido> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // const [menuRows] = await conn.execute<RowDataPacket[]>(`SELECT nome, valor FROM Itens WHERE id_item = ? AND excluido = 0`, [Number(idItemMenu)])
      // const menu = menuRows[0]
      // if (!menu) throw new Error("Item de menu não encontrado")

      await conn.execute<ResultSetHeader>(
        `INSERT INTO ItensPedidos (id_pedido, id_item, quantidade, nota, status) VALUES (?, ?, ?, ?, ?)`,
        [Number(idPedido), Number(item.IdItemMenu), item.Quantidade, item.observacao ?? null, "preparando"]
      )
      await conn.commit()

      const pedido = await this.buscarPedido(idPedido)
      if (!pedido) throw new Error("Pedido não encontrado após inserir item")
      return pedido
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async acrescentarItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT quantidade FROM ItensPedidos WHERE id_itempedido = ? AND id_pedido = ? AND excluido = 0`,
      [Number(idItem), Number(idPedido)]
    )
    const row = rows[0]
    if (!row) throw new Error("Item do pedido não encontrado")

    await pool.execute(
      `UPDATE ItensPedidos SET quantidade = quantidade + ? WHERE id_itempedido = ? AND id_pedido = ?`,
      [quantidade, Number(idItem), Number(idPedido)]
    )

    const pedido = await this.buscarPedido(idPedido)
    if (!pedido) throw new Error("Pedido não encontrado após atualizar item")
    return pedido
  }

  async reduzirItem(idPedido: string, idItem: string, quantidade: number): Promise<Pedido> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT quantidade FROM ItensPedidos WHERE id_itempedido = ? AND id_pedido = ? AND excluido = 0`,
      [Number(idItem), Number(idPedido)]
    )
    const row = rows[0]
    if (!row) throw new Error("Item do pedido não encontrado")

    const novaQuantidade = Number(row.quantidade) - quantidade
    if (novaQuantidade < 1) throw new Error("Quantidade não pode ser menor que 1")

    await pool.execute(
      `UPDATE ItensPedidos SET quantidade = ? WHERE id_itempedido = ? AND id_pedido = ?`,
      [novaQuantidade, Number(idItem), Number(idPedido)]
    )

    const pedido = await this.buscarPedido(idPedido)
    if (!pedido) throw new Error("Pedido não encontrado após atualizar item")
    return pedido
  }

  async removerItem(idPedido: string, idItem: string): Promise<Pedido> {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT * FROM ItensPedidos WHERE id_pedido = ? AND id_itempedido = ? AND excluido = 0`,
        [Number(idPedido), Number(idItem)]
      )
      const row = rows[0]
      if (!row) throw new Error("Item do pedido não encontrado")

      await conn.execute(`UPDATE ItensPedidos SET excluido = 1 WHERE id_itempedido = ?`, [row.id_itempedido])
      await conn.commit()

      const pedido = await this.buscarPedido(idPedido)
      if (!pedido) throw new Error("Pedido não encontrado após remover item")
      return pedido
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }

  async listarPorStatus(status: StatusPedido): Promise<Pedido[]> {
    const dbStatus = this.mapPedidoStatusEnumToDb(status)
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
        item.Status = this.mapItemStatusDbToEnum(i.status)
        return item
      })


      const pedido = new Pedido(String(r.mesa), itens)
      pedido.Id = String(r.id_pedido)
      pedido.Status = this.mapPedidoStatusDbToEnum(r.status)
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
        item.Status = this.mapItemStatusDbToEnum(i.status)
        return item
      })

      const pedido = new Pedido(String(r.mesa), itens)
      pedido.Id = String(r.id_pedido)
      pedido.Status = this.mapPedidoStatusDbToEnum(r.status)
      if (r.fechamento) {
        pedido.FechadoEm = new Date(r.fechamento)
      }
      pedidos.push(pedido)
    }

    return pedidos
  }

  async atualizarStatusPedido(id: string, status: StatusPedido): Promise<Pedido> {
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

    const pedido = await this.buscarPedido(id)
    if (!pedido) throw new Error("Pedido não encontrado após atualizar status")
    return pedido
  }

  async atualizarStatusItem(idPedido: string, idItem: string, status: StatusItemPedido): Promise<Pedido> {
    const dbStatus = this.mapItemStatusEnumToDb(status)
    await pool.execute(
      `UPDATE ItensPedidos SET status = ? WHERE id_itempedido = ? AND id_pedido = ?`,
      [dbStatus, Number(idItem), Number(idPedido)]
    )

    const pedido = await this.buscarPedido(idPedido)
    if (!pedido) throw new Error("Pedido não encontrado após atualizar status do item")
    return pedido
  }

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
}
