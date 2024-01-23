import {Appbar, Text, useTheme, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
// import {useTranslation} from 'react-i18next';
import {Image, StatusBar, View} from 'react-native';
import {useContext, useState} from 'react';
import {ThemeContext} from '../../themeContext';

export default function CustomNavigationBar({title}) {
  const navigation = useNavigation();
  const theme = useTheme();

  const {toggleTheme, isThemeDark} = useContext(ThemeContext);

  return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.background,
          justifyContent: 'space-between',
          paddingHorizontal:"2%"
        }}>
        <StatusBar
          barStyle={isThemeDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        
        <Appbar.BackAction
          style={{alignSelf: 'flex-start'}}
          onPress={() => navigation.goBack()}
        />
        <View>
          <Image
            style={{
              width: 80,
              height: 80,
            }}
            source={require('../../assets/logo/logo.png')}
          />
          <Text
            style={{
              fontSize: 22,
              marginTop: '5%',
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          {isThemeDark ? (
            <IconButton
              icon="white-balance-sunny"
              titleStyle={{color: theme.colors.onBackground}}
              onPress={() => toggleTheme()}
            />
          ) : (
            <IconButton icon="weather-night" onPress={() => toggleTheme()} />
          )}
        </View>
      </View>
   );
}
