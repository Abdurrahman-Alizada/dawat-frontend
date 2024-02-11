import {View, Text, StatusBar} from 'react-native';
import React, {useContext} from 'react';
import {useTheme, Avatar, Button, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../themeContext';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function Index({}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t}= useTranslation();

  const {toggleTheme, isThemeDark} = useContext(ThemeContext);

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.blueBG}}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.blueBG} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: '2%',
        }}>
        <IconButton
          icon="translate"
          iconColor={'#fff'}
          onPress={() => navigation.navigate('ChooseLanguage')}
        />
        {isThemeDark ? (
          <IconButton icon="white-balance-sunny" onPress={() => toggleTheme()} iconColor={'#fff'} />
        ) : (
          <IconButton icon="weather-night" iconColor={'#fff'} onPress={() => toggleTheme()} />
        )}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10%',
          paddingHorizontal: '3%',
        }}>
        <View>
          <Avatar.Image
            size={100}
            style={{
              backgroundColor: theme.colors.blueBG,
            }}
            source={require('../../assets/logo/logo.png')}
          />
        </View>
        
        <View style={{width: '100%', marginBottom: '5%'}}>
        <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: '2%',
              paddingHorizontal: '1%',
            }}>
            <Button
              mode="outlined"
              style={{
                width: '48%',
                borderColor:"#fff"
              }}
              contentStyle={{
                padding: '2%',
              }}
              labelStyle={{
                fontWeight: 'bold',
                color: '#fff',
              }}
              onPress={async () => {
                navigation.navigate('SignUpwithEmail');
              }}
              icon="account-plus"
              // theme={{roundness:30}}
              >
              {t("Create account")}
            </Button>
            <Button
              mode="outlined"
              icon={"account"}
              style={{
                width: '48%',
                borderColor:"#fff"
              }}
              contentStyle={{
                padding: '2%',
              }}
              labelStyle={{
                fontWeight: 'bold',
                color: '#fff',
              }}
              
              onPress={async () => {
                navigation.navigate('Login');
              }}
              >
              {t("Login")}
            </Button>
          </View>

          <Button
            style={{
              marginTop: '3%',
            }}
            contentStyle={{padding: '2%', justifyContent: 'flex-start'}}
            textColor={theme.colors.textGray}
            buttonStyle={{padding: '1%', width: '100%'}}
            // theme={{roundness: 10}}
            mode="contained"
            icon={'cloud-off-outline'}
            labelStyle={{fontWeight: 'bold'}}
            onPress={async () => {
              await AsyncStorage.setItem('isLoggedIn', 'login');
              navigation.navigate('Drawer', {screen: 'PinnedGroup'});
            }}
            buttonColor={'#fff'}>
            {t("Continue without account")}
          </Button>


        </View>
      </View>
    </View>
  );
}
