import { ItemPedidoDTO, PedidoAtualizadoDTO, PedidoDTO } from "@/lib/dtos/pedido";
import { StatusItemPedido } from "@/lib/enums/status-item-pedido";
import { useState } from "react"

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

type CardCozinhaProps = {
  pedido: PedidoDTO
}

export default function CardPedidoCozinha({ pedido }: CardCozinhaProps) {
  const [itens, setItens] = useState<ItemPedidoDTO[]>([...pedido.itens]);

  async function alterarStatus(idItem: string, status: StatusItemPedido) {
    let novoStatus = status
    switch (status) {
      case StatusItemPedido.PENDENTE:
        novoStatus = StatusItemPedido.PREPARANDO
        break

      case StatusItemPedido.PREPARANDO:
        novoStatus = StatusItemPedido.PRONTO
        break
    }

    const pedidoAtualizado: PedidoAtualizadoDTO = {
      id: pedido.id,
      itensAlterados: [
        {
          id: idItem,
          status: novoStatus
        }
      ]
    }

    try {
      const res = await fetch("/api/pedido/atualizar", {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoAtualizado)
      });

      if (!res.ok) {
        alert("Falha ao atualizar status do item: " + res.statusText);
      }

      const data: PedidoDTO = await res.json()
      setItens([...data.itens])

      alert("Status atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Falha ao atualizar status do item: " + (err as Error));
    }

  }

  return (
    <div className="w-full max-w-md bg-(--color-surface) border-(--color-surface-border) border-2 flex flex-col gap-4 rounded-2xl p-4">
      <h3 className="text-2xl font-bold">Pedido n°{pedido.id} - Mesa {pedido.numeroMesa}</h3>

      <p>
        Data de criação: {Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short"
        }).format(new Date(pedido.criadoEm || Date.now()))}
      </p>

      <ul className="flex flex-col gap-1 text-lg list-disc list-inside rounded-lg bg-white">
        {itens.map((item, index) => (
          <li
            key={index}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2"
          >
            <span className="flex gap-2">
              <span>&bull;</span>
              <span>
                <p>&times;{item.quantidade} &ndash; {item.nome}</p>
                {item.observacao && <p className="text-sm">{item.observacao}</p>}
              </span>
            </span>
            <span>
              <button
                type="button"
                onClick={() => alterarStatus(item.id, item.status)}
                className={`text-[1rem] px-3 py-1 border-2 rounded-full cursor-pointer bg-${corStatusItemPedido(item.status)} transition duration-300 hover:bg-(--color-button-action-hover) border-(--color-button-action-border)`}
              >
                {item.status}
              </button>
            </span>
          </li>
        ))}
      </ul>

      {/* <button
        // onClick={mudarEstado}
        className="cursor-pointer bg-(--color-button-action) transition duration-300 hover:bg-(--color-button-action-hover) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5 m-3"
      >
        Mudar Estado
      </button> */}
    </div>
  )
}
