// Import React and Component
import React, {useLayoutEffect, useEffect, useRef} from 'react';
import {View, StatusBar, Image} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme, Text, Avatar} from 'react-native-paper';
import {version} from '../../../package.json';
import {useDispatch} from 'react-redux';
import {handleCurrentLoaginUser} from '../../redux/reducers/user/user';
import {handleCurrentBackgroundImgSrcId} from '../../redux/reducers/groups/groups';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isAppFirstLaunched = useRef(true); //onboarding screen decision

  const getCurrentBackgroundImage = async () => {
    dispatch(
      handleCurrentBackgroundImgSrcId(
        Number(await AsyncStorage.getItem(`pingroup_backgroundImage`)),
      ),
    );
  };

  useEffect(() => {
    const firstLaunch = async () => {
      const appData = await AsyncStorage.getItem('isAppFirstLaunched1').then(value => value);
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
        AsyncStorage.getItem('userId').then(id => {
          dispatch(handleCurrentLoaginUser({_id: id}));
          isAppFirstLaunched?.current
            ? navigation.replace('Onboarding')
            : navigation.replace(!value ? 'Auth' : 'Drawer');
        });
        getCurrentBackgroundImage();
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.blueBG,
      }}>
      <View
        style={{
          flex: 0.95,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.blueBG,
        }}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.blueBG} />
        <Image
          style={{
            width: 100,
            height: 100,
          }}
          source={require('../../assets/logo/logo.png')}
        />
      </View>
      <Text style={{fontWeight: 'bold', color: theme.colors.onPrimary}}>V {version}</Text>
    </View>
  );
};

export default SplashScreen;
