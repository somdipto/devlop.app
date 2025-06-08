import React from 'react';
const Image = ({ src = 'https://via.placeholder.com/150', alt = 'placeholder', style }) => (
  <img
    src={src}
    alt={alt}
    width="100" // Default width, can be overridden by style
    style={style} // Apply passed styles
  />
);
export default Image;
