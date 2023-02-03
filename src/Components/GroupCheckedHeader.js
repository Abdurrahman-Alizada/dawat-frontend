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
        </Appbar.Header>
      </View>
    </>
  );
};


export default Header;
