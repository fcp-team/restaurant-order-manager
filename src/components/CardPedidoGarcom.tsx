import { useState } from "react"

type CardGarcomProps = {
    pedido: Record<string, any>
}

export default function CardPedidoGarcom({pedido}: CardGarcomProps){
    
    const [estado, setEstado] = useState(pedido.estado)

    function mudarEstado() {
        const novoEstado = "Entregue"
        
        setEstado(novoEstado)
        
        fetch("/api/pedido/atualizar-status", {
            method: 'PATCH',
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({ idPedido: pedido.id, novoStatus: novoEstado })
        })
    }

    return (
        <div className="w-full max-w-md bg-[var(--color-surface)] border-[var(--color-surface-border)] border-2 flex flex-col rounded-2xl p-4 m-4">
            <h3 className="text-2xl font-bold">Pedido n°{pedido.numeroPedido} - Mesa {pedido.numeroMesa}</h3>
            <p className="pt-2">{pedido.data}</p>
            <p className="pt-1">Estado: {estado}</p>
            <ul className="text-lg list-disc list-inside m-3">
                {pedido.itens?.map((item: any, index: number) => (
                    <li key={index}>{item.nome ?? item}</li>
                ))}
            </ul>
            <button onClick={mudarEstado} className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-
             [var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 m-3">
                Finalizar Pedido
            </button>
        </div>
    )
}