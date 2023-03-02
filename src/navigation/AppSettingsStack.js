import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Profile from '../Screens/Home/Menus/Profile';
import AppSettingsMain from '../Screens/Home/Menus/SettingsMain/Index';
import Preferences from '../Screens/Home/Menus/Preferences/Index';
import GeneralAppbar from '../Components/GeneralAppbar'
const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="AppSettings">
      <Stack.Screen
        name="AppSettings"
        component={AppSettingsMain}
        options={{
          header: (props) => <GeneralAppbar title="Settings" {...props} />,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: (props) => <GeneralAppbar title="Profile" {...props} />,
        }}
      />

      <Stack.Screen
        name="Preferences"
        component={Preferences}
        options={{
          header: (props) => <GeneralAppbar title="Preferences" {...props} />,
        }}
        />
    </Stack.Navigator>
  );
};

export default AppStack;
