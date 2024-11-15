import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from '@inertiajs/react';
import { classNames } from '@/Providers/helpers';

export default function Pagination({ className, data }) {
  return (
    data.links.length > 3 && (
      <div
        className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${className}`}
      >
        <div className="flex flex-1 justify-between sm:hidden">
          {typeof data?.prev_page_url !== 'undefined' &&
            (data.prev_page_url == null ? (
              <div className="pointer-events-none relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-mlmgray-700 outline-none focus:shadow-none">
                Previous
              </div>
            ) : (
              <Link
                preserveScroll
                href={data.prev_page_url}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-mlmgray-900 hover:bg-gray-50"
              >
                Previous
              </Link>
            ))}
          {typeof data?.next_page_url !== 'undefined' &&
            (data.next_page_url == null ? (
              <div className="pointer-events-none relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-mlmgray-700 outline-none focus:shadow-none">
                Next
              </div>
            ) : (
              <Link
                preserveScroll
                href={data.next_page_url}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </Link>
            ))}
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          {data?.from && data?.to && data?.total && (
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{data.from}</span> to{' '}
                <span className="font-medium">{data.to}</span> of{' '}
                <span className="font-medium">{data.total}</span> results
              </p>
            </div>
          )}
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {typeof data?.prev_page_url !== 'undefined' &&
                (data.prev_page_url == null ? (
                  <div className="pointer-events-none relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-mlmgray-700 outline-none focus:shadow-none">
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                ) : (
                  <Link
                    preserveScroll
                    href={data.prev_page_url}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
              {data.links
                .filter((link, key) => key > 0 && key < data.links.length - 1)
                .map((link, key) => (
                  <Link
                    preserveScroll
                    key={key}
                    href={link.url}
                    aria-current="page"
                    className={classNames(
                      link.active
                        ? 'border-mlmblue-600 z-10 bg-mlmblue-700 text-white'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              {typeof data?.next_page_url !== 'undefined' &&
                (data.next_page_url == null ? (
                  <div className="pointer-events-none relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-mlmgray-700 outline-none focus:shadow-none">
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                ) : (
                  <Link
                    preserveScroll
                    href={data.next_page_url}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </div>
    )
  );
}
