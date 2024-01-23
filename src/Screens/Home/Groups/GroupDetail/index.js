import React, {useRef, useEffect} from 'react';
import {View} from 'react-native';
import Chat from './Chat';
import Tasks from './Tasks';
import Invitations from './Invitations';
import GroupLogs from './GroupLogs/Index';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GroupBrief from './GroupBrief';
import GroupHeader from '../../../../Components/GroupHeader';
import {Modalize} from 'react-native-modalize';
import {List, useTheme, Text, IconButton} from 'react-native-paper';
import {handleCurrentTab} from '../../../../redux/reducers/groups/groups';
import {handleIsInvitationSearch} from '../../../../redux/reducers/groups/invitations/invitationSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {selectedMessageIdsClearHandler} from '../../../../redux/reducers/groups/chat/chatSlice';
import InvitaionsSummary from './Invitations/invitaionsSummary';
import TasksSummary from './Tasks/TasksSummary';
import ImportExport from './Invitations/importExport'

const Tab = createMaterialTopTabNavigator();

const Tabs = ({groupId, navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
      initialRouteName="Guests"
      screenOptions={{
        tabBarLabelStyle: {
          // fontSize: 17,
          fontWeight: 'bold',
          textTransform: 'none',
          // justifyContent: 'space-evenly',
        },
        // tabBarScrollEnabled: true,
        tabBarStyle: {
          // backgroundColor: theme.colors.elevation.level2,
          backgroundColor: theme.colors.background,
        },
        // tabBarItemStyle: {width: 'auto',marginLeft:10},
        // tabBarIndicatorStyle: {marginLeft:10},
      }}>
      {/* <Tab.Screen
        name="Logs"
        initialParams={{groupId: groupId}}
        component={GroupLogs}
        listeners={({route}) => ({
          focus: e => {
            dispatch(handleCurrentTab(route.name));
            dispatch(selectedMessageIdsClearHandler());
          },
        })}
        options={{
          tabBarIcon: ({focused}) => (
            <List.Icon
              icon={() => (
                <Icon
                  name="notes"
                  color={
                    focused ? theme.colors.onBackground : theme.colors.outline
                  }
                  size={25}
                />
              )}
            />
          ),
          tabBarLabel: () => null,
        }}
      /> */}

      <Tab.Screen
        name="Guests"
        initialParams={{groupId: groupId}}
        component={Invitations}
        listeners={({route}) => ({
          focus: e => {
            dispatch(handleCurrentTab(route.name));
            dispatch(selectedMessageIdsClearHandler());
          },
        })}
      />

      <Tab.Screen
        name="To-do"
        initialParams={{groupId: groupId}}
        component={Tasks}
        listeners={({route}) => ({
          focus: e => {
            // dispatch(handleIsInvitationSearch(false));
            dispatch(handleCurrentTab(route.name));
            dispatch(selectedMessageIdsClearHandler());
          },
        })}
      />

      <Tab.Screen
        name="Chat"
        initialParams={{groupId: groupId}}
        component={Chat}
        listeners={({route}) => ({
          focus: () => {
            dispatch(handleIsInvitationSearch(false));
            dispatch(handleCurrentTab(route.name));
          },
        })}
      />
    </Tab.Navigator>
  );
};

const Index = ({route, navigation}) => {
  const {groupId} = route.params;

  // import export modalize
  const importExportModalizeRef = useRef(null);
  const openGuestsImportExportModalize = () => {
    importExportModalizeRef.current?.open();
  };
  const onCloseGuestsImportExport = () => {
    importExportModalizeRef.current?.close();
  };

  // guests Summary modalize
  const guestsSummaryModalizeRef = useRef(null);
  const openGuestsSummaryModalize = () => {
    guestsSummaryModalizeRef.current?.open();
  };
  const closeGuestsSummaryModalize = () => {
    guestsSummaryModalizeRef.current?.close();
  };

  // tasks Summary modalize
  const tasksSummaryModalizeRef = useRef(null);
  const openTasksSummaryModalize = () => {
    tasksSummaryModalizeRef.current?.open();
  };
  const closeTasksSummaryModalize = () => {
    tasksSummaryModalizeRef.current?.close();
  };

  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      <GroupHeader
        group={route.params}
        openGuestsImportExportModalize={openGuestsImportExportModalize}
        openGuestsSummaryModalize={openGuestsSummaryModalize}
        openTasksSummaryModalize={openTasksSummaryModalize}
      />
      <Tabs groupId={groupId} navigation={navigation} />

      <Modalize
        modalStyle={{backgroundColor: theme.colors.surfaceVariant}}
        ref={importExportModalizeRef}
        handlePosition="inside"
        snapPoint={400}>
        {/* <GroupBrief
          group={route.params.group}
          onClose={onCloseGuestsImportExport}
        /> */}
        <ImportExport group={route.params.group} onClose={onCloseGuestsImportExport} />

      </Modalize>

      <Modalize
        modalStyle={{backgroundColor: theme.colors.surfaceVariant}}
        ref={guestsSummaryModalizeRef}
        handlePosition="inside"
        snapPoint={500}>
        <InvitaionsSummary onClose={closeGuestsSummaryModalize} />
      </Modalize>

      <Modalize
        modalStyle={{backgroundColor: theme.colors.surfaceVariant}}
        ref={tasksSummaryModalizeRef}
        snapPoint={500}
        handlePosition="inside">
        <TasksSummary onClose={closeTasksSummaryModalize} />
      </Modalize>
    </View>
  );
};

export default Index;
