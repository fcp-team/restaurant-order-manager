export default function Avatar({ initials = "", color = "#4CAF50", size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.4
      }}
      className="cursor-pointer rounded-full text-[var(--color-text-inverse)] font-bold flex items-center justify-center select-none"
    >
      {initials}
    </div>
  );
}