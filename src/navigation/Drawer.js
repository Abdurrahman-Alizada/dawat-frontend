import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from './AppStack';
import DrawerContent from '../Components/DrawerContent';
const Drawer1 = createDrawerNavigator();
import MakeFriends from './MakeFriendsStack';
// import SupportUs from '../Screens/Drawer/Supportus/Index';
import SupportUs from './SupportUsStatck';

const DrawerStack = props => {
  return (
    <Drawer1.Navigator  drawerContent={() => <DrawerContent />}>
      <Drawer1.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <Drawer1.Screen
        name="MakeFriends"
        options={{headerShown: false}}
        component={MakeFriends}
      />
      <Drawer1.Screen
        name="SupportUs"
        options={{headerShown: false}}
        component={SupportUs}
      />
    </Drawer1.Navigator>
  );
};

export default DrawerStack;
