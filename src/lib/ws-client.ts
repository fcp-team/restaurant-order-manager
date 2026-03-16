let socket: WebSocket | null = null

export function getSocket() {
  if (!socket) socket = new WebSocket("ws://localhost:8080")
  return socket
}
