"use client"

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CardPedidoCozinha from "@/components/CardPedidoCozinha";

export default function Cozinha() {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
  fetch("/api/pedidos?status=aberto", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(data => {
       console.log("Pedidos recebidos:", data);
      setPedidos(data);
    })
    .catch(err => console.error(err));
}, []);

  return (
    <>
     <Header/>
    <h2 className="text-3xl m-8">Pedidos Em Andamento</h2>
    <div className="flex flex-row gap-10 flex-wrap justify-center items-center">
        {pedidos.map((pedido, index) => (
            <CardPedidoCozinha key={index} pedido={pedido}/>
        ))}
    </div>
    </>
  );
}
