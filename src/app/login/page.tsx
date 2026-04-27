"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    // Login bem-sucedido
    router.push(data.redirectTo);
  };

  return (
    <>
      <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 m-10 mx-auto border-2 border-[var(--color-surface-border)]">
        <h2 className="text-3xl text-center m-3 mb-3">Login</h2>
        <p className="text-center mb-7">Gerenciamento de Pedidos</p>
        <form action="" method="post" className="flex flex-col" onSubmit={handleSubmit}>

          <div className="mb-5">
            <label htmlFor="email" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Email</label>
            <input type="email" name="email" id="email" placeholder="Email" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <div>
            <label htmlFor="senha" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Senha</label>
            <input type="password" name="senha" id="senha" placeholder="Senha" required minLength={7} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950" />
          </div>

          <input type="submit" value="Login" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold" />
        </form>
      </div>
    </>
  );
}
