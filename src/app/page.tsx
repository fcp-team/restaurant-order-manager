"use client"

import { getSocket } from "@/lib/ws-client"

import styles from "./page.module.css"

const socket = getSocket()

socket.addEventListener("open", () => console.log("WebSocket connection established"))

socket.addEventListener("message", (event) => {
  console.log("Received message from server: ", JSON.parse(event.data))
})

export default function Home() {

  function sendMessage() {
    const event = {
      type: "new_order",
      restaurantId: 1,
      orderId: 3
    }

    socket.send(JSON.stringify(event))
  }

  return (
    <>
      <button type="button" onClick={sendMessage}>Enviar mensagem</button>
    </>
  )
}
