import React, {useCallback, useMemo, useLayoutEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './src/Screens/SplashScreen/SplashScreen';
import Onboarding from './src/Screens/Onboarding/OnboardingScreen';

import Auth from './src/navigation/AuthStack'; //Authentication routes
import Drawer from './src/navigation/Drawer';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';

const Stack = createStackNavigator();

import {LogBox} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs(['Possible Unhandled']);
LogBox.ignoreLogs(['This synthetic event is reused for performance reasons.']);

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  // DarkTheme as PaperDarkTheme,
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Snackbar,
} from 'react-native-paper';
import {ThemeContext} from './src/themeContext';
import {lightPalette, darkPalette} from './src/GlobalStyles';
export const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme?.colors,
      ...NavigationDarkTheme.colors,
      ...darkPalette,
    },
  };

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme?.colors,
      ...NavigationDefaultTheme.colors,
      ...lightPalette,
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

  const [isNetSnackBarVisible, setIsNetSnackBarVisible] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      setIsNetSnackBarVisible(true);
    }, 3000);
  }, []);

  // internet connection information
  const netInfo = useNetInfo();

  return (
    <ThemeContext.Provider value={preferences}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName="SplashScreen">
              {/* SplashScreen which will come once for 5 Seconds */}
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{headerShown: false}}
              />
              {/* Auth Navigator which includes Login Signup, will come once */}
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

            {/* snackbar for checking internet connection */}
            <Snackbar
              visible={!netInfo.isConnected && isNetSnackBarVisible}
              duration={1000}
              onDismiss={() => console.log('snackbar dismissed')}>
              You are currently offline.
            </Snackbar>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </ThemeContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
