import {Image, View} from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';

const InvitedIcon = () => {
  return (
      <View
        style={{
          flexDirection: 'row',
          paddingRight: '5%',
          paddingLeft: '2%',
          alignItems: 'center',
          backgroundColor: '#47D065',
          borderRadius: 50,
          paddingVertical: '1.5%',
        }}>
        <Image
          style={{width: 20, height: 20, marginRight: 5}}
          source={require('../../assets/images/groupDetails/invitation-approve-icon.png')}
        //   source={require('../../assets')}
        />
        <Text style={{color: '#fff'}}>Invited</Text>
    </View>
  );
};

export default InvitedIcon;
