 type TabelaCardapioProps = {
    cardapio: Record<string, any>
}

export default function TabelaCardapio({cardapio}: TabelaCardapioProps){
    return (
       <div className="p-5">
            <div className="max-w-5xl mx-auto">
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{cardapio.nome}</h2>

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
                        {cardapio.itens.map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-800">
                            {item.nome}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                            {item.descricao}
                            </td>
                            <td className="px-4 py-3 font-semibold text-[var(--color-text-highlight)] whitespace-nowrap">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(item.preco)}
                            </td>
                         </tr>
                        ))}
                    </tbody>

                </table>
                </div>
           </div>
        </div>   
    )
}