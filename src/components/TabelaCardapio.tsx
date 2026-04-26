 type TabelaCardapioProps = {
    itemPedido: Record<string, any>
}

export default function TabelaCardapio({itemPedido}: TabelaCardapioProps){
    return (
       <div className="p-4">
            <div className="max-w-5xl mx-auto">
                
                <h2 className="text-2xl font-bold text-gray-800">Nome Cardápio</h2>
                <p className="text-gray-500 mb-4">Cardápio com pratos do restaurante</p>

                <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    
                    <thead className="bg-[var(--color-surface)]">
                    <tr>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--color-text-highlight)]">Nome</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--color-text-highlight)]">Descrição</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--color-text-highlight)]">Valor</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y">
                    <tr className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">
                        Virada Paulista
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                        tutu de feijão cremoso, bisteca suína, couve refogada, arroz branco
                        </td>
                        <td className="px-4 py-3 font-semibold text-[var(--color-text-highlight)]">
                        R$ 25,00
                        </td>
                    </tr>
                    </tbody>

                </table>
                </div>
           </div>
        </div>   
    )
}