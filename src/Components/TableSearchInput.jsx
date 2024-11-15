import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TextInput from '@/Components/TextInput';

export default function TableSearchInput({
  value,
  className,
  handleChange,
  onClick,
}) {
  return (
    <div>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <TextInput
            type="search"
            name="search"
            value={value}
            id="search"
            className={`block w-full rounded-r-none ${className}`}
            autoComplete="search"
            placeholder="Search here..."
            handleChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="group relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-mlmblue-400 bg-white px-4 py-1 hover:scale-100 hover:bg-mlmblue-400"
          onClick={onClick}
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-mlmblue-400 group-hover:text-white"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
