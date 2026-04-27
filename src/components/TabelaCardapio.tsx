import { useState } from "react";
 
type TabelaCardapioProps = {
   cardapio: Record<string, any>,
   atualizarLista: () => Promise<void>;
}

export default function TabelaCardapio({cardapio, atualizarLista}: TabelaCardapioProps){

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [ItemId, setItemId] = useState("");

  function abrirModal(item: any) {
    setNome(item.nome);
    setDescricao(item.descricao);
    setPreco(String(item.preco));
    setItemId(item.id);
    setIsModalOpen(true);
  }

  async function atualizarItem() {
    if (!nome || !descricao || !preco) {
      alert("Preencha todos os campos");
      return;
    }

    if (!/^\d*[.,]?\d*$/.test(preco)) {
      alert("Preço inválido");
      return;
    }

    const precoFormatado = preco ? parseFloat(preco.replace(",", ".")) : undefined;

    try {
      const response = await fetch("/api/menu/item/atualizar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idMenu: cardapio.id,
          idItem: ItemId,
          payload: {
            nome: nome || undefined,
            descricao: descricao || undefined,
            ...(precoFormatado ? { preco: precoFormatado } : {})
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar");
      }

      console.log("Sucesso:", data);
      alert("Item do cardápio atualizado com sucesso!");

      setNome("");
      setDescricao("");
      setPreco("");
      setIsModalOpen(false);
      await atualizarLista();

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar item do cardápio");
    }
  }
   
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
                <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--color-text-highlight)]">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {cardapio.itens.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{item.descricao}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-text-highlight)] whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.preco)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-text-highlight)] whitespace-nowrap">
                    <button onClick={() => abrirModal(item)} className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-4 my-2 shadow-md text-[var(--color-text-inverse)] font-bold">Atualizar</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Atualizar item</h2>

            <div className="mb-4">
              <label htmlFor="nomeItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Nome do Item</label>
              <input 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text" 
                name="nomeItem" 
                id="nomeItem" 
                placeholder="Nome do Item" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="descricaoItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Descrição do Item</label>
              <input 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                type="text" 
                name="descricaoItem" 
                id="descricaoItem" 
                placeholder="Descrição do Item" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="precoItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Preço do Item</label>
              <input 
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                type="text" 
                name="precoItem" 
                id="precoItem" 
                placeholder="00.00" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="cursor-pointer px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors sm:w-auto">
                Cancelar
              </button>
              <button onClick={atualizarItem} className="cursor-pointer px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors sm:w-auto">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>   
  )
}