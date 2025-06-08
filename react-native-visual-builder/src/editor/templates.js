const templates = {
  loginScreen: {
    name: 'Login Screen',
    nodes: [
      {
        id: 'login-title',
        type: 'uiComponentNode',
        position: { x: 150, y: 50 },
        data: { componentType: 'Text', label: 'App Title', props: { text: 'Welcome Back!', style: { fontSize: '24px', fontWeight: 'bold' } } },
      },
      {
        id: 'login-username',
        type: 'uiComponentNode',
        position: { x: 100, y: 120 },
        data: { componentType: 'Input', label: 'Username Input', props: { placeholder: 'Username', style: { width: '200px' } } },
      },
      {
        id: 'login-password',
        type: 'uiComponentNode',
        position: { x: 100, y: 180 },
        data: { componentType: 'Input', label: 'Password Input', props: { placeholder: 'Password', type: 'password', style: { width: '200px' } } },
      },
      { // MODIFIED: This button will navigate
        id: 'login-button',
        type: 'uiComponentNode',
        position: { x: 120, y: 240 }, // Adjusted position
        data: {
          componentType: 'Button',
          label: 'Login Button',
          props: {
            label: 'Login & Go Home',
            style: { width: '160px' },
            navigateTo: 'Home Screen' // Assuming 'Home Screen' will be the name of another screen
          }
        },
      },
    ],
    edges: [],
  },
  homeScreen: { // This screen will be the target for navigation
    name: 'Home Screen', // Ensure this name matches navigateTo
    nodes: [
      {
        id: 'home-header',
        type: 'uiComponentNode',
        position: { x: 50, y: 30 },
        data: { componentType: 'Text', label: 'Header', props: { text: 'My Awesome App - Home!', style: { fontSize: '28px', fontWeight: 'bold', color: '#333' } } },
      },
      {
        id: 'home-hero-image',
        type: 'uiComponentNode',
        position: { x: 100, y: 100 },
        data: { componentType: 'Image', label: 'Hero Image', props: { src: 'https://via.placeholder.com/300x150.png?text=Welcome+Home', style: { width: '300px', height: '150px' } } },
      },
      {
        id: 'home-welcome-text',
        type: 'uiComponentNode',
        position: { x: 50, y: 280 },
        data: { componentType: 'Text', label: 'Welcome Message', props: { text: 'You have successfully navigated here!' } },
      },
      // Added a button to potentially navigate back or elsewhere
      {
        id: 'home-back-button',
        type: 'uiComponentNode',
        position: { x: 150, y: 330 },
        data: {
          componentType: 'Button',
          label: 'Back to Login',
          props: {
            label: 'Go to Login',
            navigateTo: 'Login Screen' // Example of navigating back
          }
        },
      },
    ],
    edges: [],
  },
};

export default templates;
