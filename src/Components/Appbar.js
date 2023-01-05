import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Menu,
  Divider,
  Provider,
  Appbar,
  Searchbar,
} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const Header = ({isSearch, setIsSearch}) => {
  const navigation = useNavigation();
  //search
  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
  };
  const BlurHandler = () => {
    setIsSearch(!isSearch);
  };
  // end search

  // "more menu"
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  // end more menu
  return (
    <>
      {!isSearch ? (
        <View>
          <Appbar.Header>
            {/* <Appbar.BackAction onPress={() => {}} /> */}
            <Appbar.Action
              icon="menu"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
            <Appbar.Content title="Title" titleStyle={{alignSelf: 'center'}} />
            <Appbar.Action
              icon="magnify"
              onPress={() => {
                setIsSearch(!isSearch);
              }}
            />
            {/* <Appbar.Action icon={MORE_ICON} onPress={() => {}} /> */}

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Appbar.Action icon={MORE_ICON} onPress={() => openMenu()} />
              }>
              <Menu.Item
                onPress={async () => {
                  closeMenu();
                  navigation.navigate('Profile',{id: await AsyncStorage.getItem("id")});
                }}
                title="Profile"
              />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Item 3" />
            </Menu>
          </Appbar.Header>
        </View>
      ) : (
        <View>
          <Searchbar
            placeholder="Search anything"
            onChangeText={updateSearch}
            value={search}
            cancelButtonTitle="cancel"
            autoFocus
            onBlur={BlurHandler}
            cancel={() => {
              console.log('hello');
            }}
          />
        </View>
      )}
    </>
  );
};


export default Header;
