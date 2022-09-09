// Import React and Component
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import GlobalStyles from '../../GlobalStyles';

import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = ({navigation}) => {
  const isAppFirstLaunched = useRef(true); //onboarding screen decision

  useEffect(() => {
    const firstLaunch = async () => {
      const appData = await AsyncStorage.getItem('isAppFirstLaunched1').then(
        value => value,
      );

      console.log(appData);
      if (appData) {
        isAppFirstLaunched.current = false;
      } else {
        isAppFirstLaunched.current = true;
        await AsyncStorage.setItem('isAppFirstLaunched1', '1');
      }
    };
    firstLaunch();
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      //Check if user_id is set or not If not then send for Authentication else send to Home Screen
      AsyncStorage.getItem('isLoggedIn')
        .then(value => {
          isAppFirstLaunched.current
            ? navigation.replace('Onboarding')
            : navigation.navigate(value == "0" ? 'Auth' : 'Drawer');
        })
        .catch(err => {
          console.log(err);
        });
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{}}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 100 / 2,
            borderWidth: 10,
            borderColor: '#4838D1',
          }}
        />

        <View
          style={{
            width: 30,
            height: 30,
            alignSelf: 'flex-end',
            borderRadius: 100 / 2,
            backgroundColor: '#F77A55',
          }}
        />
      </View>

      <Text
        style={{
          color: '#3E3F41',
          fontSize: 38,
          fontWeight: 'bold',
          letterSpacing: 1,
        }}>
        Dawat
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: GlobalStyles.container,

  image: {width: 260, height: 260, resizeMode: 'stretch'},
});
