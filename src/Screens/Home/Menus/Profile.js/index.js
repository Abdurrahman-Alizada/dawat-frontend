import {Text, View, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../../Components/ProfileScreenHeader';
import {Avatar, List, IconButton, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

export default ProfileIndex = () => {
  const [user, setUser] = useState({name: '', email: ''});
  const { colors } = useTheme();

  const getUser = async () => {
    setUser({
      name: await AsyncStorage.getItem('name'),
      email: await AsyncStorage.getItem('email'),
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <SafeAreaView>
      <Header />
      <List.Section
        style={{
          marginVertical: '2%',
          paddingVertical: '2%',
        }}>
        <View>
          <Avatar.Image
            source={{
              uri: 'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
            }}
            style={{alignSelf: 'center'}}
            size={130}
          />
          <IconButton
            style={{position: 'absolute', left: '55%', top: 75}}
            icon="camera"
            mode="contained"
            size={28}
            onPress={() => console.log('Pressed')}
          />
        </View>

        <View style={{padding: '5%'}}>
          <List.Subheader>Name </List.Subheader>
          <List.Item
            title={user.name}
            left={props => <List.Icon {...props} icon="account-outline" />}
            right={() => (
              <IconButton
                icon="pencil"
                mode="outlined"
                size={20}
                onPress={() => console.log('Pressed')}
              />
            )}
          />
          <List.Subheader>Email</List.Subheader>

          <List.Item
            title={user.email}
            left={props => <List.Icon {...props} icon="email-outline" />}
            right={() => (
              <IconButton
                icon="pencil"
                mode="outlined"
                size={20}
                onPress={() => console.log('Pressed')}
              />
            )}
          />
        </View>
      </List.Section>
      
    </SafeAreaView>
  );
};
