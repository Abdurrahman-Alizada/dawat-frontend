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

const Header = ({isSearch, deleteF, onOpen, groupName, checkedBack, theme}) => {
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  // end more menu
  return (
    
        <Appbar.Header elevated style={{backgroundColor: theme.colors.background}}>
          {/* <Appbar.BackAction
            color={theme.colors.onBackground}
            onPress={() => checkedBack()}
          /> */}
          <Appbar.Action
            color={theme.colors.onBackground}
            icon="close"
            onPress={() => {
              checkedBack();
            }}
          />
          <Appbar.Content
            title={groupName}
            titleStyle={{alignSelf: 'center'}}
          />

          <Appbar.Action
            color={theme.colors.onBackground}
            icon="delete-outline"
            onPress={() => {
              deleteF();
            }}
          />
        </Appbar.Header>
    
  );
};

export default Header;
