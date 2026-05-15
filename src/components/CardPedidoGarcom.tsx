import { PedidoAtualizadoDTO, PedidoDTO } from "@/lib/dtos/pedido"
import { StatusItemPedido } from "@/lib/enums/status-item-pedido"
import { StatusPedido } from "@/lib/enums/status-pedido"

function definirCorStatusPedido(status: StatusPedido) {
  switch (status) {
    case StatusPedido.ABERTO:
      return "green-400"

    case StatusPedido.FECHADO:
      return "blue-400"

    case StatusPedido.CANCELADO:
      return "red-400"
  }
}

function corStatusItemPedido(status: StatusItemPedido) {
  switch (status) {
    case StatusItemPedido.PENDENTE:
      return "gray-400"

    case StatusItemPedido.PREPARANDO:
      return "yellow-400"

    case StatusItemPedido.PRONTO:
      return "green-400"
  }
}

type CardGarcomProps = {
  pedido: PedidoDTO
  atualizarPedidoFn: () => void
}

export default function CardPedidoGarcom({
  pedido,
  atualizarPedidoFn
}: CardGarcomProps) {
  const corStatusPedido = definirCorStatusPedido(pedido.status)

  async function alterarStatus(status: StatusPedido) {
    if (!Object.values(StatusPedido).includes(status)) {
      alert("Status inválido")
      return
    }

    const pedidoAtualizado: PedidoAtualizadoDTO = {
      id: pedido.id,
      status: status
    }

    try {
      const res = await fetch("/api/pedido/atualizar", {
        method: 'PATCH',
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(pedidoAtualizado)
      })

      if (!res.ok) {
        alert("Erro ao alterar status do pedido: " + res.statusText)
        return
      }
    } catch (error) {
      alert("Erro ao alterar status do pedido: " + (error as Error).message)
    }
  }

  return (
    <div className="w-full max-w-md bg-(--color-surface) border-(--color-surface-border) border-2 flex flex-col gap-4 rounded-2xl p-4">
      <div>
        <span className="text-2xl font-bold">
          Pedido n°{pedido.id} - Mesa {pedido.numeroMesa}
        </span>
        <span className={`float-right px-3 py-1 rounded-full bg-${corStatusPedido}`}>
          {pedido.status}
        </span>
      </div>

      <p>
        Data de criação: {Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short"
        }).format(new Date(pedido.criadoEm || Date.now()))}
      </p>

      <ul className="flex flex-col gap-1 text-lg list-disc list-inside rounded-lg bg-white">
        {pedido.itens.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2"
          >
            <span>{item.nome}</span>
            <span className="float-right">
              &times;{item.quantidade}
              <span className={`px-3 py-1 rounded-full ml-3 text-[1rem] bg-${corStatusItemPedido(item.status)}`}>
                {item.status}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xl text-right">
        <strong>Total:</strong> {Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "BRL"
        }).format(pedido.itens.reduce((acc, item) => (
          acc + item.precoUnitario * item.quantidade
        ), 0))}
      </p>

      <button
        onClick={atualizarPedidoFn}
        className="cursor-pointer bg-(--color-button-action) transition duration-300 hover:bg-(--color-button-action-hover) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5 text-center"
      >
        Editar
      </button>

      <button
        onClick={() => alterarStatus(StatusPedido.CANCELADO)}
        className="cursor-pointer bg-(--color-button-action) transition duration-300 hover:bg-(--color-button-action-hover) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5"
      >
        Cancelar pedido
      </button>

      <button
        onClick={() => alterarStatus(StatusPedido.FECHADO)}
        className="cursor-pointer bg-(--color-button-action) transition duration-300 hover:bg-(--color-button-action-hover) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5"
      >
        Finalizar pedido
      </button>
    </div>
  )
}
