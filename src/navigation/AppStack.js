import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import GroupStack from './GroupStack'
import NotificationStack from './NotificationStack'

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
      name="NotificationStack"
      component={NotificationStack}
      options={{headerShown: false}}
    />

  </Stack.Navigator>
    );
};

export default AppStack;
