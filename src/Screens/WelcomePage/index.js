import {View, StatusBar} from 'react-native';
import React, {useContext} from 'react';
import {useTheme, Avatar, Button,Text, IconButton} from 'react-native-paper';
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
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <StatusBar barStyle={isThemeDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: '2%',
        }}>
        <IconButton
          icon="translate"
          iconColor={theme.colors.onBackground}
          onPress={() => navigation.navigate('ChooseLanguage')}
        />
        {isThemeDark ? (
          <IconButton icon="white-balance-sunny" onPress={() => toggleTheme()} iconColor={theme.colors.onBackground} />
        ) : (
          <IconButton icon="weather-night" iconColor={theme.colors.onBackground} onPress={() => toggleTheme()} />
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
        <View style={{alignItems:"center"}}>
          <Avatar.Image
            size={100}
            style={{
              backgroundColor: theme.colors.background,
            }}
            source={require('../../assets/logo/logo.png')}
          />
          <Text style={{fontSize:20, marginTop:"3%"}}>Event planner - Guests, Todo</Text>
          <Text style={{textAlign:"center", marginTop:"3%"}}>A simple way to organize guests lists and Todo</Text>
        </View>
        
        <View style={{width: '100%', marginBottom: '5%'}}>
        <View
            style={{
              // flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: '2%',
              paddingHorizontal: '1%',
            }}>

<Button
              mode="outlined"
              icon={"account"}
              style={{
                width: '100%',
                borderColor:theme.colors.blueBG
              }}
              contentStyle={{
                padding: '2%',
              }}
              buttonColor={theme.colors.background}
              labelStyle={{
                fontWeight: 'bold',
                color: theme.colors.blueBG,
              }}
              
              onPress={async () => {
                navigation.navigate('Login');
              }}
              theme={{roundness:30}}
              >
              {t("Login")}
            </Button>
            <Button
              mode="outlined"
              style={{
                width: '100%',
                borderColor:theme.colors.blueBG,
                marginTop:"3%"
              }}
              contentStyle={{
                padding: '2%',
              }}
              labelStyle={{
                fontWeight: 'bold',
                color: theme.colors.blueBG,
              }}
              onPress={async () => {
                navigation.navigate('SignUpwithEmail');
              }}
              icon="account-plus"
              theme={{roundness:30}}
              >
              {t("Create account")}
            </Button>

          </View>

          <Button
            style={{
              marginTop: '3%',
            }}
            contentStyle={{padding: '2%'}}
            textColor={theme.colors.onPrimary}
            buttonStyle={{padding: '1%', width: '100%'}}
            theme={{roundness: 30}}
            mode="contained"
            icon={'cloud-off-outline'}
            labelStyle={{fontWeight: 'bold'}}
            onPress={async () => {
              await AsyncStorage.setItem('isLoggedIn', 'login');
              navigation.navigate('Drawer', {screen: 'PinnedGroup'});
            }}
            buttonColor={theme.colors.blueBG}
            >
            {t("Continue without account")}
          </Button>


        </View>
      </View>
    </View>
  );
}
