import React from 'react';
import { Link } from '@inertiajs/react';

export default function PrimaryButtonLink({ href, children, className }) {
  return (
    <Link
      href={href}
      className={`inline-flex w-64 items-center justify-center rounded-full border border-mlmblue-400 bg-mlmgray-100 py-1.5 text-xs font-bold uppercase text-mlmblue-400 hover:bg-mlmblue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-mlmblue-400 focus:ring-offset-2 ${className}`}
    >
      {children}
    </Link>
  );
}
