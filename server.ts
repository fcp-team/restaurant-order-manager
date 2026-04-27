import { createServer } from 'http'
import next from 'next'
import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = Number(process.env.PORT)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Cria o WebSocket server SEM acoplar diretamente ao HTTP
const wss = new WebSocketServer({ noServer: true })

type ClientMessage = {
  type: string
  payload: string
}

function broadcast(data: ClientMessage) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

// Evento de conexão WebSocket
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  console.log('Cliente conectado:', req.socket.remoteAddress)

  ws.on('message', (data) => {
    try {
      const message: ClientMessage = JSON.parse(data.toString())
      console.log('Mensagem recebida:', message)

    } catch (err) {
      console.error('Erro ao processar mensagem:', err)
    }
  })

  ws.on('close', (code, reason) => {
    console.log(`Cliente desconectado: code=${code} reason=${reason}`)
  })

  ws.on('error', (err) => {
    console.error('Erro no WebSocket:', err)
  })
})

app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (req.method !== "GET" && req.url === "/ws/broadcast") {
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

    // As demais requisições HTTP serão tratadas pelo Next
    handle(req, res)
  })

  // Controle manual de upgrade (ESSENCIAL)
  server.on('upgrade', (req, socket, head) => {
    const { url } = req

    // 1. Ignora conexões internas do Next (HMR, etc.)
    if (url?.startsWith('/_next')) {
      return
    }

    // 2. Aceita apenas conexões no endpoint definido
    if (url !== '/ws') {
      socket.destroy()
      return
    }

    // 3. Realiza o upgrade corretamente
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req)
    })
  })

  server.listen(port, () => {
    console.log(`> Server rodando em http://${hostname}:${port}`)
    console.log(`> WebSocket disponível em ws://${hostname}:${port}/ws`)
    console.log(`> NODE_ENV=${process.env.NODE_ENV}\n`)
  })
})
