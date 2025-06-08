import React, { useCallback, useRef, useEffect } from 'react'; // Added useEffect
import ReactFlow, { Background, Controls } from 'reactflow'; // Removed addEdge, applyNodeChanges, applyEdgeChanges
import 'reactflow/dist/style.css';

import DraggableNode from './DraggableNode';

const nodeTypes = { uiComponentNode: DraggableNode };

// Removed getId from here, it will be managed by EditorView or a global utility

const Canvas = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null); // Keep this for screenToFlowPosition

  // Remove local nodes/edges state and their setters
  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState([]);

  // onNodesChange, onEdgesChange, onConnect are now passed as props

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) {
        console.error('ReactFlow instance not available for drop');
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Call addNode from props, passing the necessary data for a new node
      addNode({
        type, // This is 'uiComponentNode'
        position,
        data: { componentType: label, label: `${label} component`, props: { label: label } },
      });
    },
    [reactFlowInstance, addNode] // addNode is now a dependency
  );

  const onInit = (instance) => setReactFlowInstance(instance);

  // Update the initial test node in EditorView.jsx or remove it if templates are preferred
  // For now, Canvas.jsx will render whatever nodes are passed in.
  // useEffect(() => {
  //  if (nodes.length === 0 && addNode) { // Example: Add a default node if canvas is empty
  //    addNode({type: 'uiComponentNode', position: {x: 50, y: 50}, data: {componentType: 'Text', label: 'Start Here'}});
  //  }
  // }, [nodes, addNode]);


  return (
    <div className="h-full w-full" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes} // Use nodes from props
        edges={edges} // Use edges from props
        onNodesChange={onNodesChange} // Use onNodesChange from props
        onEdgesChange={onEdgesChange} // Use onEdgesChange from props
        onConnect={onConnect} // Use onConnect from props
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        className="bg-white"
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
