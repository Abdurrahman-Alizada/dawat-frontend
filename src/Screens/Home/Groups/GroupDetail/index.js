import React, { useRef} from 'react';
import {View} from 'react-native';
import Chat from './Chat';
import Tasks from './Tasks';
import Invitations from './Invitations';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GroupBrief from './GroupBrief';
import GroupHeader from '../../../../Components/GroupHeader';
import {Modalize} from 'react-native-modalize';
import { useTheme } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({groupId}) => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Invitations"
      style={{}}
      screenOptions={{
        // tabBarActiveTintColor: '#ffffff',
        tabBarLabelStyle: {fontSize: 15, fontWeight: 'bold', textTransform:"none"},
        // tabBarStyle:{backgroundColor: "#f7eaf7" }
        tabBarStyle:{backgroundColor: theme.colors.elevation.level2}
        // tabBarIndicatorStyle: {backgroundColor: '#fff'},
      }}>
      <Tab.Screen
        name="Invitations"
        initialParams={{groupId: groupId}}
        component={Invitations}
      />

      <Tab.Screen
        name="Tasks"
        initialParams={{groupId: groupId}}
        component={Tasks}
      />

      <Tab.Screen
        name="Chat"
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

  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      <GroupHeader group={route.params} onOpen={onOpen} />
      <Tabs groupId={groupId} />

      <Modalize
        ref={modalizeRef}
        snapPoint={400}>
        <GroupBrief />
      </Modalize>
    </View>
  );
};

export default Index;
