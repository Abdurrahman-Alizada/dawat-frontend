import {View} from 'react-native';
import React from 'react';
import {List, Divider, Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
const Index = ({navigation}) => {

  
  return (
    <View style={{}}>
      <List.Item
        title="Profile"
        left={props => <List.Icon {...props} icon="account" />}
        onPress={async () => {
          navigation.navigate('Profile', {
            id: await AsyncStorage.getItem('id'),
          });
        }}
        right={props => <List.Icon {...props} icon="chevron-right" />}
        style={{paddingVertical: '5%'}}
      />
      <Divider />

      <List.Item
        title="Preferences"
        left={props => <List.Icon {...props} icon="cog" />}
        onPress={async () => {
          navigation.navigate('Preferences');
        }}
        right={props => <List.Icon {...props} icon="chevron-right" />}
        style={{paddingVertical: '5%'}}
      />
      <Divider />

    </View>
  );
};

export default Index;
