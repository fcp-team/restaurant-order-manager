import Header from "@/components/Header";
import Link from "next/link";

export default function Admin(){
   return(   
      <>
        <Header/>
        <div className="flex flex-col justify-center items-center text-center p-5 my-10">
            <Link href="/admin/relatorio" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5 min-w-[270px]">Ver Relatório</Link>
            <Link href="/admin/pedidos" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5 min-w-[270px]">Ver Pedidos</Link>
            <Link href="/admin/menu" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5 min-w-[270px]">Menu do Restaurante</Link>
            <Link href="/admin/convidar" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5 min-w-[270px]">Convidar Novo Membro</Link>
        </div>
      </>
   )
}