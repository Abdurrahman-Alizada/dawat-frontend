import React, {useState, useRef, useEffect} from 'react';
import {View, Text} from 'react-native';
import Chat from './Chat';
import Tasks from './Tasks';
import Invitations from './Invitations';
import {Badge} from 'react-native-elements';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GroupBrief from './GroupBrief';
import GroupHeader from '../../../../Components/GroupHeader';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../GlobalStyles';
const modalHeight = height * 0.9;

const Tab = createMaterialTopTabNavigator();

const Tabs = ({groupId}) => {
  return (
    <Tab.Navigator
      initialRouteName="invitations"
      style={{}}
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarLabelStyle: {fontSize: 16, fontWeight: 'bold'},
        // tabBarItemStyle: { width: 100 },
        tabBarStyle: {backgroundColor: '#6c6399'},
        tabBarIndicatorStyle: {backgroundColor: '#fff'},
      }}>
      <Tab.Screen
        name="invitations"
        options={{
          tabBarLabel: ({focused}) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  marginRight: '5%',
                  fontWeight: 'bold',
                  color: focused ? '#fff' : 'powderblue',
                }}>
                Invitations
              </Text>
              <Badge
                value="3"
                status="success"
                badgeStyle={{
                  backgroundColor: focused ? '#fff' : 'powderblue',
                  color: '#333',
                }}
                textStyle={{color: '#333', fontWeight: 'bold'}}
              />
            </View>
          ),
        }}
        initialParams={{groupId: groupId}}
        component={Invitations}
      />

      <Tab.Screen
        name="tasks"
        options={{
          tabBarLabel: ({focused}) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  marginRight: '5%',
                  fontWeight: 'bold',
                  color: focused ? '#fff' : 'powderblue',
                }}>
                Tasks
              </Text>
              <Badge
                value="3"
                status="success"
                badgeStyle={{
                  backgroundColor: focused ? '#fff' : 'powderblue',
                  color: '#333',
                }}
                textStyle={{color: '#333', fontWeight: 'bold'}}
              />
            </View>
          ),
        }}
        initialParams={{groupId: groupId}}
        component={Tasks}
      />

      <Tab.Screen
        name="chat"
        options={{
          tabBarLabel: ({focused}) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  marginRight: '5%',
                  fontWeight: 'bold',
                  color: focused ? '#fff' : 'powderblue',
                }}>
                Chats
              </Text>
              <Badge
                value="3"
                status="success"
                badgeStyle={{
                  backgroundColor: focused ? '#fff' : 'powderblue',
                  color: '#333',
                }}
                textStyle={{color: '#333', fontWeight: 'bold'}}
              />
            </View>
          ),
        }}
        initialParams={{groupId: groupId}}
        component={Chat}
      />
    </Tab.Navigator>
  );
};

const Index = ({route}) => {
  const {groupId} = route.params;

  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return (
    <View style={{flex: 1}}>
      <GroupHeader group={route.params} onOpen={onOpen} />
      <Tabs groupId={groupId} />

      <Modalize
        ref={modalizeRef}
        // modalHeight={modalHeight}
        adjustToContentHeight={true}
        snapPoint={500}>
        <GroupBrief />
      </Modalize>
    </View>
  );
};

export default Index;
