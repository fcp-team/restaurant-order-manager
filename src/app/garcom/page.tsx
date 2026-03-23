"use client"
import Header from "@/components/Header";
import CardPedidoGarcom from "@/components/CardPedidoGarcom";

export default function Garcom() {
  return (
    <>
      <Header/>
      <h2 className="text-3xl m-8">Pedidos Prontos</h2>
      <div className="flex flex-row gap-10 flex-wrap justify-center items-center">
        {/* TODO: pegar os pedidos prontos e colocar em um map com CardPedidoGarcom */}
      </div>
    </>
  );
}