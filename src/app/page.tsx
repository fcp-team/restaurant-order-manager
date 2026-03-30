"use client"

export default function Home() {
  function get() {
    fetch('/api/pedidos?status=ABERTO')
    .then(res => res.json())
    .then(res => console.log(res))
  }
  return (
    <>
      <button onClick={get}>Fetch</button>
    </>
  )
}
