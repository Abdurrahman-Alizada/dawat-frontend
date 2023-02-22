import React, {useState} from 'react';
import {View} from 'react-native';
import {Menu, Appbar, Searchbar} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';

const Header = ({isSearch, setIsSearch, searchFilterFunction, theme}) => {
  const navigation = useNavigation();
  //search
  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
    searchFilterFunction(search);
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
          <Appbar.Header
            style={{backgroundColor: theme.colors.elevation.level2}}
            elevated={true}>
            <Appbar.Action
              icon="menu"
              color={theme.colors.onBackground}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
            <Appbar.Content
              title="App Name"
              titleStyle={{
                alignSelf: 'center',
                color: theme.colors.onBackground,
              }}
            />
            <Appbar.Action
              icon="magnify"
              color={theme.colors.onBackground}
              onPress={() => {
                setIsSearch(!isSearch);
              }}
            />

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              contentStyle={{backgroundColor: theme.colors.background}}
              anchor={
                <Appbar.Action
                  icon={MORE_ICON}
                  color={theme.colors.onBackground}
                  onPress={() => openMenu()}
                />
              }>
              <Menu.Item
                leadingIcon="cog-outline"
                title="Settings"
                titleStyle={{color: theme.colors.onBackground}}
                onPress={async () => {
                  closeMenu();
                  navigation.navigate('AppSettingsMain');
                }}
              />
            </Menu>
          </Appbar.Header>
        </View>
      ) : (
          <Appbar.Header
          style={{backgroundColor: theme.colors.elevation.level2}}
            elevated={true}
          >

          <Searchbar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            icon="arrow-left"
            onIconPress={BlurHandler}
            cancelButtonTitle="cancel"
            autoFocus
            iconColor={theme.colors.onSurface}
            inputStyle={{color:theme.colors.onSurface}}
            placeholderTextColor={theme.colors.onSurface}
            elevation={6}
            // loading={true}
            // onBlur={BlurHandler}
          />
          </Appbar.Header>
      )}
    </>
  );
};

export default Header;
