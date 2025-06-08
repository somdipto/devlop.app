import React, { useEffect, useState, useMemo } from 'react';
import { Snack } from 'snack-sdk';

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

// Function to generate a single screen component's code
const generateScreenComponent = (screen, allScreens) => { // allScreens needed for navigateTo validation if desired
  const { nodes } = screen;
  const imports = new Set(['View', 'Text', 'StyleSheet']); // Base imports for a screen

  const componentJSX = nodes.map(node => {
    const { componentType, props = {} } = node.data;
    const { label, style, navigateTo, ...otherProps } = props;
    let jsxString = '';
    const rnStyle = convertStyleToReactNative(style);
    // Use StyleSheet for styles by referencing a generated key
    const styleKey = `${screen.name.replace(/\s+/g, '')}_${node.id}_style`;
    const styleString = Object.keys(rnStyle).length > 0 ? `style={styles.${styleKey}}` : '';

    switch (componentType) {
      case 'Button':
        imports.add('Button');
        const onPressAction = navigateTo
          ? `() => navigation.navigate('${navigateTo.replace(/\s+/g, '')}Screen')` // Ensure target screen name is also sanitized
          : `() => alert('${props.label || 'Button'} pressed!')`;
        jsxString = `<Button title={"${props.label || 'Button'}"} onPress={${onPressAction}} ${styleString} />`;
        break;
      case 'Text':
        jsxString = `<Text ${styleString}>${props.text || label || 'Text Label'}</Text>`;
        break;
      case 'Image':
        imports.add('Image');
        const imgSrc = props.src || 'https://via.placeholder.com/100.png?text=Image';
        // Default style for image if no specific style is provided for dimensions
        const imageDefaultStyle = (Object.keys(rnStyle).length === 0) ? 'style={{ width: 100, height: 100 }}' : styleString;
        jsxString = `<Image source={{ uri: '${imgSrc}' }} ${imageDefaultStyle} />`;
        break;
      case 'Input':
        imports.add('TextInput');
        jsxString = `<TextInput placeholder={"${props.placeholder || 'Input Field'}"} ${styleString} />`;
        break;
      case 'View':
        // Basic View, children rendering not implemented in this pass
        jsxString = `<View ${styleString}><Text>${label || 'View Container'}</Text></View>`;
        break;
      default:
        jsxString = `<Text>Unknown: ${componentType}</Text>`;
    }
    return `  <View key={'${screen.id}-${node.id}'} style={styles.componentWrapper}>${jsxString}</View>`;
  }).join('\n');

  // Create StyleSheet entries for each styled node
  const styleObjects = nodes.filter(n => n.data.props && n.data.props.style && Object.keys(convertStyleToReactNative(n.data.props.style)).length > 0)
    .map(n => `  ${screen.name.replace(/\s+/g, '')}_${n.id}_style: ${JSON.stringify(convertStyleToReactNative(n.data.props.style))},`).join('\n');

  // Screen component gets navigation prop
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
    styleObjects // Return for aggregation
  };
};

// Main code generation function
const generateReactNativeCode = (screens, initialScreenId) => {
  if (!screens || screens.length === 0) {
    return `import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
export default function App() { return <View style={styles.container}><Text>No screens defined.</Text></View>; }
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }});`;
  }

  const initialScreen = screens.find(s => s.id === initialScreenId);
  const initialScreenName = initialScreen ? initialScreen.name.replace(/\s+/g, '') : screens[0].name.replace(/\s+/g, '');


  let allImports = new Set(['React']);
  let screenComponentsCode = '';
  let allStyleObjects = '';

  screens.forEach(screen => {
    const screenGen = generateScreenComponent(screen, screens);
    screenGen.imports.forEach(imp => allImports.add(imp));
    screenComponentsCode += screenGen.componentCode;
    allStyleObjects += screenGen.styleObjects + '\n'; // Add newline after each screen's styles
  });

  // Add navigation imports
  allImports.add('NavigationContainer');
  allImports.add('createStackNavigator'); // Corrected from createStackNavigator

  const reactNativeImportItems = ['View', 'Text', 'StyleSheet', 'Button', 'Image', 'TextInput'].filter(i => allImports.has(i));
  const rnImportString = reactNativeImportItems.length > 0 ? `import { ${reactNativeImportItems.join(', ')} } from 'react-native';` : '';

  const navImportString = `import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';`; // Corrected here too

  return `
import React from 'react';
${rnImportString}
${navImportString}

const Stack = createStackNavigator();

${screenComponentsCode}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"${initialScreenName}Screen"}>
        ${screens.map(screen => `
          <Stack.Screen
            name={"${screen.name.replace(/\s+/g, '')}Screen"}
            component={${screen.name.replace(/\s+/g, '')}Screen}
            options={{ title: '${screen.name}' }}
          />`).join('\n        ')}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: { // Style for individual screen containers
    flex: 1,
    paddingTop: 20, // Adjust as needed
    paddingHorizontal: 10,
    backgroundColor: '#ffffff', // Default white background for screens
  },
  componentWrapper: {
    marginBottom: 10,
  },
${allStyleObjects}
});
`;
};

const LivePreview = ({ screens, activeScreenId }) => { // activeScreenId is the initial screen for the navigator
  const [snack, setSnack] = useState(null);
  const previewRef = React.useRef(null);

  const code = useMemo(() => generateReactNativeCode(screens, activeScreenId), [screens, activeScreenId]);

  useEffect(() => {
    // Clear previous Snack instance before creating a new one
    if (previewRef.current) {
      previewRef.current.innerHTML = '';
    }
    setSnack(null); // Ensure old snack is nulled out

    const newSnack = new Snack({
      code: code,
      dependencies: {
        '@react-navigation/native': '6.x',
        '@react-navigation/stack': '6.x',
        'react-native-screens': '3.x',
        'react-native-safe-area-context': '4.x',
      },
      name: 'Live App Preview',
      description: 'Preview of the designed app',
      sdkVersion: '49.0.0',
      element: previewRef.current,
      preview: true,
    });
    setSnack(newSnack);

    return () => {
      if (previewRef.current) previewRef.current.innerHTML = '';
      // Potentially call a destroy method on newSnack if available and needed
      setSnack(null);
    };
  // Re-create Snack instance if screens or activeScreenId (for initialRoute) changes fundamentally
  // This is aggressive; a more nuanced approach might update via snack.updateCode() if structure is similar
  }, [screens, activeScreenId]); // Re-run when screens array or initial screen for preview changes

  // This effect is for updating the code if the Snack instance already exists
  // However, the above useEffect now re-creates the Snack instance on screens/activeScreenId change.
  // Keeping this might be redundant or could be for minor code updates if we don't always re-create.
  // For simplicity of current logic (re-create on fundamental changes), this might not be strictly needed.
  // Let's keep it to ensure updates if 'code' changes for other reasons than screens/activeScreenId.
  useEffect(() => {
    if (snack && snack.updateCode) { // Check if updateCode method exists
      snack.updateCode(code);
    }
  }, [code, snack]);

  return (
    <div style={{ flex: 1, height: '100%' }}>
      <div ref={previewRef} style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}>
        Loading Preview...
      </div>
    </div>
  );
};

export default LivePreview;
