import React, { useState } from 'react';
import TextToAppGenerator from '../ai/TextToAppGenerator';

const TextToAppInterface = ({ onAppGenerated }) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [examples] = useState([
    "Create a fitness tracking app with a home screen showing daily stats, a workout screen with exercise list, and a profile screen with user information and settings.",
    "Build a food delivery app with a menu screen showing restaurant items, a cart screen for order review, and a checkout screen with payment options.",
    "Make a social media app with a feed screen showing posts, a profile screen with user photos, and a messages screen for chat.",
    "Create a todo app with a main screen showing task list, an add task screen with input fields, and a settings screen for preferences.",
    "Build a weather app with a home screen showing current weather, a forecast screen with weekly predictions, and a locations screen to manage cities."
  ]);

  const generator = new TextToAppGenerator();

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please enter a description of your app');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const appStructure = generator.parseTextToApp(description);
      onAppGenerated(appStructure);
      
      // Clear the description after successful generation
      setDescription('');
    } catch (error) {
      console.error('Error generating app:', error);
      alert('Error generating app. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example) => {
    setDescription(example);
  };

  return (
    <div className="text-to-app-interface" style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        🤖 AI App Generator
      </h2>
      
      <p style={{
        color: '#666',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Describe your app idea in plain English and watch it come to life!
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          App Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your app idea... For example: 'Create a fitness app with a home screen showing daily steps, a workout screen with exercise videos, and a profile screen with user stats.'"
          style={{
            width: '100%',
            height: '120px',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007AFF'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>💡 Try these examples:</h4>
        <div style={{
          display: 'grid',
          gap: '8px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                textAlign: 'left',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#555'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0';
                e.target.style.borderColor = '#007AFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.borderColor = '#ddd';
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !description.trim()}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: isGenerating || !description.trim() ? '#ccc' : '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isGenerating || !description.trim() ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {isGenerating ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #fff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Generating App...
          </>
        ) : (
          <>
            ✨ Generate App
          </>
        )}
      </button>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#1976d2'
      }}>
        <strong>💡 Tips:</strong> Be specific about screens, features, and functionality. 
        Mention UI elements like buttons, forms, lists, and images for better results.
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TextToAppInterface;
