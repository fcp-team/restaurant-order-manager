"use client"

import { useEffect, useRef } from "react"
import { getSocket } from "@/lib/ws-client"

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!socketRef.current) socketRef.current = getSocket()

    const socket = socketRef.current

    socket.onopen = () => console.log("Conectado ao servidor")

    socket.onmessage = (event) => {
      console.log("Mensagem do servidor:", event.data)
    }

    return () => socket.close()
  }, [])

  function handleClick() {
    fetch("/api/pedidos?status=ABERTO")
      .then((res) => res.json())
      .then((res) => console.log(res))

    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", payload: "Olá, servidor!" }))
    }
  }

  return (
    <>
      <h1>WebSocket Test</h1>
      <button type="button" onClick={handleClick}>Fetch</button>
    </>
  )
}
