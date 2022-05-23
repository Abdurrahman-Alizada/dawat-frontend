import React, { useState, useRef, useEffect } from 'react';
import { View, Text,  } from 'react-native'
import Chat from './Chat'
import Tasks from './Tasks'
import Header from './Header';
import Invitaions from './Invitaions'
import { Badge } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GroupBrief from './GroupBrief'

import { Modalize } from 'react-native-modalize';
import { height } from '../../../../GlobalStyles'
const modalHeight = height * 0.9
// import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

const Tab = createMaterialTopTabNavigator();

const Tabs = () => {
  useEffect(()=>{
    // AndroidKeyboardAdjust.setAdjustResize()
});

  return (
    <Tab.Navigator
      initialRouteName="invitations"
      style={{}}
      screenOptions={{
        tabBarActiveTintColor :"#ffffff",
        tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
        // tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: "#6c6399" },
        tabBarIndicatorStyle:{backgroundColor:'#fff'}
      }}
    >
      <Tab.Screen
        name="invitations"
        options={{
          tabBarLabel: ({focused}) => (
            <View style={{justifyContent:'center', alignItems:'center', flexDirection:"row",}}>
              <Text style={{fontSize:16, marginRight:'5%', fontWeight:'bold', color: focused ? "#fff" : 'powderblue'}}>Invitations</Text>
              <Badge value="3" status="success" 
               badgeStyle={{backgroundColor:focused ? "#fff" : 'powderblue', color:'#333'}} 
               textStyle={{color:'#333', fontWeight:'bold'}}
               />
            </View>
          ),
        }}        
        component={Invitaions}
      />

      <Tab.Screen
        name="tasks"
        options={{
          tabBarLabel: ({focused}) => (
            <View style={{justifyContent:'center', alignItems:'center', flexDirection:"row",}}>
              <Text style={{fontSize:16, marginRight:'5%', fontWeight:'bold', color: focused ? "#fff" : 'powderblue'}}>Tasks</Text>
              <Badge value="3" status="success" 
               badgeStyle={{backgroundColor:focused ? "#fff" : 'powderblue', color:'#333'}} 
               textStyle={{color:'#333', fontWeight:'bold'}}
               />
            </View>
          ),
        }}        
        component={Tasks}
      />

     <Tab.Screen
        name="chat"
        options={{
          tabBarLabel: ({focused}) => (
            <View style={{justifyContent:'center', alignItems:'center', flexDirection:"row",}}>
              <Text style={{fontSize:16, marginRight:'5%', fontWeight:'bold', color: focused ? "#fff" : 'powderblue'}}>Chats</Text>
              <Badge value="3" status="success" 
               badgeStyle={{backgroundColor:focused ? "#fff" : 'powderblue', color:'#333'}} 
               textStyle={{color:'#333', fontWeight:'bold'}}
               />
            </View>
          ),
        }}        
        component={Chat}
      />

    </Tab.Navigator>
  );
};

const Index = ({navigation}) => {

  useEffect(() => {
   modalizeRef.current?.open();
  }, []);


  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return(
    <View style={{flex:1}}>
     <Header navigation={navigation} title='title' onOpen={onOpen} />
     <Tabs />  

     <Modalize 
      ref={modalizeRef} 
      // modalHeight={modalHeight} 
      snapPoint={500}
      >
      <GroupBrief />
      </Modalize>

    </View>
    )
  }

export default Index;