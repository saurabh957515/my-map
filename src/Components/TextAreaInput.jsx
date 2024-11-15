import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextAreaInput(
  { className = '', isFocused = false, ...props },
  ref
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const input = ref ? ref : useRef();

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <textarea
      {...props}
      className={
        'rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-600 dark:focus:ring-blue-600 ' +
        className
      }
      ref={input}
    />
  );
});
