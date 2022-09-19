import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from './AppStack';
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
        name="Notifications"
        options={{headerShown: false}}
        component={HomeScreen}
      />
    </Drawer1.Navigator>
  );
};

export default DrawerStack;
