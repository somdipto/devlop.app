import React from 'react';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Generation',
      description: 'Describe your app in plain English and watch our AI create a working prototype instantly.'
    },
    {
      icon: '📱',
      title: 'Expo-Ready Apps',
      description: 'Generate real React Native apps that work with Expo. Test immediately on your phone.'
    },
    {
      icon: '🎨',
      title: 'Visual Editor',
      description: 'Drag and drop components, customize layouts, and see changes in real-time.'
    },
    {
      icon: '⚡',
      title: 'Instant Preview',
      description: 'See your app running live as you build it. No compilation delays.'
    },
    {
      icon: '📦',
      title: 'Export Ready Code',
      description: 'Download complete React Native projects with all dependencies included.'
    },
    {
      icon: '🔧',
      title: 'No Code Required',
      description: 'Build professional apps without writing a single line of code.'
    }
  ];

  const examples = [
    {
      title: 'Fitness Tracker',
      description: 'Track workouts, monitor progress, and set fitness goals',
      prompt: 'Create a fitness app with workout tracking and progress monitoring'
    },
    {
      title: 'Food Delivery',
      description: 'Browse restaurants, order food, and track deliveries',
      prompt: 'Build a food delivery app with restaurant menus and order tracking'
    },
    {
      title: 'Social Media',
      description: 'Share posts, connect with friends, and chat',
      prompt: 'Make a social media app with posts, profiles, and messaging'
    },
    {
      title: 'Todo Manager',
      description: 'Organize tasks, set reminders, and boost productivity',
      prompt: 'Create a todo app with task management and reminders'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-2xl font-bold text-gray-900">AppCraft AI</h1>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Apps with
            <span className="text-indigo-600"> AI Magic</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your app ideas into working Expo prototypes using just plain English. 
            No coding skills required - just describe what you want and watch it come to life!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              🤖 Start Building with AI
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
              📺 Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to build amazing apps
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features that make app development accessible to everyone
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See what you can build
            </h2>
            <p className="text-lg text-gray-600">
              Get inspired by these example apps you can create in minutes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{example.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{example.description}</p>
                <div className="bg-gray-100 rounded p-3 text-xs text-gray-700 italic">
                  "{example.prompt}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600">
              From idea to working app in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Describe Your Idea</h3>
              <p className="text-gray-600">
                Tell our AI what kind of app you want to build using natural language
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Generates App</h3>
              <p className="text-gray-600">
                Watch as our AI creates screens, components, and navigation automatically
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Test & Export</h3>
              <p className="text-gray-600">
                Preview your app instantly and export the complete React Native code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build your dream app?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of creators who are building apps without code
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Building Now - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🚀</span>
            <h3 className="text-xl font-bold">AppCraft AI</h3>
          </div>
          <p className="text-gray-400">
            Empowering everyone to build amazing mobile apps with AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
