"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header";
import TabelaCardapio from "@/components/TabelaCardapio";
import Link from "next/link";

export default function Menu(){

   const [cardapios, setCardapios] = useState([]);

   async function carregarCardapios() {
  try {
    const res = await fetch("/api/menus");
    const data = await res.json();

    console.log("Cardapios recebidos:", data);
    setCardapios(data);

   } catch (err) {
      console.error(err);
   }
   } 
   

   useEffect(() => {
      carregarCardapios();
   }, []);

   return(   
      <>
        <Header/>
          <Link href="/admin" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
       <div className="flex flex-col gap-1 sm:flex-row sm:gap-6 justify-center items-center text-center p-3 my-2">
            <Link href="/admin/menu/cadastro-cardapio" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5 min-w-[270px]">Cadastrar novo Cardápio</Link>
            <Link href="/admin/menu/cadastro-item" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5 min-w-[270px]">Cadastrar novo Item no Cardápio</Link>
        </div>
       <div className="flex flex-col gap-10 flex-wrap justify-center items-center">
            {cardapios.map((cardapio, index) => (
               <TabelaCardapio atualizarLista={carregarCardapios} key={index}  cardapio={cardapio}/>
            ))}
       </div>
      </>
   )
}