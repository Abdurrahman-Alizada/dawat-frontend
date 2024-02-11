import {Appbar, Text, useTheme, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
// import {useTranslation} from 'react-i18next';
import {Image, StatusBar, View} from 'react-native';
import {useContext, useState} from 'react';
import {ThemeContext} from '../../themeContext';
import {useTranslation} from 'react-i18next';

export default function CustomNavigationBar({title}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const {t} = useTranslation();

  const {toggleTheme, isThemeDark} = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        marginTop:"0.5%"
      }}>
      <StatusBar
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />



      <View style={{flexDirection: 'row', justifyContent:"space-between", width:"100%"}}>
      <Appbar.BackAction style={{alignSelf: 'flex-start'}} onPress={() => navigation.goBack()} />
      <View style={{flexDirection:"row", width:"60%", justifyContent:"space-between"}}>

      <Image
          style={{
            width: 80,
            height: 80,
          }}
          source={require('../../assets/logo/logo.png')}
        />
        <View style={{flexDirection:"row"}}>

        {isThemeDark ? (
          <IconButton
            icon="white-balance-sunny"
            titleStyle={{color: theme.colors.onBackground}}
            onPress={() => toggleTheme()}
          />
        ) : (
          <IconButton icon="weather-night" onPress={() => toggleTheme()} />
        )}
          <IconButton icon="translate" onPress={() => navigation.navigate("ChooseLanguage")} />
        </View>
      </View>

      </View>

      <Text
          style={{
            fontSize: 22,
            textAlign: 'center',
            marginTop:"2%"
          }}>
          {t(title)}
        </Text>
    </View>
  );
}
