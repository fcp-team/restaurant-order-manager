import { WebSocketServer } from "ws"
import http from "http"

const server = http.createServer()

const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  console.log("New client connected")

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString())
    console.log("Received message: ", data)


  })

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})

function broadcast(data: unknown) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

server.listen(8080, () => console.log("Servidor WebSocket executando na porta 8080"))

server.on("request", async (req, res) => {
  if (req.method === "POST" && req.url === "/broadcast") {
    let body = ""

    req.on("data", (chunk) => {
      body += chunk
    })

    req.on("end", () => {
      const data = JSON.parse(body)
      broadcast(data)

      res.writeHead(200)
      res.end("ok")
    })

    return
  }

  res.writeHead(404)
  res.end("ok")
})
