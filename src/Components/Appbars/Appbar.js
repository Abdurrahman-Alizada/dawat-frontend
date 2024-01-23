import React, {useState} from 'react';
import {View} from 'react-native';
import {Appbar, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {handleGroupsSearchText} from '../../redux/reducers/groups/groups';

const Header = ({isSearch, setIsSearch, searchFilterFunction, onOpen, theme}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //search
  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
    searchFilterFunction(search);
    dispatch(handleGroupsSearchText(search));
  };
  const BlurHandler = () => {
    setIsSearch(!isSearch);
  };
  // end search

  return (
    <View>
      {!isSearch ? (
        <Appbar.Header style={{backgroundColor: theme.colors.background}} elevated={true}>
          <Appbar.BackAction color={theme.colors.onBackground} onPress={() => navigation.replace('PinnedGroup')} />
          <Appbar.Content
            title="Events"
            titleStyle={{
              color: theme.colors.onBackground,
            }}
          />
          <Appbar.Action icon="plus" color={theme.colors.onBackground} onPress={onOpen} />
          <Appbar.Action
            icon="magnify"
            color={theme.colors.onBackground}
            onPress={() => {
              setIsSearch(!isSearch);
              searchFilterFunction('');
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
            style={{backgroundColor: theme.colors.background}}
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
