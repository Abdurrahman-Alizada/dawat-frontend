import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, Linking, Alert, TouchableOpacity, Image} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Avatar, Drawer, List, useTheme, Text, Divider} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useGetCurrentLoginUserQuery} from '../redux/reducers/user/userThunk';
import {useDispatch, useSelector} from 'react-redux';
import {handleCurrentLoaginUser} from '../redux/reducers/user/user';
import {useTranslation} from 'react-i18next';

import {version} from '../../package.json';

export default function DrawerContent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {t} = useTranslation();
  const currentLoginUser = useSelector(state => state.user.currentLoginUser);

  const {
    data: user,
    isError,
    error,
    isLoading,
    refetch,
  } = useGetCurrentLoginUserQuery(currentLoginUser?._id);

  useEffect(() => {
    if (user) {
      dispatch(handleCurrentLoaginUser(user));
    }
  }, [user]);

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: theme.colors.background}}
      contentContainerStyle={{flex: 1,paddingTop:"8%", justifyContent: 'space-between'}}>
      <View>
        {/* <List.Item
          title={'Event planner'}
          description={'Guests, Todos, Chat'}
          left={() => (
            <Image
              style={{
                width: 60,
                height: 60,
                marginLeft: '7%',
              }}
              source={require('../assets/logo/logo.png')}
            />
          )}
          titleStyle={{fontWeight: 'bold', fontSize: 20}}
        />
        <Divider style={{marginBottom: '5%'}} /> */}

        <Drawer.Item
          label={t("Events")}
          onPress={() => {
            navigation.navigate('GroupStack', {screen: 'HomeIndex'});
          }}
          icon="calendar-month"
        />

        <Drawer.Item
          label={t("Friends")}
          onPress={() => navigation.navigate('MakeFriends', {screen: 'MakeFriendsMain'})}
          theme={{roundness: 0}}
          icon="account-multiple"
        />

        <Drawer.Item
          label={t("Settings")}
          onPress={async () => {
            navigation.navigate('AppSettingsMain');
          }}
          theme={{roundness: 0}}
          icon="cog"
        />
        {/* {isLoading ? (
          <List.Item
            title={props => (
              <SkeletonPlaceholder borderRadius={4} {...props}>
                <SkeletonPlaceholder.Item width="60%" height={10} />
                <SkeletonPlaceholder.Item marginTop={7} width="30%" height={10} />
              </SkeletonPlaceholder>
            )}
            left={props => (
              <SkeletonPlaceholder borderRadius={4} {...props}>
                <SkeletonPlaceholder.Item flexDirection="column" alignItems="flex-start">
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
            theme={{roundness: 0}}
            rippleColor={theme.colors.background}
            icon="account-outline"
          />
        )} */}

        <Drawer.Item
          label={t("Watch ad")}
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
        <Text style={{marginVertical: '5%', alignSelf: 'center'}}>Version {version}</Text>
      </View>
    </DrawerContentScrollView>
  );
}
