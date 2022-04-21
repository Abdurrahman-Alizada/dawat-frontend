import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeIndex from '../Screens/Home/Groups/Index';
// import AddGroup from '../Screens/Home/Groups/AddGroup1';
import AddGroup from '../Screens/Home/Groups/AddGroup';
import GroupDetail from '../Screens/Home/Groups/GroupDetail'
const Stack = createStackNavigator();

const AppStack = () => {
  return (

    <Stack.Navigator initialRouteName="HomeIndex">
    <Stack.Screen
      name="HomeIndex"
      component={HomeIndex}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="AddGroup"
      component={AddGroup}
      options={{
          title: 'Add Your Group'
        //   headerShown: false
        }}
    />
      <Stack.Screen
      name="GroupDetail"
      component={GroupDetail}
      options={{
          title: 'Group detail',
          headerShown: false
        }}
    />

  </Stack.Navigator>
    );
};

export default AppStack;
