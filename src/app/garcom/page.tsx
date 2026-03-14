"use client"
import Header from "@/components/Header";
import CardPedidoView from "@/components/CardPedidoView";

export default function Garcom() {
  const pedidosTeste = [
    { numeroPedido: "121", numeroMesa: "4", data: "12/03/2026", estado: "Pronto", itens: ["Nome do Prato", "Nome do Prato", "Nome do Prato"] },
    { numeroPedido: "122", numeroMesa: "7", data: "12/03/2026", estado: "Pronto", itens: ["Nome do Prato", "Nome do Prato"] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center mt-8">
        <h1 className="text-4xl mb-6">Pedidos</h1>
        <button className="flex items-center gap-2 bg-button-action border-2 border-surface-border px-16 py-3 rounded-lg mb-8 text-lg">
          + Adicionar Pedido
        </button>
        <h2 className="text-xl font-bold mb-4">Pedidos Prontos</h2>
        <div className="flex flex-row gap-4 flex-wrap justify-center items-start">
          {pedidosTeste.map((pedido, index) => (
            <CardPedidoView key={index} {...pedido} />
          ))}
        </div>
      </div>
    </div>
  );
}