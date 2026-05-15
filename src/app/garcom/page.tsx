"use client"

import { useState, useEffect, useRef } from "react"
import Header from "@/components/Header"
import PedidoForm from "@/components/PedidoForm"
import CardPedidoGarcom from "@/components/CardPedidoGarcom"
import { getSocket } from "@/lib/ws-client"
import { PedidoDTO } from "@/lib/dtos/pedido"
import { StatusPedido } from "@/lib/enums/status-pedido"

export default function Garcom() {
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false)

  const [pedidos, setPedidos] = useState<PedidoDTO[]>([])
  const [pedidoAtual, setPedidoAtual] = useState<PedidoDTO>()

  const pedidosAbertos = pedidos.filter((p) => p.status === StatusPedido.ABERTO)
  const pedidosFechados = pedidos.filter((p) => p.status === StatusPedido.FECHADO)
  const pedidosCancelados = pedidos.filter((p) => p.status === StatusPedido.CANCELADO)

  const socketRef = useRef<WebSocket | null>(null)

  async function carregarPedidos() {
    try {
      const dataFim = new Date()
      const dataInicio = new Date()
      dataInicio.setHours(dataFim.getHours() - 24)

      const res = await fetch(
        `/api/pedidos?data-inicio=${dataInicio.toISOString()}&data-fim=${dataFim.toISOString()}`
      )
      if (!res.ok) {
        alert("Erro ao carregar pedidos: " + res.statusText)
        return
      }

      const data: PedidoDTO[] = await res.json()
      setPedidos(data)

    } catch (error) {
      alert("Erro: " + (error as Error).message)
    }
  }

  useEffect(() => {
    carregarPedidos()

    if (!socketRef.current) socketRef.current = getSocket()
    const socket = socketRef.current

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const pedido: PedidoDTO = data.payload

      if (data.type === "pedido:criar") {
        setPedidos((prev) => [...prev, pedido])
      }

      if (data.type === "pedido:atualizar") {
        setPedidos((prev) => prev.map((p) => (
          p.id === pedido.id ? { ...pedido } : p
        )))
      }
    }

    return () => { socket.onmessage = null }
  }, [])

  function handleFormState(pedido?: PedidoDTO) {
    setPedidoAtual(pedido)
    setMostrarFormulario(!mostrarFormulario)
  }

  return (
    <>
      <Header />

      <div className="w-full flex flex-col items-center p-8 mx-auto">
        {mostrarFormulario ?
          (
            <>
              <PedidoForm pedido={pedidoAtual} />
              <button
                type="button"
                onClick={() => handleFormState()}
                className="w-full max-w-lg p-2 px-5 border-2 rounded-2xl border-(--color-button-action-border) mt-4 bg-(--color-button-action) cursor-pointer"
              >
                Voltar
              </button>
            </>
          ) :
          (
            <>
              <h2 className="text-3xl m-4">Pedidos</h2>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="cursor-pointer bg-(--color-button-action) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5 mb-12 flex items-center gap-2"
              >
                + Adicionar pedido
              </button>

              <h2 className="text-3xl my-4">Pedidos em andamento</h2>
              <div className="w-full flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center">
                {pedidosAbertos.length === 0 ? (
                  <p className="text-gray-400 mt-4">Nenhum pedido pronto ainda.</p>
                ) : (
                  pedidosAbertos.map((pedido) => (
                    <CardPedidoGarcom
                      key={pedido.id}
                      pedido={pedido}
                      atualizarPedidoFn={() => handleFormState(pedido)}
                    />
                  ))
                )}
              </div>

              <h2 className="text-3xl my-4">Pedidos fechados</h2>
              <div className="w-full flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center">
                {pedidosFechados.length === 0 ? (
                  <p className="text-gray-400">Nenhum pedido fechado ainda.</p>
                ) : (
                  pedidosFechados.map((pedido) => (
                    <CardPedidoGarcom
                      key={pedido.id}
                      pedido={pedido}
                      atualizarPedidoFn={() => handleFormState(pedido)}
                    />
                  ))
                )}
              </div>

              <h2 className="text-3xl my-4">Pedidos cancelados</h2>
              <div className="w-full flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center">
                {pedidosCancelados.length === 0 ? (
                  <p className="text-gray-400">Nenhum pedido cancelado ainda.</p>
                ) : (
                  pedidosCancelados.map((pedido) => (
                    <CardPedidoGarcom
                      key={pedido.id}
                      pedido={pedido}
                      atualizarPedidoFn={() => handleFormState(pedido)}
                    />
                  ))
                )}
              </div>
            </>
          )
        }
      </div>
    </>
  )
}
