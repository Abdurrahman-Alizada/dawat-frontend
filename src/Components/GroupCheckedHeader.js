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

const Header = ({isSearch, deleteF, onOpen, groupName, checkedBack}) => {
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  // end more menu
  return (
    <>
      <View>
        <Appbar.Header>
          {/* <Appbar.BackAction onPress={() => {}} /> */}
          <Appbar.BackAction onPress={() => checkedBack()} />
          <Appbar.Content
            title={groupName}
            titleStyle={{alignSelf: 'center'}}
          />

          <Appbar.Action
            icon="delete-outline"
            onPress={() => {
              deleteF();
            }}
          />

          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action icon={MORE_ICON} onPress={() => openMenu()} />
            }>
            <Menu.Item onPress={() => {}} title="Profile" />
            <Menu.Item onPress={() => {}} title="Item 2" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Item 3" />
          </Menu>
        </Appbar.Header>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#397af8',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
