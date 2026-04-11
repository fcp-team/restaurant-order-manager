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
      console.log(JSON.parse(event.data))
    }

    return () => socket.close()
  }, [])

  function handleClick() {
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "garcon@gmail.com",
        senha: "123",
      })
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
  }

  function update() {
    fetch("/api/pedido/item/atualizar-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPedido: "1",
        idItem: "1",
        status: "PRONTO"
      })
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
  }

  return (
    <>
      <h1>WebSocket Test</h1>
      <button type="button" onClick={handleClick}>Fetch</button>
      <button type="button" onClick={update}>Update</button>
    </>
  )
}
