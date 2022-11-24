import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import NotificationMain from '../Screens/Home/Notifications';

const Stack = createStackNavigator();

const AppStack = () => {
  return (

    <Stack.Navigator initialRouteName="NotificationMain">
    <Stack.Screen
      name="NotificationMain"
      component={NotificationMain}
      options={{headerShown: false}}
    />

  </Stack.Navigator>
    );
};

export default AppStack;
