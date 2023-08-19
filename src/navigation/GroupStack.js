import React from 'react';
import GeneralAppbar from '../Components/GeneralAppbar';
import {createStackNavigator} from '@react-navigation/stack';

import HomeIndex from '../Screens/Home/Groups/Index';
import AddGroup from '../Screens/Home/Groups/AddGroup';
import AddGroupMembers from '../Screens/Home/Groups/AddGroupMembers';
import GroupDetail from '../Screens/Home/Groups/GroupDetail';
import SingleGroupSettings from '../Screens/Home/Groups/GroupDetail/GroupSettings/Index';
import AddTask from '../Screens/Home/Groups/GroupDetail/Tasks/AddTask';
import InvitiDetails from '../Screens/Home/Groups/GroupDetail/Invitations/InvitiDetails';
import AddInviti from '../Screens/Home/Groups/GroupDetail/Invitations/AddInviti';

import AddMultipleInviti from '../Screens/Home/Groups/GroupDetail/Invitations/AddMultipleInviti';
import MultipleInvitiActions from '../Screens/Home/Groups/GroupDetail/Invitations/multipleInvitiesActions';

import TaskDetail from '../Screens/Home/Groups/GroupDetail/Tasks/TaskDetail/TaskDetails';
import UpdateTaskMembers from '../Screens/Home/Groups/GroupDetail/Tasks/TaskDetail/UndateTaskMembers';
import AddTaskMembers from '../Screens/Home/Groups/GroupDetail/Tasks/AddTaskMembers';
import UpdateGroupMembers from '../Screens/Home/Groups/GroupDetail/GroupSettings/UpdateGroupMembers';
import PinnedGroup from '../Screens/Home/Groups/PinnedGroup';

import Invitations from '../Screens/Home/Groups/GroupDetail/Invitations';
import Tasks from '../Screens/Home/Groups/GroupDetail/Tasks';
import GroupChat from '../Screens/Home/Groups/GroupDetail/Chat';
import Groupbrief from '../Screens/Home/Groups/GroupDetail/GroupBrief'

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="PinnedGroup">
      <Stack.Screen
        name="PinnedGroup"
        component={PinnedGroup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeIndex"
        component={HomeIndex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddGroup"
        component={AddGroup}
        options={{
          title: 'Add Your Group',
          // headerShown:false
          header: props => <GeneralAppbar title="Add group" {...props} />,
        }}
      />

<Stack.Screen
        name="GroupBrief"
        component={Groupbrief}
        options={{
          title: 'Group brief',
          // headerShown:false
          header: props => <GeneralAppbar title="Group brief" {...props} />,
        }}
      />
      <Stack.Screen
        name="AddGroupMembers"
        component={AddGroupMembers}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetail}
        options={{
          title: 'Group detail',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SingleGroupSettings"
        component={SingleGroupSettings}
        options={{
          title: 'Group settings',
          header: props => (
            <GeneralAppbar title="Group settings" {...props} />
          ),
        }}
      />

      <Stack.Screen
        name="updateGroupMembers"
        component={UpdateGroupMembers}
        options={{
          title: 'Add group members',
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{
          title: 'Tasks',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTask}
        options={{
          header: props => <GeneralAppbar title="Add Task" {...props} />,
        }}
      />

      <Stack.Screen
        name="TaskDetail"
        component={TaskDetail}
        options={{
          // headerShown:false
          header: props => <GeneralAppbar title="Task detail" {...props} />,
        }}
      />

      <Stack.Screen
        name="UpdateTaskMembers"
        component={UpdateTaskMembers}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddTaskMembers"
        component={AddTaskMembers}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Invitations"
        component={Invitations}
        options={{
          title: 'Guests',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddInviti"
        component={AddInviti}
        options={{
          // headerShown:false
          header: props => <GeneralAppbar title="Add inviti" {...props} />,
        }}
      />
      <Stack.Screen
        name="AddMultipleInviti"
        component={AddMultipleInviti}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MultipleInvitiActions"
        component={MultipleInvitiActions}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="GroupChat"
        component={GroupChat}
        options={{
          title: 'Guests',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
