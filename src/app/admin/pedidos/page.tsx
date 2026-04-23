"use client"

import Header from "@/components/Header";
import Link from "next/link";
import CardPedidoView from "@/components/CardPedidoView";
import { useEffect, useState } from "react";

export default function Pedidos(){

      const hoje = new Date().toISOString().split("T")[0];

      const [dataInicioPedido, setDataInicioPedido] = useState(hoje);
      const [dataFimPedido, setDataFimPedido] = useState(hoje);

      const [pedidos, setPedidos] = useState([]);

        const filtrarPedidos = () => {
             fetch(`/api/pedidos?data-inicio=${dataInicioPedido}&data-fim=${dataFimPedido}`, {
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
         };

         useEffect(() => {
            filtrarPedidos();
         }, []);

      const limparFiltros = () => {
         setDataInicioPedido(hoje);
         setDataFimPedido(hoje);
         filtrarPedidos();
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
            <div>
               <h3 className="text-2xl m-9">Filtro</h3>
               <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-4 mb-6 m-10 items-start">              
               <label htmlFor="dataInicio">De</label>
               <input
               type="date"
               id="dataInicio"
               value={dataInicioPedido}
               onChange={(e) => setDataInicioPedido(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950 w-full sm:w-40"
               />
               <label htmlFor="dataFim">Até</label>
               <input
               type="date"
               id="dataFim"
               value={dataFimPedido}
               onChange={(e) => setDataFimPedido(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950 w-full sm:w-40"
               />
               <button
               onClick={limparFiltros}
               className="cursor-pointer px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors w-full sm:w-auto"
               >
               Limpar Filtros
               </button>
               <button
               onClick={filtrarPedidos}
               className="cursor-pointer px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors w-full sm:w-auto"
               >
               Buscar
               </button>
            </div>
            </div>
            <div className="flex flex-row gap-5 flex-wrap justify-center items-center">
                {pedidos.map((pedido, index) => (
                  <CardPedidoView key={index} pedido={pedido}/>
               ))}
            </div>
         </div>
      </>
   )
}