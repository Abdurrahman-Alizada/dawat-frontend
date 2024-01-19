import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import FriendScetionAppBar from '../../../Components/FriendsSectionAppbar';
import {Divider, Text, useTheme} from 'react-native-paper';

import PendingRequest from './PendingRequest';
import {useNavigation} from '@react-navigation/native';

const Social = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [isSearch, setIsSearch] = useState(false);

  return (
    <View style={{flex: 1}}>
      <FriendScetionAppBar isSearch={isSearch} setIsSearch={setIsSearch} />
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FriendsSuggestions')}
          style={{
            paddingHorizontal: '4%',
            paddingVertical: '2%',
            marginVertical: '3%',
            marginHorizontal: '2%',
            borderRadius: 50,
            backgroundColor: theme.colors.secondaryContainer,
          }}>
          <Text style={{color: theme.colors.onSecondaryContainer}}>Suggestions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('RequestSent')}
          style={{
            paddingHorizontal: '4%',
            paddingVertical: '2%',
            marginVertical: '3%',
            marginHorizontal: '2%',
            borderRadius: 50,
            backgroundColor: theme.colors.secondaryContainer,
          }}>
          <Text style={{color: theme.colors.onSecondaryContainer}}>Request sent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SeeAllFriends')}
          style={{
            paddingHorizontal: '4%',
            paddingVertical: '2%',
            marginVertical: '3%',
            marginHorizontal: '2%',
            borderRadius: 50,
            backgroundColor: theme.colors.secondaryContainer,
          }}>
          <Text style={{color: theme.colors.onSecondaryContainer}}>Your friends</Text>
        </TouchableOpacity>
      </View>
      <Divider />

      <PendingRequest />
    </View>
  );
};

export default Social;
