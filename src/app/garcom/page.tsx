"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import PedidoForm from "@/components/PedidoForm"
import CardPedidoGarcom from "@/components/CardPedidoGarcom"
import { getSocket } from "@/lib/ws-client"
import { PedidoDTO } from "@/lib/dtos/pedido"
import AtualizarPedidoForm from "@/components/AtualizarPedidoForm"

export default function Garcom() {
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false)
  const [pedidosProntos, setPedidosProntos] = useState<PedidoDTO[]>([])
  
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([])
  const [pedidoAtual, setPedidoAtual] = useState<PedidoDTO | null>(null)

  async function carregarPedidos() {
    try {
      const res = await fetch("/api/pedidos?status=ABERTO")
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

    const ws = getSocket()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "pedido:atualizar-status-item") {
        const pedido = data.payload
        const todosProntos = pedido.itens?.every((item: any) => item.Status === "PRONTO")
        if (todosProntos) {
          setPedidosProntos((prev) => [...prev, pedido])
        }
      }
    }

    return () => {
      ws.onmessage = null
    }
  }, [])

  function handleUpdate(pedido: PedidoDTO) {
    setPedidoAtual(pedido)
    setMostrarFormulario(true)
  }

  return (
    <>
      <Header />

      <div className="w-xl flex flex-col items-center p-8 mx-auto">
        {mostrarFormulario ?
          (
            <>
              {pedidoAtual ? <AtualizarPedidoForm pedido={pedidoAtual} /> : <PedidoForm />}
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
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

              <h2 className="text-3xl m-4">Pedidos Prontos</h2>
              <div className="flex flex-row gap-4 flex-wrap justify-center items-center">
                {/* {pedidosProntos.length === 0 ? (
                  <p className="text-gray-400 mt-4">Nenhum pedido pronto ainda.</p>
                ) : (
                  pedidosProntos.map((pedido) => (
                    <CardPedidoGarcom key={pedido.id} pedido={pedido} />
                  ))
                )} */}
                {pedidos.length === 0 ? (
                  <p className="text-gray-400 mt-4">Nenhum pedido pronto ainda.</p>
                ) : (
                  pedidos.map((pedido) => (
                    <CardPedidoGarcom
                      key={pedido.id}
                      pedido={pedido}
                      atualizarPedidoFn={() => handleUpdate(pedido)}
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
