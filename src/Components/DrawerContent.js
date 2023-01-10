import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {PreferencesContext} from '../themeContext';
import { useNavigation,DrawerActions } from '@react-navigation/native';
import { useGetCurrentLoginUserQuery } from '../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-community/async-storage';

export default function DrawerContent(props) {
  const navigation = useNavigation();
  
  const [active, setActive] = useState('');
  const {toggleTheme, isThemeDark} = useContext(PreferencesContext);
  const [name, setName] = useState('Abdur Rahman');
  const id = useRef(null);
  const [email, setEmail] = useState('abdurrahman@gmail.com');
  const [imageURL, setImageURL] = useState('');
  const getUserInfo = async () => {
    // const value = await AsyncStorage.getItem('name');
    // setName(await AsyncStorage.getItem('name'));
    // setEmail(await AsyncStorage.getItem('email'));
    // setImageURL(await AsyncStorage.getItem('imageURL'));
    id.current = await AsyncStorage.getItem("userId")
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
    await AsyncStorage.setItem('isLoggedIn', '0');
    await AsyncStorage.setItem('id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('userId', '');
    await AsyncStorage.setItem('name', '');
    await AsyncStorage.setItem('ImageURL', '');
    navigation.dispatch(DrawerActions.closeDrawer())
    navigation.navigate('Auth');
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri:user?.imageURL ? user?.imageURL : 'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Bear_nvybp5.png',
            }}
            size={70}
          />
          <Title style={styles.title}>{user?.name}</Title>
          <Caption style={styles.caption}>{user?.email}</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {user?.groups?.length}
              </Paragraph>
              <Caption style={styles.caption}>Groups</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                23
              </Paragraph>
              <Caption style={styles.caption}>Tasks to do</Caption>
            </View>
          </View>
        </View>

        <Drawer.Section title="General" style={styles.drawerSection}>
          
          <Drawer.Item
            icon="star"
            label="Social"
            active={active === 'social'}
            onPress={() => {
              setActive('social')
              navigation.navigate("Social")
            }}
          />
        </Drawer.Section>

        <Drawer.Section style={styles.drawerSection} title="Preferences">
          <TouchableRipple onPress={() => toggleTheme()}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={isThemeDark} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={true} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>

        <Drawer.Item
          icon="logout"
          label="Logout"
          active={active === 'first'}
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
