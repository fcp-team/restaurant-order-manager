"use client"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import CardPedidoGarcom from "@/components/CardPedidoGarcom"
import { getSocket } from "@/lib/ws-client"

type Pedido = {
  id: string
  numeroPedido: number
  numeroMesa: number
  data: string
  estado: string
  itens: { nome: string }[]
}

export default function Garcom() {
  const [pedidosProntos, setPedidosProntos] = useState<Pedido[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [numeroMesa, setNumeroMesa] = useState("")
  const [nomePrato, setNomePrato] = useState("")
  const [itensPedido, setItensPedido] = useState<string[]>([])

  useEffect(() => {
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

  function adicionarPrato() {
    if (nomePrato.trim() === "") return
    setItensPedido([...itensPedido, nomePrato.trim()])
    setNomePrato("")
  }

  function removerPrato(index: number) {
    setItensPedido(itensPedido.filter((_, i) => i !== index))
  }

  async function criarPedido() {
    if (numeroMesa.trim() === "" || itensPedido.length === 0) return

    const res = await fetch("/api/pedido/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numeroMesa: Number(numeroMesa),
        itens: itensPedido.map((nome) => ({ nome })),
      }),
    })

    if (res.ok) {
      setMostrarFormulario(false)
      setNumeroMesa("")
      setItensPedido([])
    }
  }

  if (mostrarFormulario) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center p-8">
          <h2 className="text-3xl font-bold mb-8 self-start">Adicionar Pedidos</h2>

          <input
            type="number"
            placeholder="Nº Mesa"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            className="w-full max-w-lg border border-gray-300 rounded-lg p-3 mb-4"
          />

          <input
            type="text"
            placeholder="Adicionar Prato"
            value={nomePrato}
            onChange={(e) => setNomePrato(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarPrato()}
            className="w-full max-w-lg border border-gray-300 rounded-lg p-3 mb-4"
          />

          {itensPedido.length > 0 && (
            <div className="w-full max-w-lg bg-[var(--color-surface)] border-[var(--color-surface-border)] border-2 rounded-2xl p-4 mb-4">
              <ul className="list-disc list-inside">
                {itensPedido.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-1">
                    <span>{item}</span>
                    <button onClick={() => removerPrato(index)} className="text-red-500 font-bold ml-4">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={criarPedido}
            className="cursor-pointer bg-[var(--color-button-action)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 w-full max-w-lg mb-4"
          >
            Criar Pedido
          </button>

          <button onClick={() => setMostrarFormulario(false)} className="underline text-sm">
            Voltar
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-8">

       
        <h2 className="text-3xl m-4">Pedidos</h2>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="cursor-pointer bg-[var(--color-button-action)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mb-12 flex items-center gap-2"
        >
          + Adicionar Pedido
        </button>

       

      
        <h2 className="text-3xl m-4">Pedidos Prontos</h2>
        <div className="flex flex-row gap-10 flex-wrap justify-center items-center">
          {pedidosProntos.length === 0 ? (
            <p className="text-gray-400 mt-4">Nenhum pedido pronto ainda.</p>
          ) : (
            pedidosProntos.map((pedido) => (
              <CardPedidoGarcom key={pedido.id} pedido={pedido} />
            ))
          )}
        </div>

      </div>
    </>
  )
}