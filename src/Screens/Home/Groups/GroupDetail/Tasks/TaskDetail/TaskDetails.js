import { View, Text } from 'react-native'
import React from 'react'
import TaskDataAndUpdate from './TaskDataAndUpdate'
import TaskActivities from './TaskActivities';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5'
const TaskDetails = () => {
  const theme = useTheme()
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={{flex:1}}>
    <Tab.Navigator
      initialRouteName="Details"
      tabBarShowIcon={true}
      screenOptions={{
        tabBarLabelStyle: {fontSize: 15, fontWeight: 'bold', textTransform:"none"},
        tabBarStyle:{backgroundColor: theme.colors.elevation.level2}
      }}>
      <Tab.Screen
        name="Details"
        component={TaskDataAndUpdate}
      />

      <Tab.Screen
        name="Activities"
        component={TaskActivities}
      />

    </Tab.Navigator>

    </View>

    )
}

export default TaskDetails