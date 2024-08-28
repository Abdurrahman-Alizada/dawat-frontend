import React, {useState} from 'react';
import {Menu, Divider, Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  handleIsInvitationSearch,
  handleInvitationSearch,
} from '../../redux/reducers/groups/invitations/invitationSlice';
import {handleIsSearch} from '../../redux/reducers/groups/groups';
import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
const Header = ({openGuestsImportExportModalize, func, openGuestsSummaryModalize, isChipsShow}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation();

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
            title={t('Guests')}
            titleStyle={{
              color: theme.colors.onBackground,
            }}
          />
          <Appbar.Action
            icon="magnify"
            color={theme.colors.onBackground}
            onPress={() => {
              func(true);
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
          <Appbar.Action
            icon={`briefcase-outline`}
            color={theme.colors.onBackground}
            onPress={() => {
              openGuestsSummaryModalize()
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
              title={t('Import/Export')}
              leadingIcon={'microsoft-excel'}
            />
            <Divider />

            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('AddMultipleInviti');
              }}
              title={t('Add multiple guests')}
              leadingIcon={'account-multiple-plus'}
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('MultipleInvitiActions');
              }}
              title={t('Bulk actions')}
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
            placeholder={t('Search...')}
            onChangeText={updateSearch}
            value={search}
            cancelButtonTitle="cancel"
            autoFocus
            icon={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
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
