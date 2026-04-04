let socket: WebSocket | null = null

export function getSocket() {
  if (!socket) socket = new WebSocket("ws://localhost:3000/ws")
  return socket
}
