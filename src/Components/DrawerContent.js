import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, Linking, Alert, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Drawer,
  List,
  useTheme,
  Text,
  Divider,
} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useGetCurrentLoginUserQuery} from '../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch} from 'react-redux';
import {handleCurrentLoaginUser} from '../redux/reducers/user/user';
import {userApi} from '../redux/reducers/user/userThunk';
import {groupApi} from '../redux/reducers/groups/groupThunk';
import {friendshipApi} from '../redux/reducers/Friendship/friendshipThunk';

import {version} from '../../package.json';

export default function DrawerContent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const id = useRef(null);
  const token = useRef(null);
  const getUserInfo = async () => {
    id.current = await AsyncStorage.getItem('userId');
    token.current = await AsyncStorage.getItem('token');
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const {
    data: user,
    isError,
    error,
    isLoading,
    refetch,
  } = useGetCurrentLoginUserQuery(id.current);

  const logout = async () => {
    await AsyncStorage.setItem('isLoggedIn', '');
    await AsyncStorage.setItem('id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('userId', '');
    await AsyncStorage.setItem('name', '');
    await AsyncStorage.setItem('ImageURL', '');
    dispatch(handleCurrentLoaginUser({}));
    dispatch(groupApi.util.resetApiState());
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('Auth');
  };

  useEffect(() => {
    if (user) {
      dispatch(handleCurrentLoaginUser(user));
    }
  }, [user]);

  const obscureEmail = email => {
    if (!email) return '*******';
    const [name, domain] = email?.split('@');
    return `${name[0]}${name[1]}${new Array(name.length - 3).join(
      '*',
    )}@${domain}`;
  };

  const handlePrivacyPolicyPress = async () => {
    const supported = await Linking.canOpenURL(
      'https://eventplannerapp.netlify.app/privacy-policy',
    );

    if (supported) {
      await Linking.openURL(
        'https://eventplannerapp.netlify.app/privacy-policy',
      );
    } else {
      Alert.alert(`Something went wrong`);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: theme.colors.background}}
      contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <List.Item
          title={'Event planner'}
          description={'Guests, Todos, Chat'}
          left={props => (
            <Avatar.Image
              {...props}
              source={require('../assets/logo/logo.png')}
              size={50}
            />
          )}
          titleStyle={{fontWeight: 'bold', fontSize: 20}}
          style={{padding: '2%'}}
        />

        <Drawer.Item
          label="Friends"
          onPress={() => {
            navigation.navigate('MakeFriends', {screen: 'MakeFriendsMain'});
          }}
          icon="account-multiple"
        />

        <Drawer.Item
          label="Groups"
          onPress={() => {
            navigation.navigate('GroupStack', {screen: 'HomeIndex'});
          }}
          icon="account-group"
        />

        <Drawer.Item
          label="Watch ad"
          icon="motion-play"
          onPress={() => navigation.navigate('SupportUs')}
        />

        {/* <List.Item
          title="Logout"
          onPress={() => logout()}
          left={() => <List.Icon icon="logout" color={theme.colors.error} />}
          style={{
            paddingHorizontal: '11%',
            marginVertical: '3%',
          }}
          titleStyle={{color: theme.colors.error}}
        /> */}
      </View>

      <View style={{marginVertical: '5%'}}>
        <Divider />
        {isLoading ? (
          <List.Item
            title={props => (
              <SkeletonPlaceholder borderRadius={4} {...props}>
                <SkeletonPlaceholder.Item width="60%" height={10} />
                <SkeletonPlaceholder.Item
                  marginTop={7}
                  width="30%"
                  height={10}
                />
              </SkeletonPlaceholder>
            )}
            left={props => (
              <SkeletonPlaceholder borderRadius={4} {...props}>
                <SkeletonPlaceholder.Item
                  flexDirection="column"
                  alignItems="flex-start">
                  <SkeletonPlaceholder.Item
                    width={50}
                    marginLeft={20}
                    height={30}
                    borderRadius={50}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )}
          />
        ) : (
          <Drawer.Item
            label="My profile"
            onPress={async () => {
              navigation.navigate('AppSettingsMain', {
                screen: 'Profile',
                params: {id: await AsyncStorage.getItem('id')},
              });
            }}
            theme={{roundness:0}}
            rippleColor={theme.colors.background}
            icon="account-outline"
          />
        )}
        <Divider />
        <Drawer.Item
            label="Settings"
            onPress={async () => {
              navigation.navigate('AppSettingsMain');
            }}
            theme={{roundness:0}}
            icon="cog-outline"
            // style={{width:"100%"}}
          />
          <Divider />
        <View style={{flexDirection: 'row',paddingHorizontal:"4%", justifyContent: 'space-around'}}>
          <TouchableOpacity
            onPress={() => handlePrivacyPolicyPress()}
            style={{alignSelf: 'center', margin: '5%'}}>
            <Text>Privacy policy</Text>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              marginBottom: 6,
              fontSize: 20,
            }}>
            .
          </Text>
          <Text style={{alignSelf: 'center', margin: '5%'}}>V {version}</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
