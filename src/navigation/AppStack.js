import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import GroupStack from './GroupStack'
import Profile from '../Screens/Home/Menus/Profile.js/index';

const Stack = createStackNavigator();

const AppStack = () => {
  return (

    <Stack.Navigator initialRouteName="GroupStack">
    
    <Stack.Screen
      name="GroupStack"
      component={GroupStack}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{headerShown: false}}
    />

  </Stack.Navigator>
    );
};

export default AppStack;
