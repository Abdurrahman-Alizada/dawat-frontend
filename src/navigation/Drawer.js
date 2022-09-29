import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from './AppStack';
import Profile from '../Screens/Drawer/Profile';
import DrawerContent from '../Components/DrawerContent';
const Drawer1 = createDrawerNavigator();

const DrawerStack = props => {
  return (
    <Drawer1.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer1.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <Drawer1.Screen
        name="Profile"
        options={{headerShown: false}}
        // options={{}}
        component={Profile}
      />
    </Drawer1.Navigator>
  );
};

export default DrawerStack;
