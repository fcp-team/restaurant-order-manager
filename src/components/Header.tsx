"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

function OpcoesModal({ closeSettingsFn }: { closeSettingsFn: () => void }) {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      router.push("/login")
    
    } catch (reason) {
      console.error("Erro ao realizar logout:", reason)
      alert("Erro ao realizar logout")
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={closeSettingsFn}
    >
      <div
        className="bg-white p-6 rounded-lg w-80 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-(--color-text-highlight)">
            Configurações
          </h2>
          <button
            type="button"
            className="text-(--color-text-secondary) hover:text-(--color-text-highlight) transition-colors"
            onClick={closeSettingsFn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <Link
            href="#"
            className="block w-full px-4 py-3 text-center bg-(--color-button-action) text-(--color-text-primary) rounded-md font-medium hover:bg-(--color-button-action-hover) transition-colors cursor-pointer border-2 border-(--color-button-action-border)"
          >
            Editar perfil
          </Link>
          <button
            type="button"
            className="w-full px-4 py-3 bg-(--color-button-danger) rounded-md font-medium hover:bg-(--color-button-danger-hover) hover:text-(--color-button-danger) transition-colors cursor-pointer border-2 border-(--color-button-danger-border) text-(--color-button-danger-border)"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)

  const closeSettings = () => setIsSettingsOpen(false)

  return (
    <header className="flex flex-row p-3 px-5 items-center justify-between">
      <Image src="/imgs/logo.png" alt="Logo" width={72} height={72} />

      <h1 className="text-xl max-w-72">Gerenciamento de Pedidos</h1>

      <button
        type="button"
        className="cursor-pointer p-1.5 rounded-full hover:bg-gray-300 transition-colors"
        onClick={toggleSettings}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" /></svg>
      </button>

      {isSettingsOpen && <OpcoesModal closeSettingsFn={closeSettings} />}
    </header>
  )
}
