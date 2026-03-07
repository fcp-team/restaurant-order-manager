import { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 8080 })
console.log("WebSocket server is running on ws://localhost:8080")

wss.on("connection", (ws) => {
  console.log("New client connected")

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString())
    console.log("Received message: ", data)

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  })

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})
