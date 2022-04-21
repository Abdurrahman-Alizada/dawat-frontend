import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './src/Screens/SplashScreen/SplashScreen';
import Onboarding from './src/Screens/Onboarding/OnboardingScreen';

import Auth from './src/navigation/AuthStack'; //Authentication routes
import Drawer from './src/navigation/Drawer'
import { store } from './src/redux/store'
import { Provider } from 'react-redux'

const Stack = createStackNavigator();

import { ThemeProvider, Button } from 'react-native-elements';

import Theme from './src/Theme';

import { LogBox } from "react-native";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export const App = () => {
  return (
  
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <NavigationContainer>
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
       </ThemeProvider>
   </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
