"use client"

import Header from "@/components/Header";
import CardPedidoAction from "@/components/CardPedidoAction";

export default function Cozinha() {
  return (
    <>
     <Header/>
    <h2 className="text-3xl m-8">Pedidos Em Andamento</h2>
    <div className="flex flex-row gap-10 flex-wrap justify-center items-center">
      {/* TODO: pegar os pedidos em andamento e colocar em um map com CardPedidoAction */}
    </div>
    </>
  )
}