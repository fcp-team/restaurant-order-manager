let socket: WebSocket | null = null

const wsEndpoint = process.env.NEXT_PUBLIC_WS_SERVER || "ws://localhost:3000/ws"

export function getSocket() {
  if (!socket) socket = new WebSocket(wsEndpoint)
  return socket
}
