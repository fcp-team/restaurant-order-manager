"use client"

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import CardPedidoCozinha from "@/components/CardPedidoCozinha";
import { PedidoDTO } from "@/lib/dtos/pedido";
import { getSocket } from "@/lib/ws-client";
import { StatusPedido } from "@/lib/enums/status-pedido";

export default function Cozinha() {
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    fetch("/api/pedidos?status=ABERTO")
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error(err));

    if (!socketRef.current) socketRef.current = getSocket()
    const socket = socketRef.current

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      const pedido: PedidoDTO = data.payload

      if (data.type === "pedido:criar") {
        setPedidos(prev => [...prev, pedido])
      }

      if (data.type === "pedido:atualizar") {
        setPedidos(prev => prev.map((p) => (
          p.id === pedido.id ? { ...pedido } : p
        )).filter((p) => p.status === StatusPedido.ABERTO))
      }
    }
  }, []);

  return (
    <>
      <Header />
      <h2 className="text-3xl m-8">Pedidos em andamento</h2>
      <div className="w-full flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center">
        {pedidos.map((pedido, index) => (
          <CardPedidoCozinha key={index} pedido={pedido} />
        ))}
      </div>
    </>
  );
}
