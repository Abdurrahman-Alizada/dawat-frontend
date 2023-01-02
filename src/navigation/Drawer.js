import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from './AppStack';
import DrawerContent from '../Components/DrawerContent';
const Drawer1 = createDrawerNavigator();
import Social from '../Screens/Drawer/Social';

const DrawerStack = props => {
  return (
    <Drawer1.Navigator  drawerContent={() => <DrawerContent />}>
      <Drawer1.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <Drawer1.Screen
        name="Social"
        options={{headerShown: false}}
        component={Social}
      />
    </Drawer1.Navigator>
  );
};

export default DrawerStack;
