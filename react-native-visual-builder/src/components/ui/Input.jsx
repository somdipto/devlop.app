import React from 'react';
const Input = ({ placeholder = 'Input field', style }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="p-2 border border-gray-300 rounded"
    style={style} // Apply passed styles
  />
);
export default Input;
