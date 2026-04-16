import Header from "@/components/Header";
import Link from "next/link";

export default function Relatorio(){
   return(   
      <>
        <Header/>
         <Link href="/admin" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
         </Link>
      </>
   )
}