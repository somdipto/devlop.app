import JSZip from 'jszip';

// --- Copied and adapted from LivePreview.jsx ---

const convertStyleToReactNative = (webStyle) => {
  if (!webStyle) return {};
  const rnStyle = {};
  for (const key in webStyle) {
    let value = webStyle[key];
    if (typeof value === 'string' && value.endsWith('px')) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        if (['width', 'height', 'fontSize', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'left', 'top', 'right', 'bottom', 'borderRadius'].includes(key)) {
          value = numValue;
        }
      }
    }
    rnStyle[key] = value;
  }
  return rnStyle;
};

const generateScreenComponentString = (screen) => {
  const { nodes } = screen;
  const imports = new Set(['View', 'Text', 'StyleSheet']);

  const componentJSX = nodes.map(node => {
    const { componentType, props = {} } = node.data;
    const { label, style, navigateTo, text: textProp, placeholder: placeholderProp, src: srcProp, ...otherProps } = props; // Destructure specific common props
    let jsxString = '';
    // Use node.id for unique style keys to avoid collisions if multiple nodes of same type exist
    const styleName = `styles.${screen.id.replace(/\W/g, '_')}_${node.id.replace(/\W/g, '_')}_style`;
    const styleString = (style && Object.keys(convertStyleToReactNative(style)).length > 0) ? `style={${styleName}}` : '';

    switch (componentType) {
      case 'Button':
        imports.add('Button');
        const onPressAction = navigateTo
          ? `() => navigation.navigate('${navigateTo.replace(/\s+/g, '')}Screen')` // Sanitize screen name
          : `() => alert('${label || 'Button'} pressed!')`;
        jsxString = `<Button title={"${label || 'Button'}"} onPress={${onPressAction}} ${styleString} />`;
        break;
      case 'Text':
        jsxString = `<Text ${styleString}>${textProp || label || 'Text Label'}</Text>`;
        break;
      case 'Image':
        imports.add('Image');
        const imgSrc = srcProp || 'https://via.placeholder.com/100.png?text=Image';
        // Default style for image if no style is provided, to ensure it's visible
        const imgDefaultStyle = (style && Object.keys(convertStyleToReactNative(style)).length > 0) ? '' : 'style={{ width: 100, height: 100, resizeMode: \'contain\' }}';
        jsxString = `<Image source={{ uri: '${imgSrc}' }} ${styleString || imgDefaultStyle} />`;
        break;
      case 'Input':
        imports.add('TextInput');
        jsxString = `<TextInput placeholder={"${placeholderProp || 'Input Field'}"} ${styleString} />`;
        break;
      case 'View':
        // For exported code, a View might just be a container.
        // Children rendering is complex and not part of MVP for drag-drop visual construction for export.
        // It could contain a placeholder text or be empty.
        jsxString = `<View ${styleString}><Text>${label || screen.id + '_' + node.id}</Text></View>`;
        break;
      default:
        jsxString = `<Text>Unknown component: ${componentType}</Text>`;
    }
    return `  <View key={'${screen.id}-${node.id}'} style={styles.componentWrapper}>${jsxString}</View>`;
  }).join('\n');

  const styleObjects = nodes
    .filter(n => n.data.props && n.data.props.style && Object.keys(convertStyleToReactNative(n.data.props.style)).length > 0)
    .map(n => `  ${screen.id.replace(/\W/g, '_')}_${n.id.replace(/\W/g, '_')}_style: ${JSON.stringify(convertStyleToReactNative(n.data.props.style))},`).join('\n');

  return {
    imports: [...imports],
    componentCode: `
function ${screen.name.replace(/\s+/g, '')}Screen({ navigation }) {
  return (
    <View style={styles.screenContainer}>
${componentJSX}
    </View>
  );
}
`,
    styleObjects
  };
};

// This is the main function to generate App.js content
const generateAppJsContent = (screens, initialScreenId) => {
  if (!screens || screens.length === 0) {
    return \`import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
export default function App() { return <View style={styles.container}><Text>No screens defined.</Text></View>; }
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }});\`;
  }

  const initialScreen = screens.find(s => s.id === initialScreenId);
  const initialScreenName = initialScreen ? initialScreen.name.replace(/\s+/g, '') : screens[0].name.replace(/\s+/g, '');


  let allImports = new Set(['React']);
  let screenFunctionsCode = ''; // Renamed from screenComponentsCode for clarity
  let allStyleObjectsString = ''; // Renamed for clarity

  screens.forEach(screen => {
    const screenGen = generateScreenComponentString(screen); // Use the string version
    screenGen.imports.forEach(imp => allImports.add(imp));
    screenFunctionsCode += screenGen.componentCode;
    allStyleObjectsString += screenGen.styleObjects + '\\n'; // Add newline after each screen's styles
  });

  allImports.add('NavigationContainer');
  allImports.add('createStackNavigator'); // Corrected from createStackNavigator

  // Separate React Native imports from other library imports
  const reactNativeImportItems = ['View', 'Text', 'StyleSheet', 'Button', 'Image', 'TextInput'].filter(i => allImports.has(i)); // Add any other RN specific ones
  const rnImportString = reactNativeImportItems.length > 0 ? \`import { \${[...allImports].filter(i => reactNativeImportItems.includes(i)).join(', ')} } from 'react-native';\` : '';

  // Specific library imports (React Navigation in this case)
  const navImportString = \`import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';\`; // Corrected here too

  const reactImportString = \`import React from 'react';\`; // Ensure React is imported first

  return \`\${reactImportString}
\${rnImportString}
\${navImportString}

const Stack = createStackNavigator();

\${screenFunctionsCode}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"\${initialScreenName}Screen"}>
        {\`\${screens.map(screen => \`
          <Stack.Screen
            name={"\${screen.name.replace(/\s+/g, '')}Screen"}
            component={\${screen.name.replace(/\s+/g, '')}Screen}
            options={{ title: '\${screen.name}' }}
          />\`).join('\\n        ')}\`}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  componentWrapper: {
    marginBottom: 10,
  },
\${allStyleObjectsString}
});
\`;
};

// --- End copied and adapted logic ---

const generatePackageJsonContent = (appName = 'MyReactNativeApp') => {
  return JSON.stringify({
    name: appName.toLowerCase().replace(/\s+/g, '-'), // Sanitize app name for package.json
    version: '0.0.1',
    private: true,
    scripts: {
      android: 'react-native run-android',
      ios: 'react-native run-ios',
      start: 'react-native start',
    },
    dependencies: {
      'react': '18.2.0',
      'react-native': '0.72.0',
      '@react-navigation/native': '^6.1.7', // More specific versions
      '@react-navigation/stack': '^6.3.17',
      'react-native-safe-area-context': '^4.7.1',
      'react-native-screens': '^3.23.0',
      // 'expo-constants': '^14.0.0' // If needed for Expo projects
    },
    devDependencies: {
      '@babel/core': '^7.20.0',
      '@babel/preset-env': '^7.20.0',
      '@babel/runtime': '^7.20.0',
      'babel-jest': '^29.2.1',
      'metro-react-native-babel-preset': '^0.73.7' // Common preset
    }
  }, null, 2);
};

// Generates a basic index.js file
const generateIndexJsContent = (appName = 'MyReactNativeApp') => {
  const sanitizedAppName = appName.toLowerCase().replace(/\s+/g, '-');
  return \`import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);\`;
};

// Generates a basic app.json file
const generateAppJsonContent = (appName = 'MyReactNativeApp') => {
  const sanitizedAppName = appName.toLowerCase().replace(/\s+/g, '-');
  return JSON.stringify({
    name: sanitizedAppName,
    displayName: appName
  }, null, 2);
};


export const exportProjectAsZip = (screens, initialScreenId, appName = 'MyDesignedApp') => {
  if (!screens || screens.length === 0) {
    alert('No screens to export!');
    return;
  }

  const zip = new JSZip();
  const appJsContent = generateAppJsContent(screens, initialScreenId); // Now uses the full logic
  const packageJsonContent = generatePackageJsonContent(appName);
  const indexJsContent = generateIndexJsContent(appName);
  const appJsonContent = generateAppJsonContent(appName);

  zip.file('App.js', appJsContent);
  zip.file('package.json', packageJsonContent);
  zip.file('index.js', indexJsContent);
  zip.file('app.json', appJsonContent);

  // Could add babel.config.js, .gitignore etc. for a more complete project structure

  zip.generateAsync({ type: 'blob' })
    .then(function(content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = \`\${appName.replace(/\s+/g, '-')}.zip\`; // Sanitize zip filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch(err => {
      console.error('Failed to generate zip file:', err);
      alert('Error exporting project. See console for details.');
    });
};
