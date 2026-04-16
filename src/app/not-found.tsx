import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-[var(--color-text-primary)] text-7xl">404</h1>
      <p className="text-[var(--color-text-primary)] text-3xl mt-4 mb-9">Página não encontrada!</p>
      <Link href="/" className="cursor-pointer bg-[var(--color-button-action)] transition duration-300 hover:bg-[var(--color-button-action-hover)] border-[var(--color-button-action-border)] border-2 rounded-2xl p-2 px-5 mt-5">Voltar para a Home</Link>
    </div>
  );
}