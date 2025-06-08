import React, { useState } from 'react';
import EditorView from './editor/EditorView';
import LandingPage from './components/LandingPage';
import './index.css'; // Ensure Tailwind is imported

function App() {
  const [showEditor, setShowEditor] = useState(false);

  if (!showEditor) {
    return <LandingPage onGetStarted={() => setShowEditor(true)} />;
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowEditor(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <span>←</span>
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🚀</span>
              <h1 className="text-xl font-bold text-gray-900">AppCraft AI - Editor</h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <EditorView />
    </div>
  );
}

export default App;
