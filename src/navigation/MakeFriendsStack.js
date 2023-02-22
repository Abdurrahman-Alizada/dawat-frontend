import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GeneralAppBar from '../Components/GeneralAppbar'

import MakeFriends from '../Screens/Drawer/MakeFriends/MakeFriends';
import AllFriends from '../Screens/Drawer/MakeFriends/SeeAllFriends';
import FriendsSuggestions from '../Screens/Drawer/MakeFriends/FriendsSuggestion';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="MakeFriendsMain">
      <Stack.Screen
        name="MakeFriendsMain"
        component={MakeFriends}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SeeAllFriends"
        component={AllFriends}
        options={{
          header : (props)=><GeneralAppBar title={"Your friends"} {...props} />
        }}
      />
      <Stack.Screen
        name="FriendsSuggestions"
        component={FriendsSuggestions}
        options={{
          header : (props)=><GeneralAppBar title={"Friends Suggestions"} {...props} />
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
