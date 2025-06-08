import React from 'react';
const Text = ({ text = 'Text Label', style }) => (
  <p style={style}>{text}</p> // Apply passed styles
);
export default Text;
