import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { StyleSheet, useWindowDimensions } from 'react-native';
import CustomDrawer from '../Components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './AppStack';

const Drawer = createDrawerNavigator();


const DrawerStack = () => {
  const window = useWindowDimensions();
 
  return (
    <Drawer.Navigator
    drawerContentOptions={{activeBackgroundColor: '#5cbbff'}}
    drawerType="back"
    overlayColor="transparent"
    drawerStyle={{
      width: window.width * 0.75,
      backgroundColor: '#FFFEFEFE',
    }}
    sceneContainerStyle={styles.drawerSceneContainer}
    edgeWidth={0}
 
      drawerContent={props => <CustomDrawer {...props} />}
      >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerSceneContainer: {
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
});


export default DrawerStack;

