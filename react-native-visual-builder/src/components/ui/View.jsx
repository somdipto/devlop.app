import React from 'react';
const View = ({ children, style }) => (
  <div
    className="p-4 border border-dashed border-gray-400 min-h-[50px]"
    style={style} // Apply passed styles
  >
    {children || 'View Container'}
  </div>
);
export default View;
