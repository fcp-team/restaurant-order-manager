import { useState } from "react"

type CardCozinhaProps = {
    pedido: Record<string, any>
}

export default function CardPedidoCozinha({pedido}: CardCozinhaProps){
    
     const [itens, setItens] = useState(pedido.itens)

    function mudarEstado() {
       
            const novosItens = itens.map((item: any) => ({
            ...item,
            status: "Finalizado"
        }))

        setItens(novosItens)

         fetch("/api/pedido", {method: 'POST',headers: {"Content-Type": 'application/json'}, body: JSON.stringify({novosItens})})
      
    }

    return (
        <div style={{width: 430}} className="bg-[var(--color-surface)] border-[var(--color-surface-border)] border-[var(--color-button-action-border)] border-2 flex flex-col rounded-2xl p-4 m-4">
            <h3 className="text-4xl">Pedido n°{pedido.numeroPedido} - Mesa {pedido.numeroMesa}</h3>
            <p className="pt-2">{pedido.data}</p>
            <ul className="text-2xl list-disc list-inside m-3">
                {pedido.itens?.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <button onClick={mudarEstado} className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 m-3">
              Mudar Estado
            </button>
        </div>
    )
}