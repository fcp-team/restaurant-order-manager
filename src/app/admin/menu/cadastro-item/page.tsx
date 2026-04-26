import Header from "@/components/Header";
import Link from "next/link";

export default function CadastroItem(){
   return(   
      <>
        <Header/>
          <Link href="/admin/menu" className="inline-flex items-center text-emerald-950 hover:text-emerald-900 font-medium m-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        <div className="w-full max-w-96 flex flex-col justify-center bg-[var(--color-surface)] rounded-2xl shadow-lg p-7 py-4 m-10 mt-5 mx-auto border-2 border-[var(--color-surface-border)]">
               <h2 className="text-3xl text-center m-3 mb-4">Cadastro de Item no Cardápio</h2>
               <form action="" method="post" className="flex flex-col gap-3">

                     {/* fazer um selec que pegue as opções de cardapio com seus nomes, mas o valor enviado é o id */}

                     <div>
                        <label htmlFor="nomeItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Nome do Item</label>
                        <input type="text" name="nomeItem" id="nomeItem" placeholder="Nome do Item" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                     </div>

                      <div>
                        <label htmlFor="descricaoItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Descrição do Item</label>
                        <input type="text" name="descricaoItem" id="descricaoItem" placeholder="Descrição do Item" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                     </div>

                     <div>
                        <label htmlFor="precoItem" className="block text-[var(--color-text-primary)]-700 font-medium mb-1">Preço do Item</label>
                        <input type="number" name="precoItem" id="precoItem" placeholder="Preço do Item" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-cyan-50 focus:outline-none focus:ring-2 focus:caret-green-950"/>
                     </div>

                     <input type="submit" value="Cadastrar" className="cursor-pointer bg-[var(--color-button-auth)] transition duration-300 hover:bg-[var(--color-button-auth-hover)] rounded-2xl p-2 px-5 my-9 min-w-[200px] shadow-md text-[var(--color-text-inverse)] font-bold"/>
               </form>
         </div>
      </>
   )
}