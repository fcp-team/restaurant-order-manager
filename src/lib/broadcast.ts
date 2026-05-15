const hostname = process.env.HOST || 'localhost'
const port = Number(process.env.PORT) || 3000

export default async function broadcast(type: string, payload: any) {
  await fetch(`http://${hostname}:${port}/ws/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload })
  })
}
