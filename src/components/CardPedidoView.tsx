type CardViewProps = {
    numeroPedido: string,
    numeroMesa: string,
    data: string,
    itens: string[],
    estado: string
}

export default function CardPedidoView({numeroPedido, numeroMesa, data, itens, estado}: CardViewProps){
    return (
        <div style={{width: 430}} className="bg-surface border-[var(--color-surface-border)] border-[var(--color-button-action-border)] border-2 flex flex-col rounded-2xl p-4 m-4">
            <h3 className="text-4xl">Pedido n°{numeroPedido} - Mesa {numeroMesa}</h3>
            <p className="pt-2">{data}</p>
            <p className="pt-2">{estado}</p>
            <ul className="text-2xl list-disc list-inside m-3">
                {itens.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}