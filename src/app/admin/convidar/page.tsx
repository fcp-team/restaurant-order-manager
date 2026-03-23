import Header from "@/components/Header";
import Link from "next/link";

export default function Convidar(){
   return(   
      <>
        <Header/>
          <Link href="/admin" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
       <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 m-10 mx-auto border-2 border-[var(--color-surface-border)]">
            <h2 className="text-3xl text-center m-3 mb-7">Convidar Novo Membro</h2>
            <form action="" method="post" className="flex flex-col">

                <div className="mb-5">
                <label htmlFor="emailConvidar" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Email que será enviado</label>
                <input type="email" name="emailConvidar" id="emailConvidar" placeholder="Email" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                </div>

                <div>
                <label htmlFor="funcao" className="block text-[var(--color-text-primary)]-700 font-medium mb-2">Função</label>
                <select name="fucao" id="funcao" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950">
                    <option value="" disabled selected>Escolha uma opção</option>
                    <option value="garcom">Garçom</option>
                    <option value="cozinheiro">Cozinheiro</option>
                </select>
                </div>

                <input type="submit" value="Enviar Convite" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold"/>
            </form>
       </div>
      </>
   )
}