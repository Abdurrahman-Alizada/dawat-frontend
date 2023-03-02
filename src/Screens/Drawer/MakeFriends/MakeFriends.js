import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import FriendScetionAppBar from '../../../Components/FriendsSectionAppbar';
import {useTheme} from 'react-native-paper';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import RequestSent from './RequestSent';
import PendingRequest from './PendingRequest';

const Social = () => {
  const Tab = createMaterialTopTabNavigator();
  const theme = useTheme();

  const [isSearch, setIsSearch] = useState(false);

  return (
    <View style={{flex: 1}}>
      <FriendScetionAppBar isSearch={isSearch} setIsSearch={setIsSearch} />

      <Tab.Navigator
        initialRouteName="PendingRequest"
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            textTransform: 'none',
          },
          tabBarStyle: {backgroundColor: theme.colors.elevation.level2},
        }}>
        <Tab.Screen
          name="PendingRequest"
          options={{tabBarLabel: 'Friend requests'}}
          component={PendingRequest}
        />

        <Tab.Screen
          name="RequestSent"
          options={{tabBarLabel: 'Request sent'}}
          component={RequestSent}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Social;
