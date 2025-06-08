import React from 'react';
const Button = ({ label = 'Button', style }) => (
  <button
    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    style={style} // Apply passed styles
  >
    {label}
  </button>
);
export default Button;
