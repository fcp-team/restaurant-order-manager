type CardActionProps = {
    numeroPedido: string,
    numeroMesa: string,
    data: string,
    buttonText: string
    itens: string[],
    onButtonClick: () => void
}

export default function CardPedidoAction({numeroPedido, numeroMesa, data, itens, buttonText, onButtonClick}: CardActionProps){
    return (
        <div style={{width: 430}} className="bg-[var(--color-surface)] border-[var(--color-surface-border)] 
        border-[var(--color-button-action-border)] border-2 flex flex-col rounded-2xl p-4 m-4">
            <h3 className="text-4xl">Pedido n°{numeroPedido} - Mesa {numeroMesa}</h3>
            <p className="pt-2">{data}</p>
            <ul className="text-2xl list-disc list-inside m-3">
                {itens.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <button onClick={onButtonClick} className="cursor-pointer bg-[var(--color-button-action)] transition 
            duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] 
            border-2 rounded-2xl p-2 px-5 m-3">     
        {buttonText}
    </button>
 </div>
    )
}