"use client"

import { SubmitEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { UsuarioPayload } from "@/lib/dtos/usuario";
import { Funcao } from "@/lib/enums/funcao";

export default function CadastroAdmin() {
  const router = useRouter()

  const inputUsuarioRef = useRef<HTMLInputElement>(null)
  const inputEmailRef = useRef<HTMLInputElement>(null)
  const inputSenhaRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data: UsuarioPayload = {
      nome: String(formData.get("usuario")),
      email: String(formData.get("email")),
      senha: String(formData.get("senha")),
      funcao: Funcao.ADMIN,
    }

    try {
      await fetch("/api/auth/cadastrar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      })

      router.push("/admin")

    } catch (reason) {
      console.error(reason)
      alert("Falha ao registrar o administrador: " + reason)

    } finally {
      formData.keys().forEach((key) => formData.set(key, ""))
      inputUsuarioRef.current!.value = ""
      inputEmailRef.current!.value = ""
      inputSenhaRef.current!.value = ""
    }
  }

  return (
    <>
      <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 py-4 m-10 mx-auto border-2 border-[var(--color-surface-border)]">
        <h2 className="text-3xl text-center m-3 mb-3">Cadastro</h2>
        <p className="text-center mb-7">Gerenciamento de Pedidos</p>

        <form action="" method="post" className="flex flex-col" onSubmit={handleSubmit}>

          <div className="mb-5">
            <label htmlFor="usuario" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Usuário</label>
            <input type="text" name="usuario" id="usuario" placeholder="Usuário" required ref={inputUsuarioRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Email</label>
            <input type="email" name="email" id="email" placeholder="Email" required ref={inputEmailRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <div>
            <label htmlFor="senha" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Senha</label>
            <input type="password" name="senha" id="senha" placeholder="Senha" required minLength={7} ref={inputSenhaRef} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <input type="submit" value="Cadastrar" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold" />
        </form>
      </div>
    </>
  );
}
