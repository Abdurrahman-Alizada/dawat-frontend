import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GroupStack from './GroupStack';
import AppSettingsMain from './AppSettingsStack';

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
        name="AppSettingsMain"
        component={AppSettingsMain}
        options={{
          headerShown:false,
        }}
        />

    </Stack.Navigator>
  );
};

export default AppStack;
