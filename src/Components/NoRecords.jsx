import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export default function NoRecords({
  className,
  message = 'No Records Found.',
}) {
  return (
    <div className={`flex px-6 py-4 text-sm text-mlmgray-800 ${className}`}>
      <ExclamationCircleIcon className="mr-2 h-5 text-mlmblue-400" /> {message}
    </div>
  );
}
