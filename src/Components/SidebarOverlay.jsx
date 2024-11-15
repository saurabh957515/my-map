export default function SidebarOverlay({ sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`absolute z-20 h-full w-full bg-black opacity-50 sm:hidden
      ${sidebarOpen ? 'block' : 'hidden'}
      `}
      onClick={() => setSidebarOpen(false)}
    ></div>
  );
}
