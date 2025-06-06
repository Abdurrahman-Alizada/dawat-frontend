import React, {useState} from 'react';
import {View} from 'react-native';
import {Menu, Divider, Appbar, useTheme} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const Header = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const {t} = useTranslation();
  // "more menu"
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  // end more menu
  return (
    <Appbar.Header elevated={true} style={{backgroundColor: theme.colors.background}}>
      <Appbar.BackAction
        onPress={() => {
          navigation.goBack();
        }}
      />

      <Appbar.Content title={t("Friends")} />
      <Appbar.Action
        icon="magnify"
        onPress={() => {
          // setIsSearch(!isSearch);
          navigation.navigate('FriendsSearch');
        }}
      />

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon={MORE_ICON} onPress={() => openMenu()} />}
        contentStyle={{backgroundColor: theme.colors.background}}>
        <Menu.Item
          leadingIcon="account-cancel"
          onPress={async () => {
            closeMenu();
            navigation.navigate('DeletedFriendsSuggestions');
          }}
          title={t("Deleted suggestions")}
        />
      </Menu>
    </Appbar.Header>
  );
};

export default Header;
