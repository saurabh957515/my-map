import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';

const NotificationModal = () => {
  const { getBackGroudJobProcess } = usePage().props;

  return (
    <div className="flex-grow">
      {getBackGroudJobProcess?.map((data, index) => (
        <div key={index} className="flex items-center px-4 py-1.5">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-700">
              {data?.job_type}
            </h3>
            <h3 className="flex space-x-2 text-sm font-medium text-gray-500">
              <span className="mr-1 text-gray-700"> Status : </span>{' '}
              {data?.status}
              {data?.status === 'Completed' ? (
                <CheckCircleIcon className="h-5 w-8 text-green-400" />
              ) : (
                data?.status === 'Pending' && (
                  <ExclamationCircleIcon className="h-5 w-8 text-gray-700" />
                )
              )}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              <span className="text-gray-700">File :</span> {data?.file_name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationModal;
