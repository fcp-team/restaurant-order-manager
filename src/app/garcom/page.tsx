"use client"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import CardPedidoGarcom from "@/components/CardPedidoGarcom"
import { getSocket } from "@/lib/ws-client"
import { ItemMenuDTO, MenuDTO } from "@/lib/dtos/menu"
import { Pedido } from "@/server/classes/pedido"
import { NovoItemPedidoPayload } from "@/lib/dtos/pedido"


function PedidoForm() {
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [itensMenu, setItensMenu] = useState<ItemMenuDTO[]>([])

  const [itensFiltrados, setItensFiltrados] = useState<ItemMenuDTO[]>([])
  const [filtroItem, setFiltroItem] = useState<string>("")

  const [itensSelecionados, setItensSelecionados] = useState<ItemMenuDTO[]>([])
  const [itensPedido, setItensPedido] = useState<NovoItemPedidoPayload[]>([])

  async function carregarMenus() {
    const res = await fetch("/api/menus")
    const data: MenuDTO[] = await res.json()
    setMenus(data)
    data.forEach(menu => setItensMenu(prev => {
      const itens: ItemMenuDTO[] = menu.itens.map(item => ({ ...item, idMenu: menu.id }))
      return [...prev, ...itens]
    }))
  }

  useEffect(() => {
    carregarMenus()
  }, [])

  useEffect(() => {
    if (!filtroItem) setItensFiltrados(itensMenu)

    setItensFiltrados(
      itensMenu.filter((item) => (
        item.nome.toLowerCase().search(filtroItem.toLowerCase()) > -1
      ))
    )
  }, [itensMenu, filtroItem])

  useEffect(() => {
    const itens: NovoItemPedidoPayload[] = itensSelecionados.map((item) => ({
      idItemMenu: item.id,
      idMenu: item.idMenu,
      quantidade: 1
    }))

    setItensPedido(itens)
  }, [itensSelecionados])

  function adicionarItem(item: ItemMenuDTO) {
    if (itensSelecionados.find((itemSelecionado) => itemSelecionado.id === item.id)) return
    setItensSelecionados(prev => [...prev, item])
  }

  function removerItem(idItem: string) {
    setItensSelecionados(itensSelecionados.filter((item) => item.id !== idItem))
  }

  function adicionarObservacao(idItemMenu: string, observacao: string) {
    setItensPedido(prev => (
      prev.map((item) => (
        item.idItemMenu === idItemMenu ?
          { ...item, observacao: observacao } :
          item
      ))
    ))
  }

  function alterarQuantidade(idItemMenu: string, quantidade: number) {
    if (quantidade < 1) return
    setItensPedido(prev => (
      prev.map((item) => (
        item.idItemMenu === idItemMenu ?
          { ...item, quantidade: quantidade } :
          item
      ))
    ))
  }

  useEffect(() => console.log(itensPedido), [itensPedido])

  async function criarPedido() {

  }

  return (
    <div className="w-xl flex flex-col items-center p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-8 self-start">Adicionar Pedidos</h2>

      <input
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="Nº mesa"
        className="w-full max-w-lg border border-gray-300 rounded-lg p-3 mb-4"
      />

      {itensSelecionados.length > 0 && (
        <ul className="flex flex-col gap-px w-full overflow-hidden rounded-2xl bg-gray-500 shadow">
          {itensSelecionados.map((item, index) => (
            <li
              key={index}
              className="grid grid-cols-[4fr_1fr_auto_auto] items-center gap-4 w-full py-4 px-6 bg-white hover:bg-gray-100">
              <div>
                <p className="text-lg font-medium">{item.nome}</p>
                <input
                  type="text"
                  placeholder="Adicionar observação"
                  onChange={(e) => adicionarObservacao(item.id, e.target.value)}
                  className="w-full px-3 py-1 border rounded-md text-sm"
                />
              </div>

              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.preco)}
              </span>

              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                defaultValue={1}
                onChange={(e) => alterarQuantidade(item.id, Number(e.target.value))}
                className="w-min text-2xl text-center"
              />

              <button
                type="button"
                onClick={() => removerItem(item.id)}
                className="text-2xl text-red-600"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={criarPedido}
        className="cursor-pointer bg-(--color-button-action) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5 w-full max-w-lg mb-4"
      >
        Criar pedido
      </button>

      {/* Cardápio */}
      <input
        type="text"
        placeholder="Pesquisar item"
        value={filtroItem}
        onChange={(e) => setFiltroItem(e.target.value)}
        className="w-full max-w-lg border border-gray-300 rounded-lg p-3 mb-4"
      />

      <ul className="flex flex-col gap-px w-full overflow-hidden rounded-2xl bg-gray-500 shadow">
        {itensFiltrados.map((item, index) => (
          <li
            key={index}
            className="grid grid-cols-[auto_3fr_1fr] items-center gap-4 w-full py-4 px-6 bg-white hover:bg-gray-100">
            <input
              type="checkbox"
              onChange={() => adicionarItem(item)}
              className="size-5"
            />

            <div>
              <p className="text-lg font-medium">{item.nome}</p>
              <p className="text-sm text-gray-600">{item.descricao}</p>
            </div>

            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(item.preco)}
            </span>
          </li>
        ))}
      </ul>

      {/* <button onClick={() => setMostrarFormulario(false)} className="underline text-sm">
          Voltar
        </button> */}
    </div>
  )
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

  return (
    <>
      <Header />
      <PedidoForm />

      {/* <div className="flex flex-col items-center p-8">
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
      </div> */}
    </>
  )
}
