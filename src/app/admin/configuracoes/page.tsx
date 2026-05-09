"use client"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Link from "next/link"

export default function Configuracoes() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(false)
  const [idUsuario, setIdUsuario] = useState("")

  useEffect(() => {
    async function carregarUsuario() {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setIdUsuario(data.id_usuario)
        setNome(data.nome)
        setEmail(data.email)
      }
    }
    carregarUsuario()
  }, [])

  async function salvar() {
    setErro("")
    setMensagem("")

    if (senha && senha !== confirmarSenha) {
      setErro("As senhas não coincidem!")
      return
    }

    setLoading(true)
    try {
      const body: Partial<{ nome: string; email: string; senha: string }> = { nome, email }
      if (senha) body.senha = senha

      const res = await fetch(`/api/usuarios/${idUsuario}/atualizar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setMensagem("Dados atualizados com sucesso!")
        setSenha("")
        setConfirmarSenha("")
      } else {
        const data = await res.json()
        setErro(data.error ?? "Erro ao atualizar dados.")
      }
    } catch {
      setErro("Erro ao atualizar dados.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="p-8">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
          <h2 className="text-3xl font-bold">Configurações</h2>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-lg mx-auto">
          <div className="flex flex-col gap-4">

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nova senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Deixe em branco para não alterar"
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              />
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            {mensagem && <p className="text-green-600 text-sm">{mensagem}</p>}

            <button
              onClick={salvar}
              disabled={loading}
              className="cursor-pointer bg-[var(--color-button-action)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-2 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}