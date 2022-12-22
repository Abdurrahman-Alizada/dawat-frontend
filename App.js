import React,{useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './src/Screens/SplashScreen/SplashScreen';
import Onboarding from './src/Screens/Onboarding/OnboardingScreen';

import Auth from './src/navigation/AuthStack'; //Authentication routes
import Drawer from './src/navigation/Drawer';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';

const Stack = createStackNavigator();

import {LogBox } from 'react-native';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {PreferencesContext} from './src/themeContext';
import { lightPalette } from './src/GlobalStyles';
export const App = () => {
  // const theme = {
  //   ...PaperDefaultTheme,
  //   fonts: {
  //     ...PaperDefaultTheme.fonts,
  //     medium: 'Ubuntu Bold',
  //   },
  // };

  const [isThemeDark, setIsThemeDark] = React.useState(false);

  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: { ...PaperDarkTheme?.colors, ...NavigationDarkTheme.colors },
      fonts: {
      ...PaperDefaultTheme.fonts,
      medium: 'Ubuntu Bold',
    },
  };

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: { 
      ...PaperDefaultTheme?.colors, 
      ...NavigationDefaultTheme.colors,  
      // ...lightPalette
    },
    fonts: {
      ...PaperDefaultTheme.fonts,
      medium: 'Ubuntu Bold',
    },
  };

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName="SplashScreen">
              {/* SplashScreen which will come once for 5 Seconds */}
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                // Hiding header for Splash Screen
                options={{headerShown: false}}
              />
              {/* Auth Navigator which includer Login Signup will come once */}
              <Stack.Screen
                name="Auth"
                component={Auth}
                options={{headerShown: false}}
              />
              {/* onboarding screen for first time open */}
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Drawer"
                component={Drawer}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </PreferencesContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
