import React from 'react';
import { Link } from '@inertiajs/react';
import { join } from 'lodash';
import { classNames } from '@/Providers/helpers';

export default function NavLink({ href, active, children, className }) {
  return (
    <Link
      href={href}
      className={join(
        [
          className,
          classNames(
            active
              ? 'bg-mlmblue-400 text-white'
              : 'text-mlmblue-700 hover:bg-mlmgray-600',
            'group flex items-center rounded-full px-3 py-1.5 text-xs font-medium uppercase'
          ),
        ],
        ' '
      )}
    >
      {children}
    </Link>
  );
}
