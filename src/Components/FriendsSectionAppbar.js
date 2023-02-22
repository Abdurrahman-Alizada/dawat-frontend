import React, {useState} from 'react';
import {View} from 'react-native';
import {Menu, Divider, Appbar, Searchbar} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const Header = ({isSearch, setIsSearch, searchFilterFunction}) => {
  const navigation = useNavigation();
  //search
  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
    // searchFilterFunction(search)
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
          <Appbar.Header elevated={true}>
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
            />

            <Appbar.Content
              title="Friend requests"
              titleStyle={{alignSelf: 'center'}}
            />
            <Appbar.Action
              icon="magnify"
              onPress={() => {
                setIsSearch(!isSearch);
              }}
            />

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Appbar.Action icon={MORE_ICON} onPress={() => openMenu()} />
              }>
              <Menu.Item
                leadingIcon="account-check"
                onPress={async () => {
                    closeMenu()
                  navigation.navigate('SeeAllFriends');
                }}
                title="Your friends"
              />
              <Menu.Item
                leadingIcon="account-arrow-right"
                onPress={async () => {
                    closeMenu()
                  navigation.navigate('FriendsSuggestions');
                }}
                title="Suggestions"
              />
            </Menu>
          </Appbar.Header>
        </View>
      ) : (
        <View>
          <Searchbar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            icon="arrow-left"
            onIconPress={BlurHandler}
            cancelButtonTitle="cancel"
            autoFocus
            elevation={2}
            // loading={true}
            // onBlur={BlurHandler}
          />
        </View>
      )}
    </>
  );
};

export default Header;
