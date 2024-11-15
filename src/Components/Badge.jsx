export default function Badge({ children }) {
  return (
    <span className="absolute -right-1 -top-1 rounded-full bg-mlmred-700 px-1.5 py-0.5 text-xs font-medium text-white">
      {children}
    </span>
  );
}
