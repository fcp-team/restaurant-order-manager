"use client"

import { useState, useEffect, SubmitEvent, useMemo } from "react"
import { ItemMenuDTO, MenuDTO } from "@/lib/dtos/menu"
import { NovoPedidoDTO, PedidoAtualizadoDTO, PedidoDTO } from "@/lib/dtos/pedido"

type ItemPedidoForm = {
  id?: string
  idItemMenu: string
  nome: string
  precoUnitario: number
  quantidade: number
  observacao?: string
}

type CardapioProps = {
  onSelectItem: (item: ItemMenuDTO) => void,
  itensSelecionados: ItemPedidoForm[],
  onRemoveItem: (idItem: string) => void
}

function Cardapio({
  onSelectItem,
  itensSelecionados,
  onRemoveItem
}: CardapioProps) {
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
    const itemSelecionado = itensSelecionados.find((i) => i.idItemMenu === item.id)
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

      <ul className="flex flex-col gap-px w-full max-w-lg max-h-[60dvh] overflow-auto rounded-2xl bg-gray-500 shadow">
        {itensFiltrados.map((item, index) => (
          <li
            key={index}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full py-4 px-6 bg-white hover:bg-gray-100">
            <input
              type="checkbox"
              checked={itensSelecionados.some((i) => i.idItemMenu === item.id)}
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

async function criarPedido(payload: NovoPedidoDTO) {
  try {
    const res = await fetch("/api/pedido/criar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (!res.ok)
      throw new Error(`Erro ao criar pedido: ${res.statusText}`)

  } catch (reason) {
    console.error(reason)
    alert("Houve um problema ao criar o pedido: " + (reason as Error).message)
  }
}

async function atualizarPedido(payload: PedidoAtualizadoDTO) {
  try {
    const res = await fetch("/api/pedido/atualizar", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (!res.ok)
      throw new Error(`Erro ao atualizar pedido: ${res.statusText}`)

    alert("Pedido atualizado com sucesso!")
  } catch (reason) {
    console.error(reason)
    alert("Houve um problema ao atualizar o pedido: " + (reason as Error).message)
  }
}

export default function PedidoForm({ pedido }: { pedido?: PedidoDTO }) {
  const isUpdate = pedido || false

  const itensOriginais = useMemo<ItemPedidoForm[]>(() => (
    pedido?.itens.map((item) => ({
      id: item.id,
      idItemMenu: item.idItemMenu,
      nome: item.nome,
      precoUnitario: item.precoUnitario,
      quantidade: item.quantidade,
      observacao: item.observacao
    }))
  ) || [], [pedido])

  const [itens, setItens] = useState<ItemPedidoForm[]>(itensOriginais)
  const [numeroMesa, setNumeroMesa] = useState<string>(pedido?.numeroMesa || "")

  function adicionarItem(item: ItemMenuDTO) {
    if (itens.find((i) => i.idItemMenu === item.id)) return
    setItens(prev => [...prev, {
      idItemMenu: item.id,
      nome: item.nome,
      precoUnitario: item.preco,
      quantidade: 1,
    }])
  }

  function removerItem(idItemMenu: string) {
    setItens(prev => prev.filter((i) => i.idItemMenu !== idItemMenu))
  }

  function adicionarObservacao(idItemMenu: string, observacao: string) {
    setItens(prev => prev.map((item) => (
      item.idItemMenu === idItemMenu ?
        { ...item, observacao: observacao } :
        item
    )))
  }

  function alterarQuantidade(idItemMenu: string, quantidade: number) {
    if (quantidade < 1) return
    setItens(prev => prev.map((item) => (
      item.idItemMenu === idItemMenu ?
        { ...item, quantidade: quantidade } :
        item
    )))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!numeroMesa) {
      alert("O número da mesa deve ser indicado.")
      return
    }

    if (!itens.length) {
      alert("Não há itens no pedido.")
      return
    }

    if (isUpdate) {
      const pedidoAtualizado: PedidoAtualizadoDTO = {
        id: pedido!.id,
        numeroMesa: numeroMesa
      }

      const itensAdicionados = itens.filter((item) => (
        !itensOriginais.some((i) => i.idItemMenu === item.idItemMenu)
      )).map((item) => ({
        idItemMenu: item.idItemMenu,
        quantidade: item.quantidade,
        observacao: item.observacao
      }))

      if (itensAdicionados.length > 0)
        pedidoAtualizado.itensAdicionados = itensAdicionados

      const itensRemovidos = itensOriginais.filter((item) => (
        !itens.some((i) => i.idItemMenu === item.idItemMenu)
      )).map((item) => item.id as string)

      if (itensRemovidos.length > 0)
        pedidoAtualizado.itensRemovidos = itensRemovidos

      const itensAlterados = itens.filter((item) => {
        const original = itensOriginais.find((i) => i.idItemMenu === item.idItemMenu)
        if (!original) return false

        return (
          original.quantidade !== item.quantidade ||
          original.observacao !== item.observacao
        )
      }).map((item) => ({
        id: item.id!,
        quantidade: item.quantidade,
        observacao: item.observacao
      }))

      if (itensAlterados.length > 0)
        pedidoAtualizado.itensAlterados = itensAlterados

      await atualizarPedido(pedidoAtualizado)
      return
    }

    const novoPedido: NovoPedidoDTO = {
      numeroMesa: numeroMesa,
      itens: itens
    }

    await criarPedido(novoPedido)
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 self-start">
        {isUpdate ? "Atualizar" : "Adicionar"} Pedido
      </h2>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center gap-4 w-full"
      >
        <input
          type="number"
          required
          inputMode="numeric"
          min={0}
          placeholder="Nº mesa"
          value={numeroMesa}
          onChange={(e) => setNumeroMesa(e.target.value)}
          className="w-full max-w-lg border border-gray-400 rounded-lg p-3 bg-white"
        />

        {itens.length > 0 && (
          <ul className="flex flex-col gap-px w-full max-w-lg overflow-hidden rounded-2xl bg-gray-500 shadow">
            {itens.map((item, index) => (
              <li
                key={index}
                className="grid grid-cols-[4fr_1fr_auto_auto] items-center gap-4 w-full py-4 px-6 bg-white hover:bg-gray-100">
                <div>
                  <p className="text-lg font-medium">{item.nome}</p>
                  <input
                    type="text"
                    placeholder="Adicionar observação"
                    onChange={(e) => adicionarObservacao(item.idItemMenu, e.target.value)}
                    className="w-full px-3 py-1 border rounded-md text-sm"
                  />
                </div>

                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.precoUnitario)}
                </span>

                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={99}
                  defaultValue={1}
                  onChange={(e) => alterarQuantidade(item.idItemMenu, Number(e.target.value))}
                  className="w-min text-2xl text-center"
                />

                <button
                  type="button"
                  onClick={() => removerItem(item.idItemMenu)}
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
          {isUpdate ? "Atualizar" : "Criar"} pedido
        </button>
      </form>

      <Cardapio
        onSelectItem={adicionarItem}
        itensSelecionados={itens}
        onRemoveItem={removerItem}
      />
    </>
  )
}
