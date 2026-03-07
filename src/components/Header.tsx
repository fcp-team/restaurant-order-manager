import Avatar from "./Avatar"

export default function Header(){
    return (
        <header className="flex flex-row p-3 px-5 items-center justify-between">
            <h1 className="text-2xl">Gerenciamento e Análise de Pedidos</h1>
            <Avatar initials="HE" color="#52BC1D" size={50}/>
        </header>
    )
}