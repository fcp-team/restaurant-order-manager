"use client"

import Header from "@/components/Header";
import Link from "next/link";
import CardPedidoView from "@/components/CardPedidoView";
import { useEffect, useState } from "react";

export default function Pedidos(){

      const [numeroPedido, setNumeroPedido] = useState("");
      const [numeroMesa, setNumeroMesa] = useState("");
      const [dataPedido, setDataPedido] = useState("");
      const [estado, setEstado] = useState("");

      const [pedidos, setPedidos] = useState([]);

         useEffect(() => {
         fetch("/api/pedidos", {
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

      const limparFiltros = () => {
         setNumeroPedido("");
         setNumeroMesa("");
         setDataPedido("");
         setEstado("");
      };

   return(   
      <>
        <Header/>
         <Link href="/admin" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
         </Link>
         <div>
            <h2 className="text-3xl text-left m-3 ml-7 mb-2">Pedidos</h2>
               <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 m-10 items-start">
              <h3 className="text-2xl">Filtros</h3>
               <input
               type="number"
               placeholder="N° do pedido"
               value={numeroPedido}
               onChange={(e) => setNumeroPedido(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950 w-full sm:w-40"
               />

               <input
               type="number"
               placeholder="N° da mesa"
               value={numeroMesa}
               onChange={(e) => setNumeroMesa(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950 w-full sm:w-40"
               />

               <input
               type="date"
               value={dataPedido}
               onChange={(e) => setDataPedido(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950 w-full sm:w-40"
               />

               <select
               value={estado}
               onChange={(e) => setEstado(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950 w-full sm:w-45"
               >
               <option value="">Todos os estados</option>
               <option value="aberto">Aberto</option>
               <option value="fechado">Fechado</option>
               <option value="cancelado">Cancelado</option>
               </select>

               <button
               onClick={limparFiltros}
               className="cursor-pointer px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors w-full sm:w-auto"
               >
               Limpar Filtros
               </button>
            </div>
            <div className="flex flex-row gap-5 flex-wrap justify-center items-center">
               {/* TODO: pegar todos os pedidos e colocar em um map com CardPedidoView */}
            </div>
         </div>
      </>
   )
}