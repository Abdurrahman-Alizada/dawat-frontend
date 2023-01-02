import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Menu, Divider, Appbar, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const Header = ({isSearch, setIsSearch, onOpen, group}) => {
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
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content
              onPress={() => {
                navigation.navigate('SingleGroupSettings', {group: group});
              }}
              title={group.groupName}
              titleStyle={{alignSelf: 'center'}}
            />
            <Appbar.Action
              icon="briefcase-outline"
              onPress={() => {
                onOpen();
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
