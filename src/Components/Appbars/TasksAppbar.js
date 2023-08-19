import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  List,
  Menu,
  Divider,
  Appbar,
  Searchbar,
  Avatar,
  useTheme,
  IconButton,
  Text,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {handleIsSearch} from '../../redux/reducers/groups/groups';
import {
  handleIsTaskSearch,
  handleTasksSearch,
  handleIsTaskSummaryOpen,
} from '../../redux/reducers/groups/tasks/taskSlice';

const Header = ({
  openGuestsImportExportModalize,
  openGuestsSummaryModalize,
  openTasksSummaryModalize,
  group,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();

  //search
  const isSearch = useSelector(state => state.groups.isSearch);

  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
    dispatch(handleIsTaskSearch(search));
    dispatch(handleTasksSearch(search));
  };
  const BlurHandler = () => {
    setSearch('');
    dispatch(handleIsSearch(false));
    dispatch(handleIsTaskSearch(search));
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
          elevated={true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
            marginBottom: 2,
          }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title="To-do"
            titleStyle={{
              color: theme.colors.onBackground,
            }}
          />
          <Appbar.Action
            icon="magnify"
            color={theme.colors.onBackground}
            onPress={() => {
              dispatch(handleIsSearch(true));
              dispatch(handleIsTaskSearch(true));
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
              title="Edit multiple inviti"
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
            marginBottom: 2,
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
