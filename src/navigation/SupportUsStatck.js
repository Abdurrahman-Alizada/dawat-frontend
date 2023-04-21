import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import WatchAds from '../Screens/Drawer/Supportus/Index';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="WatchAds">
      <Stack.Screen
        name="WatchAds"
        component={WatchAds}
        options={{
          headerShown: false,
          presentation: 'modal',
          title:"Support us"
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
