import { useState, useEffect} from "react"

type CardCozinhaProps = {
    pedido: Record<string, any>
}

export default function CardPedidoCozinha({pedido}: CardCozinhaProps){
    
     const [itens, setItens] = useState<any[]>([]);

     useEffect(() => {
        setItens(pedido.itens || []);
    }, [pedido]);

    async function mudarEstado() {
       
            const novosItens = itens.map((item: any) => ({
            ...item,
            status: "FINALIZADO"
        }))

        setItens(novosItens);

        const payload = {
        itens: novosItens.map((item: any) => ({
            idItemPedido: item.id, 
            novoStatus: item.status
        }))
        };

         try {
        const res = await fetch("/api/pedido/itens/atualizar-status", {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error("Falha ao atualizar no servidor");
        }
        
        console.log("Status atualizado com sucesso!");
        } catch (err) {
            console.error(err);
        }
      
    }

    return (
        <div style={{width: 430}} className="bg-[var(--color-surface)] border-[var(--color-surface-border)] border-[var(--color-button-action-border)] border-2 flex flex-col rounded-2xl p-4 m-4">
            <h3 className="text-4xl">Pedido n°{pedido.id} - Mesa {pedido.numeroMesa}</h3>
            <p className="pt-2">{new Date(pedido.criadoEm).toLocaleString()}</p>
            <ul className="text-2xl list-disc list-inside m-3">
                {itens.map((item: any) => (
                    <li key={item.id} className="mb-4">
                    {item.quantidade}x {item.nome} - {item.status}
                    {item.observacao && ` (${item.observacao})`}
                    </li>
                ))}
            </ul>
            <button onClick={mudarEstado} className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 m-3">
              Mudar Estado
            </button>
        </div>
    )
}