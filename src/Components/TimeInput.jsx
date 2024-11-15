import React from 'react';
import moment from 'moment/moment.js';
import { XMarkIcon } from '@heroicons/react/24/outline/index.js';
import TimePicker from 'rc-time-picker';

export default function TimeInput({
  onChange,
  className,
  value,
  placeholder,
  ...props
}) {
  return (
    <TimePicker
      className={className}
      value={value ? moment(value, 'h:mm A') : null}
      showSecond={false}
      onChange={time => onChange(time ? time.format('h:mm A') : '')}
      format="h:mm A"
      placement="bottomLeft"
      use12Hours
      inputReadOnly
      placeholder={placeholder}
      {...props}
    />
  );
}
