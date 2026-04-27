"use client"

import { Funcao } from "@/server/classes/usuario";
import Link from "next/link";
import { SubmitEvent, useRef } from "react";

export default function CadastroMembro() {
  const inputUsuarioRef = useRef<HTMLInputElement>(null)
  const inputEmailRef = useRef<HTMLInputElement>(null)
  const inputSenhaRef = useRef<HTMLInputElement>(null)
  const selectFuncaoRef = useRef<HTMLSelectElement>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = {
      nome: inputUsuarioRef.current?.value,
      email: inputEmailRef.current?.value,
      senha: inputSenhaRef.current?.value,
      funcao: selectFuncaoRef.current?.value
    }

    try {
      const response = await fetch("/api/auth/registrar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      })
      console.log(response)
    } catch (reason) {
      console.error(reason)
      alert("Falha ao registrar usuário")
    }
  }

  return (
    <>
      <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 py-4 m-10 mx-auto border-2 border-[var(--color-surface-border)]">
        <h2 className="text-3xl text-center m-3 mb-3">Cadastro</h2>
        <p className="text-center mb-7">Gerenciamento de Pedidos</p>

        <form action="" method="post" className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-5">
            <label htmlFor="usuario" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Usuário</label>
            <input type="text" name="usuario" id="usuario" placeholder="Usuário" required ref={inputUsuarioRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Email</label>
            <input type="email" name="email" id="email" placeholder="Email" required ref={inputEmailRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <div className="mb-5">
            <label htmlFor="senha" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Senha</label>
            <input type="password" name="senha" id="senha" placeholder="Senha" required minLength={7} ref={inputSenhaRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <div>
            <label htmlFor="funcao" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Função</label>
            <select name="funcao" id="funcao" defaultValue="null" ref={selectFuncaoRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950">
              <option value="null">Selecionar</option>
              {Object.values(Funcao).map((funcao, i) => (
                <option key={i} value={funcao}>{funcao}</option>
              ))}
            </select>
          </div>

          <input type="submit" value="Cadastrar" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold" />
        </form>
      </div>
      <div className="flex justify-center items-center">
        <Link href={"/login"} className="mb-5 text-center underline text-[var(--color-button-auth)] transition duration-300 hover:text-[var(--color-button-auth-hover)]">Voltar</Link>
      </div>
    </>
  );
}
