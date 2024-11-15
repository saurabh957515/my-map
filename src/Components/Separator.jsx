export default function Separator({ className }) {
  return (
    <span className="block py-2">
      <span className={`w-100 block h-px bg-white ${className}`} />
    </span>
  );
}
