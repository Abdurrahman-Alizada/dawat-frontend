import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Profile from '../Screens/Home/Menus/Profile';
import AppSettingsMain from '../Screens/Home/Menus/SettingsMain/Index';
import Preferences from '../Screens/Home/Menus/Preferences/Index';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="AppSettings">
      <Stack.Screen
        name="AppSettings"
        component={AppSettingsMain}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Preferences"
        component={Preferences}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
