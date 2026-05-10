"use client"
import { useState, useEffect, SubmitEvent, ChangeEvent } from "react"
import Header from "@/components/Header"
import CardPedidoGarcom from "@/components/CardPedidoGarcom"
import { getSocket } from "@/lib/ws-client"
import { ItemMenuDTO, MenuDTO } from "@/lib/dtos/menu"
import { Pedido } from "@/server/classes/pedido"
import { NovoItemPedidoPayload, NovoPedidoPayload, PedidoDTO } from "@/lib/dtos/pedido"

function Cardapio({
  onSelectItem,
  itensSelecionados,
  onRemoveItem
}: {
  onSelectItem: (item: ItemMenuDTO) => void,
  itensSelecionados: ItemMenuDTO[],
  onRemoveItem: (idItem: string) => void
}) {
  const [menus, setMenus] = useState<MenuDTO[]>([])
  const [itensMenu, setItensMenu] = useState<ItemMenuDTO[]>([])

  const [itensFiltrados, setItensFiltrados] = useState<ItemMenuDTO[]>([])
  const [filtroItem, setFiltroItem] = useState<string>("")

  useEffect(() => {
    fetch("/api/menus")
      .then(res => res.json())
      .then(res => {
        const data: MenuDTO[] = res
        const itens: ItemMenuDTO[] = data.flatMap((menu) => (
          menu.itens.map(item => ({ ...item, idMenu: menu.id }))
        ))

        setMenus(data)
        setItensMenu(itens)
      })
  }, [])

  useEffect(() => {
    if (!filtroItem) setItensFiltrados(itensMenu)

    setItensFiltrados(
      itensMenu.filter((item) => (
        item.nome.toLowerCase().search(filtroItem.toLowerCase()) > -1
      ))
    )
  }, [itensMenu, filtroItem])

  function handleCheckboxChange(item: ItemMenuDTO) {
    const itemSelecionado = itensSelecionados.find((i) => i.id === item.id)
    itemSelecionado ? onRemoveItem(item.id) : onSelectItem(item)
  }

  return (
    <>
      <input
        type="text"
        placeholder="Pesquisar item"
        value={filtroItem}
        onChange={(e) => setFiltroItem(e.target.value)}
        className="w-full max-w-lg border border-gray-400 rounded-lg p-3 mb-4 bg-white"
      />

      <ul className="flex flex-col gap-px w-full max-h-[60dvh] overflow-auto rounded-2xl bg-gray-500 shadow">
        {itensFiltrados.map((item, index) => (
          <li
            key={index}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full py-4 px-6 bg-white hover:bg-gray-100">
            <input
              type="checkbox"
              checked={itensSelecionados.some((i) => i.id === item.id)}
              onChange={() => handleCheckboxChange(item)}
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
    </>
  )
}

function PedidoForm() {
  const [itensSelecionados, setItensSelecionados] = useState<ItemMenuDTO[]>([])
  const [itensPedido, setItensPedido] = useState<NovoItemPedidoPayload[]>([])

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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!itensPedido.length) {
      alert("Não há itens no pedido.")
      return
    }

    const formData = new FormData(event.currentTarget)
    const numeroMesa = String(formData.get("numero-mesa"))
    if (!numeroMesa) {
      alert("O número da mesa deve ser indicado.")
      return
    }

    const pedido: NovoPedidoPayload = {
      numeroMesa: numeroMesa,
      itens: itensPedido
    }

    try {
      const res = await fetch("/api/pedido/criar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(pedido)
      })

      if (!res.ok) {
        alert("Houve um problema ao registrar o pedido: " + res.statusText)
        return
      }
    } catch (reason) {
      console.error(reason)
      alert("Houve um problema ao registrar o pedido: " + (reason as Error).message)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 self-start">Adicionar Pedidos</h2>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center gap-4 w-full"
      >
        <input
          type="number"
          name="numero-mesa"
          required
          inputMode="numeric"
          min={0}
          placeholder="Nº mesa"
          className="w-full max-w-lg border border-gray-400 rounded-lg p-3 bg-white"
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
          type="submit"
          className="cursor-pointer bg-(--color-button-action) border-(--color-button-action-border) border-2 rounded-2xl p-2 px-5 w-full max-w-lg mb-4"
        >
          Criar pedido
        </button>
      </form>

      <Cardapio
        onSelectItem={adicionarItem}
        itensSelecionados={itensSelecionados}
        onRemoveItem={removerItem}
      />
    </>
  )
}

export default function Garcom() {
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false)
  const [pedidosProntos, setPedidosProntos] = useState<PedidoDTO[]>([])

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

  return (
    <>
      <Header />

      <div className="w-xl flex flex-col items-center p-8 mx-auto">
        {mostrarFormulario ?
          (
            <>
              <PedidoForm />
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="w-full max-w-lg p-2 px-5 border-2 rounded-2xl border-(--color-button-action-border) mt-4 bg-(--color-button-action) cursor-pointer"
              >
                Cancelar
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
              <div className="flex flex-row gap-10 flex-wrap justify-center items-center">
                {pedidosProntos.length === 0 ? (
                  <p className="text-gray-400 mt-4">Nenhum pedido pronto ainda.</p>
                ) : (
                  pedidosProntos.map((pedido) => (
                    <CardPedidoGarcom key={pedido.id} pedido={pedido} />
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
