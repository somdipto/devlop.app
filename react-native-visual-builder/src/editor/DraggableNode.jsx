import React from 'react';
import Button from '../components/ui/Button';
import Text from '../components/ui/Text';
import Image from '../components/ui/Image';
import Input from '../components/ui/Input';
import View from '../components/ui/View';

const DraggableNode = ({ data, selected, isConnectable }) => { // Added selected, isConnectable for future use
  const { componentType, label, props = {} } = data; // Ensure props exists, default to {}

  let ComponentToRender;
  switch (componentType) {
    case 'Button':
      ComponentToRender = Button;
      break;
    case 'Text':
      ComponentToRender = Text;
      break;
    case 'Image':
      ComponentToRender = Image;
      break;
    case 'Input':
      ComponentToRender = Input;
      break;
    case 'View':
      ComponentToRender = View;
      break;
    default:
      return <div style={{ padding: 10, border: '1px solid #ff0000', borderRadius: 5, background: '#ffeeee' }}>Unknown component: {componentType}</div>;
  }

  // Basic styling for the node wrapper itself
  // Add border if selected for visual feedback
  const nodeStyle = {
    border: selected ? '2px solid #007bff' : '1px solid #ddd',
    borderRadius: '5px',
    background: 'rgba(255, 255, 255, 0.9)', // Slightly transparent for better feel over background
    boxShadow: selected ? '0 0 10px rgba(0,123,255,0.5)' : '0 2px 5px rgba(0,0,0,0.1)',
    // The component itself will be rendered inside this div.
    // No padding here, let the component control its own padding.
  };

  // If data.props contains a style object, it will be passed to the component
  // e.g., data: { componentType: 'Button', label: 'My Button', props: { style: { width: 200, height: 50 } } }
  return (
    <div style={nodeStyle}>
      <ComponentToRender {...props} />
    </div>
  );
};

export default DraggableNode;
