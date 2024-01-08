import React, {useState} from 'react';
import {View} from 'react-native';
import {Menu, Appbar, Searchbar, useTheme} from 'react-native-paper';
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

  return (
    <View>
      {!isSearch ? (
        <Appbar.Header
          style={{backgroundColor: 'transparent'}}
        >
          <Appbar.Action
            icon="menu"
            color={'#fff'}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
          <Appbar.Content
            title="Event Planner"
            titleStyle={{
              color: '#fff',
            }}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header style={{backgroundColor: theme.colors.background}}>
          <Searchbar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            icon="arrow-left"
            onIconPress={BlurHandler}
            cancelButtonTitle="cancel"
            autoFocus
            iconColor={theme.colors.onSurface}
            inputStyle={{color: theme.colors.onSurface}}
            placeholderTextColor={theme.colors.onSurface}
            // elevation={6}
            theme={{roundness: 0}}
            // loading={true}
            // onBlur={BlurHandler}
          />
        </Appbar.Header>
      )}
    </View>
  );
};

export default Header;
