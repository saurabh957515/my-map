import React, { memo } from 'react';
import { Link } from '@inertiajs/react';

function SecondaryButtonLink({ href, children, method, className }) {
  return (
    <Link
      as="button"
      method={method}
      href={href}
      className={`false mx-1 mt-2 rounded-full border border-white bg-mlmblue-700 py-1.5 text-xs font-bold uppercase text-white hover:border-mlmblue-400 hover:bg-mlmblue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-mlmblue-400 focus:ring-offset-2 xl:mt-0 ${className}`}
    >
      {children}
    </Link>
  );
}
export default memo(SecondaryButtonLink);
