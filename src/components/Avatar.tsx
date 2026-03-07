export default function Avatar({ initials = "", color = "#4CAF50", size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color
      }}
      className="cursor-pointer rounded-full text-2xl text-[var(--color-text-inverse)] font-bold flex items-center justify-center select-none"
    >
      {initials}
    </div>
  );
}