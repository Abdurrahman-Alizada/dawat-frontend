// Import React and Component
import React, {useLayoutEffect, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import GlobalStyles from '../../GlobalStyles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      //Check if user_id is set or not If not then send for Authentication else send to Home Screen
     
      AsyncStorage.getItem('isLoggedIn')
        .then(value => {
          setTimeout(() => {
            isAppFirstLaunched.current
              ? navigation.replace('Onboarding')
              : navigation.replace(!value ? 'Auth' : 'Drawer');
          }, 3000);
     
          })
        .catch(err => {
          console.log(err);
        });
  }, []);


  useLayoutEffect( () => {
  const fun = async()=>{
   await axios.get(`https://dawat-backend.onrender.com`);
  }
  fun();
}, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{flexDirection: 'row', alignItems: "center"}}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              width: 55,
              height: 55,
              borderRadius: 100 / 2,
              borderWidth: 9,
              borderColor: '#3557b7',
            }}
          >

          </View>

          <View
            style={{
              width: 18.3,
              height: 18.3,
              alignSelf: 'flex-end',
              borderRadius: 100 / 2,
              backgroundColor: '#F77A55',
            }}
          />
        </View>
        <View style={{marginHorizontal:"5%",}}>

        <Text
          style={{
            color: '#3E3F41',
            fontSize: 31,
            fontWeight: 'bold',
            letterSpacing: 5,
          }}>
          Event 
        </Text>
        <Text
          style={{
            color: '#3E3F41',
            fontSize: 29,
            letterSpacing: 1,
          }}>
          Planner 
        </Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: GlobalStyles.container,

  image: {width: 260, height: 260, resizeMode: 'stretch'},
});
