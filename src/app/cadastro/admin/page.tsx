"use client"

import Link from "next/link";

export default function CadastroAdmin() {
  return (
    <>
       <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 py-4 m-10 mx-auto border-2 border-[var(--color-surface-border)]">
            <h2 className="text-3xl text-center m-3 mb-3">Cadastro</h2>
            <p className="text-center mb-7">Gerenciamento de Pedidos</p>
            <form action="" method="post" className="flex flex-col">

                <div className="mb-5">
                <label htmlFor="usuario" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Usuário</label>
                <input type="text" name="usuario" id="usuario" placeholder="Usuário" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                </div>

                <div className="mb-5">
                <label htmlFor="email" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                </div>

                <div className="mb-5">
                  <label htmlFor="restaurante" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Restaurante</label>
                <input type="text" name="restaurante" id="restaurante" placeholder="Restaurante" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                </div>

                <div>
                  <label htmlFor="senha" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Senha</label>
                <input type="password" name="senha" id="senha" placeholder="Senha" required minLength={7} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                </div>

                <input type="submit" value="Cadastrar" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold"/>
            </form>
       </div>
       <div className="flex justify-center items-center">
        <Link href={"/login"} className="mb-5 text-center underline text-[var(--color-button-auth)] transition duration-300 hover:text-[var(--color-button-auth-hover)]">Voltar</Link>
       </div>
    </>
  );
}