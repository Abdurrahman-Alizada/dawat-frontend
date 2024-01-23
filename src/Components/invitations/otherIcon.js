import {Image, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';

const OtherIcon = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingRight: '5%',
        paddingLeft: '2%',
        alignItems: 'center',
        backgroundColor: '#653B3B',
        borderRadius: 50,
        paddingVertical: '1.5%',
      }}>
      <Image
        style={{width: 20, height: 20, marginRight: 5}}
        source={require('../../assets/images/groupDetails/other-approve-icon.png')}
        //   source={require('../../assets')}
      />
      <Text style={{color: '#fff'}}>Other</Text>
    </View>
  );
};

export default OtherIcon;
