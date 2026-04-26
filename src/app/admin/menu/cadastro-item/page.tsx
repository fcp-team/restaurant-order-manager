"use client"

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function CadastroItem(){

   type Cardapio = {
   id: string;
   nome: string;
   itens: any[];
   };

   const [nome, setNome] = useState("");
   const [descricao, setDescricao] = useState("");
   const [preco, setPreco] = useState("");
   const [cardapios, setCardapios] = useState<Cardapio[]>([]);
   const [cardapioId, setCardapioId] = useState("");

   useEffect(() => {
   fetch("/api/menus", {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   })
      .then(res => res.json())
      .then(data => {
         console.log("Cardapios recebidos:", data);
         setCardapios(data);
      })
      .catch(err => console.error(err));
   }, []);



   async function cadastrarItemCardapio(event: any){
      event.preventDefault();

      if (!cardapioId || !nome || !descricao || !preco) {
         alert("Preencha todos os campos");
         return;
      }

      if (!/^\d*[.,]?\d*$/.test(preco)) {
         alert("Preço inválido");
         return;
      }

      const precoFormatado = parseFloat(preco.replace(",", "."));

      try {
         const response = await fetch("/api/menu/item/adicionar", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            idMenu: cardapioId,
            item: {
               nome: nome,
               preco: precoFormatado,
               descricao: descricao
            }
            }),
         });

         const data = await response.json();

         if (!response.ok) {
         throw new Error(data.message || "Erro ao cadastrar");
         }

         console.log("Sucesso:", data);
         alert("Item do cardápio criado com sucesso!");

         setNome("");
         setDescricao("");
         setPreco("");

      } catch (err) {
         console.error(err);
         alert("Erro ao criar item do cardápio");
      }
   }

   return(   
      <>
        <Header/>
          <Link href="/admin/menu" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 py-4 m-10 mt-5 mx-auto border-2 border-[var(--color-surface-border)]">
               <h2 className="text-3xl text-center m-3 mb-4">Cadastro de Item no Cardápio</h2>
               <form onSubmit={cadastrarItemCardapio} className="flex flex-col gap-3">

                     <div>
                        <label htmlFor="cardapio" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Cardápio do item</label>
                     <select 
                     value={cardapioId}
                     onChange={(e) => setCardapioId(e.target.value)}
                     name="cardapio" 
                     id="cardapio" 
                     className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950">
                        <option value="" disabled selected>Selecione o cardápio</option>
                        {cardapios.map((cardapio) => (
                           <option key={cardapio.id} value={cardapio.id}>{cardapio.nome}</option>
                        ))}
                     </select>
                     </div>

                     <div>
                        <label htmlFor="nomeItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Nome do Item</label>
                        <input 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        type="text" 
                        name="nomeItem" 
                        id="nomeItem" 
                        placeholder="Nome do Item" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"
                        />
                     </div>

                      <div>
                        <label htmlFor="descricaoItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Descrição do Item</label>
                        <input 
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        type="text" 
                        name="descricaoItem" 
                        id="descricaoItem" 
                        placeholder="Descrição do Item" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"
                        />
                     </div>

                     <div>
                        <label htmlFor="precoItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Preço do Item</label>
                        <input 
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        type="text" 
                        name="precoItem" 
                        id="precoItem" 
                        placeholder="00.00" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"
                        />
                     </div>

                     <input type="submit" value="Cadastrar" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold"/>
               </form>
         </div>
      </>
   )
}