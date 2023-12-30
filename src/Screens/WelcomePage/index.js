import {View, Text, StatusBar, Image} from 'react-native';
import React from 'react';
import {useTheme, Avatar, Button} from 'react-native-paper';
import Logo from '../../assets/logo/splash-logo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Index({navigation}) {
  const theme = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.blueBG}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.blueBG}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: '5%',
          paddingHorizontal: '3%',
        }}>
        <View>
          <Avatar.Image
            size={100}
            style={{
              marginTop: '9%',
              backgroundColor: theme.colors.blueBG,
            }}
            source={require('../../assets/logo/logo.png')}
          />
        </View>
        <View style={{width: '100%', marginBottom: '5%'}}>
          <Button
            style={{
              marginTop: '3%',
              width: '100%',
            }}
            contentStyle={{padding: '3%', justifyContent: 'flex-start'}}
            textColor={theme.colors.textGray}
            buttonStyle={{padding: '1%', width: '100%'}}
            theme={{roundness: 10}}
            mode="contained"
            icon={'account-plus'}
            labelStyle={{fontWeight: 'bold'}}
            buttonColor={theme.colors.onPrimary}
            onPress={async () => {
              navigation.navigate('SignUpwithEmail');
            }}>
            Sign up
          </Button>

          <Button
            style={{
              marginTop: '3%',
            }}
            contentStyle={{padding: '3%', justifyContent: 'flex-start'}}
            textColor={theme.colors.textGray}
            buttonStyle={{padding: '1%', width: '100%'}}
            theme={{roundness: 10}}
            mode="contained"
            icon={'cloud-off-outline'}
            labelStyle={{fontWeight: 'bold'}}
            onPress={async () => {
              await AsyncStorage.setItem('isLoggedIn', 'login');
              navigation.navigate('Drawer', {screen: 'PinnedGroup'});
            }}
            buttonColor={theme.colors.onPrimary}>
            Continue without sync
          </Button>

          <View
            style={{
              flexDirection: 'row',
              //   justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2%',
              paddingHorizontal: '1%',
            }}>
            <Text style={{fontWeight: 'bold', color: theme.colors.onPrimary}}>
              Already have an account?
            </Text>
            <Button
              mode="text"
              labelStyle={{
                fontWeight: 'bold',
                color: theme.colors.textRed,
              }}
              onPress={async () => {
                // await AsyncStorage.setItem('isLoggedIn', 'login');
                navigation.navigate('Login');
              }}>
              Login
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
