import React, {useState} from 'react';
import {Menu, Divider, Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  handleIsInvitationSearch,
  handleInvitationSearch,
} from '../../redux/reducers/groups/invitations/invitationSlice';
import {handleIsSearch} from '../../redux/reducers/groups/groups';

const Header = ({openGuestsImportExportModalize,func, isChipsShow}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();

  //search
  const isSearch = useSelector(state => state.groups.isSearch);

  // invitationsopenTasksSummaryModalize
  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
    dispatch(handleInvitationSearch(search));
  };
  const BlurHandler = () => {
    setSearch('');
    dispatch(handleIsSearch(false));
    dispatch(handleIsInvitationSearch(false));
  };

  // "more menu"
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  // end more menu
  return (
    <>
      {!isSearch ? (
        <Appbar
          elevated={isChipsShow ? false : true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
          }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title="Guests"
            titleStyle={{
              color: theme.colors.onBackground,
            }}
          />
          <Appbar.Action
            icon="magnify"
            color={theme.colors.onBackground}
            onPress={() => {
              func()
              dispatch(handleIsSearch(true));
              dispatch(handleIsInvitationSearch(true));
            }}
          />

          <Appbar.Action
            icon={isChipsShow ? 'filter-remove' : `filter-outline`}
            color={theme.colors.onBackground}
            onPress={() => {
              func();
            }}
          />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={{backgroundColor: theme.colors.background}}
            anchor={
              <Appbar.Action
                icon={'dots-vertical'}
                color={theme.colors.onBackground}
                onPress={() => openMenu()}
              />
            }>
            <Menu.Item
              onPress={() => {
                closeMenu();
                openGuestsImportExportModalize();
              }}
              title="Import/Export"
              leadingIcon={'microsoft-excel'}
            />
            <Divider />

            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('AddMultipleInviti');
              }}
              title="Add multiple inviti"
              leadingIcon={'account-multiple-plus'}
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('MultipleInvitiActions');
              }}
              title="Bulk actions"
              leadingIcon={'checkbox-multiple-blank-circle-outline'}
            />
          </Menu>
        </Appbar>
      ) : (
        <Appbar
          elevated={true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
          }}>
          <Searchbar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            cancelButtonTitle="cancel"
            autoFocus
            icon="arrow-left"
            onIconPress={BlurHandler}
            theme={{roundness: 0}}
            style={{
              backgroundColor: theme.colors.background,
            }}
            cancel={() => {
              console.log('hello');
            }}
          />
        </Appbar>
      )}
    </>
  );
};

export default Header;
