import React from 'react';
import logo from '../../images/Latis WelcomeLogin.svg';
export default function WelcomeLogin({ className, white = false }) {
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
