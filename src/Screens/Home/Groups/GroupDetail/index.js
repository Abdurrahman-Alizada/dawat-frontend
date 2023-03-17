import React, {useRef, useEffect} from 'react';
import {View} from 'react-native';
import Chat from './Chat';
import Tasks from './Tasks';
import Invitations from './Invitations';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GroupBrief from './GroupBrief';
import GroupHeader from '../../../../Components/GroupHeader';
import {Modalize} from 'react-native-modalize';
import {useTheme} from 'react-native-paper';
import { handleCurrentTab } from '../../../../redux/reducers/groups/groups';
import { handleIsInvitationSearch } from '../../../../redux/reducers/groups/invitations/invitationSlice';

import { useDispatch } from 'react-redux';
const Tab = createMaterialTopTabNavigator();

const Tabs = ({groupId, navigation}) => {

  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
      initialRouteName="Invitations"
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          textTransform: 'none',
        },
        tabBarStyle: {backgroundColor: theme.colors.elevation.level2},
      }}>
      <Tab.Screen
        name="Invitations"
        initialParams={{groupId: groupId}}
        component={Invitations}
        listeners={({ route }) => ({
          focus: (e) => {
           dispatch(handleCurrentTab(route.name))
          },
        })}
      />

      <Tab.Screen
        name="Tasks"
        initialParams={{groupId: groupId}}
        component={Tasks}
        listeners={({ route }) => ({
          focus: (e) => {
           dispatch(handleIsInvitationSearch(false))
           dispatch(handleCurrentTab(route.name))
          },
        })}

/>

      <Tab.Screen
        name="Chat"
        initialParams={{groupId: groupId}}
        component={Chat}
        listeners={({ route }) => ({
          focus: () => {
           dispatch(handleIsInvitationSearch(false))
            dispatch(handleCurrentTab(route.name))
          },          
        })}

/>
    </Tab.Navigator>
  );
};

const Index = ({route, navigation}) => {

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
      <Tabs groupId={groupId} navigation={navigation} />

      <Modalize
        modalStyle={{backgroundColor: theme.colors.background}}
        ref={modalizeRef}
        snapPoint={400}>
        <GroupBrief group={route.params.group} onClose={onClose} />
      </Modalize>
    </View>
  );
};

export default Index;
