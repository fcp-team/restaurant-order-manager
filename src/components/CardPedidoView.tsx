type CardViewProps = {
    pedido: Record<string, any>
}

export default function CardPedidoView({pedido}: CardViewProps){
    return (
        <div style={{width: 430}} className="bg-surface border-[var(--color-surface-border)] border-[var(--color-button-action-border)] border-2 flex flex-col rounded-2xl p-4 m-4">
            <h3 className="text-4xl">Pedido n°{pedido.id} - Mesa {pedido.numeroMesa}</h3>
            <p className="pt-2">{new Date(pedido.criadoEm).toLocaleString()}</p>
             <p className="pt-2">{pedido.status}</p>
            <ul className="text-2xl list-disc list-inside m-3">
                 {pedido.itens.map((item: any) => (
                    <li key={item.id} className="mb-4">
                    {item.quantidade}x {item.nome} - {item.status}
                    {item.observacao && ` (${item.observacao})`}
                    </li>
                ))}
            </ul>
        </div>
    )
}