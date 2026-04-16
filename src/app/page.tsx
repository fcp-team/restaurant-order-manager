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
    fetch("/api/pedido/criar", {
      method: "POST",
      headers: { "Contetnt-Type": "application/json" },
      body: JSON.stringify({
        numeroMesa: "3",
        itens: [
          {
            idItemMenu: "1",
            quantidade: 2,
          },
          {
            idItemMenu: "3",
            quantidade: 1,
          },
        ]
      })
    })
      .then((res) => res.json())
      .then((res) => console.log(res))

    // fetch("/api/pedidos?status=ABERTO")
    //   .then((res) => res.json())
    //   .then((res) => console.log(res))

    // const socket = socketRef.current
    // if (socket && socket.readyState === WebSocket.OPEN) {
    //   socket.send(JSON.stringify({ type: "message", payload: "Olá, servidor!" }))
    // }
  }

  return (
    <>
      <h1>WebSocket Test</h1>
      <button type="button" onClick={handleClick}>Fetch</button>
    </>
  )
}
