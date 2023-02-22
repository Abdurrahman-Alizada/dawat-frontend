import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Avatar, Drawer, List, Switch, useTheme} from 'react-native-paper';
import {PreferencesContext} from '../themeContext';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useGetCurrentLoginUserQuery} from '../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-community/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch} from 'react-redux';
import {handleCurrentLoaginUser} from '../redux/reducers/user/user';
export default function DrawerContent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [active, setActive] = useState('');
  const {toggleTheme, isThemeDark} = useContext(PreferencesContext);
  const id = useRef(null);
  const getUserInfo = async () => {
    // const value = await AsyncStorage.getItem('name');
    // setName(await AsyncStorage.getItem('name'));
    // setEmail(await AsyncStorage.getItem('email'));
    // setImageURL(await AsyncStorage.getItem('imageURL'));
    id.current = await AsyncStorage.getItem('userId');
    // console.log('User name', value);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const {
    data: user,
    isError,
    error,
    isLoading,
  } = useGetCurrentLoginUserQuery(id.current);

  const logout = async () => {
    setActive('logout');
    await AsyncStorage.setItem('isLoggedIn', '0');
    await AsyncStorage.setItem('id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('userId', '');
    await AsyncStorage.setItem('name', '');
    await AsyncStorage.setItem('ImageURL', '');
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('Auth');
  };

  useEffect(() => {
    if (user) {
      dispatch(handleCurrentLoaginUser(user));
    }
  }, [user]);

  return (
    <DrawerContentScrollView {...props} style={{backgroundColor:theme.colors.elevation.level2}}>
      <View style={styles.drawerContent}>
        {isLoading ? (
          <List.Item
            title={props => (
              <SkeletonPlaceholder borderRadius={4} {...props}>
                <SkeletonPlaceholder.Item width="60%" height={15} />
                <SkeletonPlaceholder.Item
                  marginTop={7}
                  width="30%"
                  height={12}
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
                    height={50}
                    borderRadius={50}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )}
          />
        ) : (
          <List.Item
            title={user?.name}
            onPress={async () => {
              navigation.navigate('Profile', {
                id: await AsyncStorage.getItem('id'),
              });
            }}
            left={props => (
              <Avatar.Image
                {...props}
                // size={30}
                source={{
                  uri: user?.imageURL
                    ? user?.imageURL
                    : 'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Bear_nvybp5.png',
                }}
                size={50}
              />
            )}
            // right={props => (
            //   <List.Icon size={30} {...props} icon="chevron-right" />
            // )}
            description={user?.email}
          />
        )}

        <Drawer.Item
          onPress={() => {
            navigation.navigate('MakeFriends');
          }}
          icon="account-multiple"
          label="Friends"
        />

        <Drawer.Section title="Preferences" style={styles.drawerSection}>
          <Drawer.Item
            icon="weather-night"
            label="Dark Mode"
            right={() => (
              <Switch value={isThemeDark} onValueChange={() => toggleTheme()} />
            )}
          />
        </Drawer.Section>

        <Drawer.Item
          icon="logout"
          label="Logout"
          active={active === 'logout'}
          onPress={() => logout()}
          style={{}}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: '2%',
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
