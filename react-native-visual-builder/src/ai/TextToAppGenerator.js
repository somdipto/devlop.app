// AI-powered text to app generator
export class TextToAppGenerator {
  constructor() {
    this.componentTypes = {
      'button': 'Button',
      'text': 'Text', 
      'input': 'TextInput',
      'image': 'Image',
      'list': 'FlatList',
      'scroll': 'ScrollView',
      'view': 'View'
    };
  }

  // Parse text description and generate app structure
  parseTextToApp(description) {
    const screens = this.extractScreens(description);
    const navigation = this.extractNavigation(description);
    
    return {
      screens: screens.map((screen, index) => ({
        id: `screen_${index + 1}`,
        name: screen.name,
        components: screen.components,
        backgroundColor: screen.backgroundColor || '#ffffff'
      })),
      initialScreenId: screens.length > 0 ? 'screen_1' : null,
      navigation
    };
  }

  // Extract screens from text description
  extractScreens(description) {
    const screens = [];
    const text = description.toLowerCase();
    
    // Look for screen indicators
    const screenPatterns = [
      /(?:screen|page|view)\s+(?:called|named|titled)\s+["']?([^"'\n.]+)["']?/gi,
      /(?:create|make|build)\s+(?:a|an)?\s*(?:screen|page|view)\s+(?:for|with|called|named)?\s*["']?([^"'\n.]+)["']?/gi,
      /(?:home|login|profile|settings|dashboard|main)\s*(?:screen|page|view)?/gi
    ];

    let screenMatches = [];
    screenPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        screenMatches.push(match[1] || match[0]);
      }
    });

    // If no explicit screens found, create default screens based on content
    if (screenMatches.length === 0) {
      screenMatches = this.inferScreensFromContent(text);
    }

    screenMatches.forEach((screenName, index) => {
      const components = this.extractComponentsForScreen(description, screenName, index);
      screens.push({
        name: this.capitalizeWords(screenName.trim()),
        components
      });
    });

    // Ensure at least one screen exists
    if (screens.length === 0) {
      screens.push({
        name: 'Home',
        components: this.extractComponentsFromGenericDescription(description)
      });
    }

    return screens;
  }

  // Infer screens from content when not explicitly mentioned
  inferScreensFromContent(text) {
    const screens = ['Home']; // Always have a home screen
    
    if (text.includes('login') || text.includes('sign in') || text.includes('authentication')) {
      screens.push('Login');
    }
    if (text.includes('profile') || text.includes('user') || text.includes('account')) {
      screens.push('Profile');
    }
    if (text.includes('settings') || text.includes('preferences') || text.includes('configuration')) {
      screens.push('Settings');
    }
    if (text.includes('list') || text.includes('items') || text.includes('products') || text.includes('feed')) {
      screens.push('List');
    }
    
    return screens;
  }

  // Extract components for a specific screen
  extractComponentsForScreen(description, screenName, screenIndex) {
    const components = [];
    let componentId = 1;

    // Add title/header
    components.push({
      id: `comp_${screenIndex}_${componentId++}`,
      type: 'Text',
      props: {
        children: screenName,
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          color: '#333333'
        }
      },
      position: { x: 50, y: 50 }
    });

    // Parse for specific components mentioned
    const componentPatterns = {
      button: /(?:button|btn)\s+(?:that says|with text|labeled|called)?\s*["']?([^"'\n.]+)["']?/gi,
      text: /(?:text|label|title|heading)\s+(?:that says|with|saying)?\s*["']?([^"'\n.]+)["']?/gi,
      input: /(?:input|textbox|field|form)\s+(?:for|to enter)?\s*["']?([^"'\n.]+)["']?/gi,
      image: /(?:image|picture|photo|icon)\s+(?:of|showing)?\s*["']?([^"'\n.]+)["']?/gi
    };

    Object.entries(componentPatterns).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        const component = this.createComponent(type, match[1], componentId++, screenIndex);
        if (component) {
          components.push(component);
        }
      }
    });

    // Add default components if none found
    if (components.length === 1) { // Only title
      components.push(...this.getDefaultComponentsForScreen(screenName, componentId, screenIndex));
    }

    return components;
  }

  // Create a component based on type and content
  createComponent(type, content, id, screenIndex) {
    const baseY = 120 + (id - 2) * 80; // Start after title
    
    switch (type) {
      case 'button':
        return {
          id: `comp_${screenIndex}_${id}`,
          type: 'Button',
          props: {
            title: content.trim(),
            onPress: () => console.log(`${content} pressed`),
            color: '#007AFF'
          },
          position: { x: 50, y: baseY }
        };
        
      case 'text':
        return {
          id: `comp_${screenIndex}_${id}`,
          type: 'Text',
          props: {
            children: content.trim(),
            style: {
              fontSize: 16,
              marginBottom: 10,
              color: '#333333'
            }
          },
          position: { x: 50, y: baseY }
        };
        
      case 'input':
        return {
          id: `comp_${screenIndex}_${id}`,
          type: 'TextInput',
          props: {
            placeholder: content.trim(),
            style: {
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginBottom: 10,
              borderRadius: 5
            }
          },
          position: { x: 50, y: baseY }
        };
        
      case 'image':
        return {
          id: `comp_${screenIndex}_${id}`,
          type: 'Image',
          props: {
            source: { uri: 'https://via.placeholder.com/150x150?text=' + encodeURIComponent(content.trim()) },
            style: {
              width: 150,
              height: 150,
              marginBottom: 10
            }
          },
          position: { x: 50, y: baseY }
        };
        
      default:
        return null;
    }
  }

  // Get default components for common screen types
  getDefaultComponentsForScreen(screenName, startId, screenIndex) {
    const components = [];
    const name = screenName.toLowerCase();
    
    if (name.includes('login')) {
      components.push(
        this.createComponent('input', 'Email', startId++, screenIndex),
        this.createComponent('input', 'Password', startId++, screenIndex),
        this.createComponent('button', 'Login', startId++, screenIndex)
      );
    } else if (name.includes('profile')) {
      components.push(
        this.createComponent('image', 'Profile Picture', startId++, screenIndex),
        this.createComponent('text', 'User Name', startId++, screenIndex),
        this.createComponent('text', 'Email Address', startId++, screenIndex),
        this.createComponent('button', 'Edit Profile', startId++, screenIndex)
      );
    } else if (name.includes('settings')) {
      components.push(
        this.createComponent('text', 'Notifications', startId++, screenIndex),
        this.createComponent('text', 'Privacy', startId++, screenIndex),
        this.createComponent('text', 'Account', startId++, screenIndex),
        this.createComponent('button', 'Save Settings', startId++, screenIndex)
      );
    } else {
      // Default home screen components
      components.push(
        this.createComponent('text', 'Welcome to the app!', startId++, screenIndex),
        this.createComponent('button', 'Get Started', startId++, screenIndex)
      );
    }
    
    return components.filter(Boolean);
  }

  // Extract components from generic description
  extractComponentsFromGenericDescription(description) {
    const components = [];
    let componentId = 1;

    // Add a welcome title
    components.push({
      id: `comp_0_${componentId++}`,
      type: 'Text',
      props: {
        children: 'Welcome',
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          color: '#333333'
        }
      },
      position: { x: 50, y: 50 }
    });

    // Add description text
    components.push({
      id: `comp_0_${componentId++}`,
      type: 'Text',
      props: {
        children: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
        style: {
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 20,
          color: '#666666'
        }
      },
      position: { x: 50, y: 120 }
    });

    // Add a default button
    components.push({
      id: `comp_0_${componentId++}`,
      type: 'Button',
      props: {
        title: 'Continue',
        color: '#007AFF'
      },
      position: { x: 50, y: 200 }
    });

    return components;
  }

  // Extract navigation patterns
  extractNavigation(description) {
    // Simple navigation extraction - can be enhanced
    return {
      type: 'stack',
      options: {
        headerShown: true
      }
    };
  }

  // Utility function to capitalize words
  capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }
}

export default TextToAppGenerator;
