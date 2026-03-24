import Avatar from "./Avatar"

export default function Header(){
    return (
        <header className="flex flex-row p-3 px-5 items-center justify-between">
            <h1 className="text-2xl max-w-72">Gerenciamento e Análise de Pedidos</h1>
            {/* TODO: pegar as iniciais e a cor do usuário e colocar nas propriedades de Avatar */}
            <Avatar initials="HE" color="#52BC1D" size={50}/>
        </header>
    )
}