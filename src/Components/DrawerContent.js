import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, Linking, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Avatar, Drawer, List, useTheme, Text} from 'react-native-paper';
import {PreferencesContext} from '../themeContext';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useGetCurrentLoginUserQuery} from '../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch} from 'react-redux';
import {handleCurrentLoaginUser} from '../redux/reducers/user/user';
import {userApi} from '../redux/reducers/user/userThunk';
import {groupApi} from '../redux/reducers/groups/groupThunk';
import {friendshipApi} from '../redux/reducers/Friendship/friendshipThunk';
export default function DrawerContent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [active, setActive] = useState('');
  const {toggleTheme, isThemeDark} = useContext(PreferencesContext);
  const id = useRef(null);
  const getUserInfo = async () => {
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
    refetch,
  } = useGetCurrentLoginUserQuery(id.current);

  const logout = async () => {
    setActive('logout');
    await AsyncStorage.setItem('isLoggedIn', '0');
    await AsyncStorage.setItem('id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('userId', '');
    await AsyncStorage.setItem('name', '');
    await AsyncStorage.setItem('ImageURL', '');
    dispatch(handleCurrentLoaginUser({}));
    // dispatch(userApi.util.resetApiState())
    dispatch(groupApi.util.resetApiState());
    // dispatch(friendshipApi.util.resetApiState())
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('Auth');
  };

  useEffect(() => {
    if (user) {
      dispatch(handleCurrentLoaginUser(user));
    }
  }, [user]);

  const obscureEmail = (email) => {
    const [name, domain] = email.split('@');
    return `${name[0]}${name[1]}${new Array(name.length - 3 ).join('*')}@${domain}`;
  };


  // privacy policy 
  const handlePrivacyPolicyPress = async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL("https://fantastic-maamoul-0a74ba.netlify.app/privacy-policy");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL("https://fantastic-maamoul-0a74ba.netlify.app/privacy-policy");
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
              navigation.navigate('AppSettingsMain', {
                screen: 'Profile',
                params: {id: await AsyncStorage.getItem('id')},
              });
            }}
            left={props => (
              <Avatar.Image
                {...props}
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
            description={obscureEmail(user?.email)}
          />
        )}

        <Drawer.Item
          onPress={() => {
            navigation.navigate('MakeFriends', {screen: 'MakeFriendsMain'});
          }}
          icon="account-multiple"
          label="Friends"
        />

        {/* <Drawer.Section title="Preferences" >
          <Drawer.Item
            icon="weather-night"
            label="Dark Mode"
            right={() => (
              <Switch value={isThemeDark} onValueChange={() => toggleTheme()} />
            )}
          />
        </Drawer.Section> */}

        <Drawer.Item
          icon="seed"
          label="Watch an ad"
          onPress={() => navigation.navigate('SupportUs')}
        />

      </View>
      <View>

      <Drawer.Item
          icon="seed"
          label="Privacy policy"
          onPress={() => handlePrivacyPolicyPress()}
        />

      <List.Item
          title="Logout"
          onPress={() => logout()}
          left={() => <List.Icon icon="logout" color={theme.colors.error} />}
          style={{
            backgroundColor: theme.colors.errorContainer,
            paddingHorizontal: '11%',
            marginVertical:"3%"
          }}
          titleStyle={{color: theme.colors.error}}
        />
      <Text style={{alignSelf:"center", margin:"5%"}} >V 0.0.1</Text>
      </View>

    </DrawerContentScrollView>
  );
}
