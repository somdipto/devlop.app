import React, { useState, useCallback, useEffect } from 'react';
import Canvas from './Canvas';
import LivePreview from './LivePreview';
import templates from './templates';
import { exportProjectAsZip } from '../core/ExportService'; // Import export function
import { applyNodeChanges, applyEdgeChanges, addEdge as rfAddEdge } from 'reactflow';

let globalScreenId = 0;
const getScreenId = () => `screen_${globalScreenId++}`;

let globalNodeId = 0;
const getGlobalId = () => `dndnode_global_${globalNodeId++}`;

const createNewScreen = (name) => ({
  id: getScreenId(),
  name: name || `Screen ${globalScreenId + 1}`, // Adjusted for 1-based naming for display
  nodes: [],
  edges: [],
});

const onDragStart = (event, nodeType, nodeLabel) => {
  event.dataTransfer.setData('application/reactflow-type', nodeType);
  event.dataTransfer.setData('application/reactflow-label', nodeLabel || nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const EditorView = () => {
  const [screens, setScreens] = useState([createNewScreen('Screen 1')]);
  const [activeScreenId, setActiveScreenId] = useState(screens[0].id);

  const activeScreen = screens.find(s => s.id === activeScreenId) || screens[0];

  const updateScreen = useCallback((screenId, newNodes, newEdges) => {
    setScreens(prevScreens =>
      prevScreens.map(s =>
        s.id === screenId ? { ...s, nodes: newNodes, edges: newEdges } : s
      )
    );
  }, [setScreens]);

  const onNodesChange = useCallback(
    (changes) => {
      const currentScreen = screens.find(s => s.id === activeScreenId);
      if (currentScreen) {
        const newNodes = applyNodeChanges(changes, currentScreen.nodes);
        updateScreen(activeScreenId, newNodes, currentScreen.edges);
      }
    },
    [activeScreenId, screens, updateScreen]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const currentScreen = screens.find(s => s.id === activeScreenId);
      if (currentScreen) {
        const newEdges = applyEdgeChanges(changes, currentScreen.edges);
        updateScreen(activeScreenId, currentScreen.nodes, newEdges);
      }
    },
    [activeScreenId, screens, updateScreen]
  );

  const onConnect = useCallback(
    (connection) => {
      const currentScreen = screens.find(s => s.id === activeScreenId);
      if (currentScreen) {
        const newEdges = rfAddEdge(connection, currentScreen.edges);
        updateScreen(activeScreenId, currentScreen.nodes, newEdges);
      }
    },
    [activeScreenId, screens, updateScreen]
  );

  const addNodeToActiveScreen = useCallback((newNodeData) => {
    const currentScreen = screens.find(s => s.id === activeScreenId);
    if (currentScreen) {
      const newNode = {
        id: getGlobalId(),
        ...newNodeData,
      };
      const newNodes = currentScreen.nodes.concat(newNode);
      updateScreen(activeScreenId, newNodes, currentScreen.edges);
    }
  }, [activeScreenId, screens, updateScreen]);

  const loadTemplateForActiveScreen = (templateKey) => {
    const template = templates[templateKey];
    const currentScreen = screens.find(s => s.id === activeScreenId);
    if (template && currentScreen) {
      globalNodeId = 0;
      const newNodes = template.nodes.map(node => ({...node, id: getGlobalId() }));
      const newEdges = (template.edges || []).map(edge => ({...edge, id: `e${getGlobalId()}-${getGlobalId()}`}));
      updateScreen(activeScreenId, newNodes, newEdges);
    }
  };

  const handleAddScreen = () => {
    const newScreen = createNewScreen();
    setScreens(prevScreens => [...prevScreens, newScreen]);
    setActiveScreenId(newScreen.id);
    globalNodeId = 0;
  };

  useEffect(() => {
    if (!screens.find(s => s.id === activeScreenId) && screens.length > 0) {
      setActiveScreenId(screens[0].id);
    }
  }, [screens, activeScreenId]);

  const handleExport = () => {
    // Pass all screens and the ID of the screen that should be the initial route
    exportProjectAsZip(screens, activeScreenId, 'MyAwesomeApp');
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 space-y-4 overflow-y-auto">
        {/* Export Button */}
        <div>
          <button
            onClick={handleExport}
            className="w-full p-2 mb-4 bg-purple-600 text-white rounded hover:bg-purple-700 font-bold"
          >
            Export Project (ZIP)
          </button>
        </div>
        {/* Components */}
        <div>
          <h2 className="text-xl font-bold mb-2">Components</h2>
          {['Button', 'Text', 'Image', 'Input', 'View'].map(comp => (
            <div
              key={comp}
              className="p-2 mb-2 border border-gray-300 rounded cursor-grab bg-white shadow-sm hover:shadow-md"
              onDragStart={(event) => onDragStart(event, 'uiComponentNode', comp)}
              draggable
            >{comp}</div>
          ))}
        </div>
        <hr />
        {/* Templates */}
        <div>
          <h2 className="text-xl font-bold mb-2">Templates</h2>
          {Object.keys(templates).map(key => (
            <button key={key} onClick={() => loadTemplateForActiveScreen(key)}
              className="w-full p-2 mb-2 text-left bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >{templates[key].name}</button>
          ))}
        </div>
        <hr />
        {/* Screens */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Screens</h2>
            <button onClick={handleAddScreen}
              className="p-1 px-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >+ Add</button>
          </div>
          {screens.map(screen => (
            <button key={screen.id} onClick={() => { setActiveScreenId(screen.id); globalNodeId = 0; }}
              className={`w-full p-2 mb-2 text-left rounded text-sm ${
                screen.id === activeScreenId ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >{screen.name}</button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="w-1/2 border-l border-r border-gray-300">
        {activeScreen && (
          <Canvas
            key={activeScreen.id}
            nodes={activeScreen.nodes}
            edges={activeScreen.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            addNode={addNodeToActiveScreen}
          />
        )}
      </div>

      {/* Live Preview Area */}
      <div className="w-1/4 bg-gray-50 p-1">
        <h2 className="text-xl font-bold mb-2 text-center">Live Preview</h2>
        <LivePreview screens={screens} activeScreenId={activeScreenId} />
      </div>
    </div>
  );
};

export default EditorView;
