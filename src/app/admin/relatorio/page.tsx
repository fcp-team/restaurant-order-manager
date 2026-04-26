"use client"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Link from "next/link"
import { Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

type Item = {
  Nome: string
  Quantidade: number
  Status: string
  precoUnitario: number
}

type Pedido = {
  Id: string
  numeroMesa: string
  Status: string
  CriadoEm: string
  Itens: Item[]
}

export default function Relatorio() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [dataInicio, setDataInicio] = useState(() => new Date().toISOString().split("T")[0])
  const [dataFim, setDataFim] = useState(() => new Date().toISOString().split("T")[0])

  async function buscarPedidos() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pedidos?data-inicio=${dataInicio}&data-fim=${dataFim}`)
      const data = await res.json()
      setPedidos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarPedidos()
  }, [])

  const totalPedidos = pedidos.length

  const faturamentoTotal = pedidos.reduce((acc, pedido) => {
    const totalPedido = pedido.Itens?.reduce((sum, item) => {
      return sum + (item.precoUnitario ?? 0) * (item.Quantidade ?? 1)
    }, 0) ?? 0
    return acc + totalPedido
  }, 0)

  const pedidosPorDia = pedidos.reduce((acc: Record<string, number>, pedido) => {
    const dia = new Date(pedido.CriadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    acc[dia] = (acc[dia] ?? 0) + 1
    return acc
  }, {})

  const itensMaisPedidos = pedidos
    .flatMap((pedido) => pedido.Itens ?? [])
    .reduce((acc: Record<string, number>, item) => {
      const nome = item.Nome ?? "Desconhecido"
      acc[nome] = (acc[nome] ?? 0) + (item.Quantidade ?? 1)
      return acc
    }, {})

  const dadosLinha = {
    labels: Object.keys(pedidosPorDia),
    datasets: [
      {
        label: "Pedidos",
        data: Object.values(pedidosPorDia),
        borderColor: "#4a7c4e",
        backgroundColor: "rgba(74, 124, 78, 0.1)",
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  }

  const dadosPizza = {
    labels: Object.keys(itensMaisPedidos),
    datasets: [
      {
        data: Object.values(itensMaisPedidos),
        backgroundColor: ["#4a7c4e", "#e8c84a", "#e8954a", "#e85a4a", "#6a4a7c", "#4a6a7c"],
      },
    ],
  }

  return (
    <>
      <Header />
      <div className="p-8">

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
            <button className="border border-gray-300 rounded-lg p-2 px-4 opacity-50 cursor-not-allowed">
              Exportar o pdf
            </button>
          </div>
          <h2 className="text-3xl font-bold">Relatório</h2>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-6">

          <div className="flex gap-4 items-center mb-6">
            <label>De</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            />
            <label>Até</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            />
            <button
              onClick={buscarPedidos}
              className="cursor-pointer bg-[var(--color-button-action)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5"
            >
              Buscar
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Carregando...</p>
          ) : (
            <>
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-green-100 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-sm text-gray-600">Pedidos do Dia</p>
                    <p className="text-3xl font-bold">{totalPedidos}</p>
                  </div>
                </div>
                <div className="flex-1 bg-yellow-100 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-sm text-gray-600">Faturamento Total</p>
                    <p className="text-3xl font-bold">R$ {faturamentoTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {dadosLinha.labels.length > 0 ? (
                  <div className="flex-1 bg-white rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-4">Pedidos por Período</h3>
                    <Line data={dadosLinha} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                  </div>
                ) : (
                  <p className="text-center text-gray-400 mt-4 flex-1">Nenhum pedido encontrado nesse período.</p>
                )}

                {Object.keys(itensMaisPedidos).length > 0 && (
                  <div className="flex-1 bg-white rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-4">Itens Mais Pedidos</h3>
                    <Pie data={dadosPizza} options={{ responsive: true }} />
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}