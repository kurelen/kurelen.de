export default function Hello({ name = "world", onClick }: { name?: string; onClick?: () => void }) {
  return (
    <button className="rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-gray-300" onClick={onClick}>
      Hello, {name}!
    </button>
  );
}

