import React, {useState} from 'react';
import {View} from 'react-native';
import {Appbar, Searchbar} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import PinScreenAppbarGift from '../adUnits/pinScreenAppbarGift';

const Header = ({isSearch, setIsSearch, istransparent, searchFilterFunction, theme}) => {
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
          elevated={istransparent ? false : true}
          style={{backgroundColor: istransparent ? 'transparent' : theme.colors.background}}>
          <Appbar.Action
            icon="menu"
            color={istransparent ? '#fff' : theme.colors.onBackground}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
          <Appbar.Content
            title="Event Planner"
            titleStyle={{
              color: istransparent ? '#fff' : theme.colors.onBackground,
            }}
          />

          <PinScreenAppbarGift  istransparent={istransparent} />
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
