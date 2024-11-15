import React from 'react';
import logo from '../../images/Latis OrganizationLogin.svg';
export default function OrganizationLogin({ className, white = false }) {
  return (
    <img
      src={logo}
      className={`${className} ${
        white ? 'fill-latisPrimary-900' : 'fill-mlmblue-700'
      }`}
      alt="Logo"
    />
  );
}
