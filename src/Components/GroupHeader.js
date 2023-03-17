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
import {
  handleIsInvitationSearch,
  handleInvitationSearch,
} from '../redux/reducers/groups/invitations/invitationSlice';

const Header = ({onOpen, group}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();

  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );
  const currentTab = useSelector(state => state.groups.currentTab);

  const getMembersOfGroup = () => {
    let membersText = currentViewingGroup.users?.map(user => {
      return user.name;
    });
    return membersText.toString().length < 25
      ? membersText.toString()
      : `${membersText.toString().substring(0, 25)}...`;
  };

  //search
  const [search, setSearch] = useState('');
  const isInvitaionSearch = useSelector(
    state => state.invitations.isInvitaionSearch,
  );

  const updateSearch = search => {
    setSearch(search);
    dispatch(handleInvitationSearch(search));
  };
  const BlurHandler = () => {
    setSearch('');
    dispatch(handleIsInvitationSearch(false));
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
      {!isInvitaionSearch ? (
        <Appbar
          elevated={true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              maxWidth: '70%',
            }}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SingleGroupSettings', {group: group});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
              }}>
              <Avatar.Image
                size={40}
                source={
                  currentViewingGroup.imageURL
                    ? {uri: currentViewingGroup.imageURL}
                    : require('../assets/drawer/male-user.png')
                }
              />
              <View style={{marginLeft: 5}}>
                <Text style={{fontSize: 18, fontWeight: '700'}}>
                  {currentViewingGroup.groupName?.length > 18
                    ? `${currentViewingGroup.groupName.substring(0, 18)}...`
                    : currentViewingGroup.groupName}
                </Text>
                <Text
                  style={{
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    // marginLeft: 5,
                  }}>
                  {getMembersOfGroup()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              maxWidth: '20%',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={25}
                  onPress={() => openMenu()}
                />
              }>
              {currentTab === 'Invitations' && (
                <View>
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      dispatch(handleIsInvitationSearch(true));
                    }}
                    title="Search for inviti"
                    leadingIcon={'account-search'}
                  />
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      onOpen();
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
                </View>
              )}
              {currentTab === 'Tasks' && (
                <View>
                  <Menu.Item
                    onPress={() => {
                      console.log('Search for task');
                    }}
                    title="Search for task"
                    leadingIcon={'calendar-search'}
                  />
                </View>
              )}
              {currentTab === 'Chat' && (
                <View>
                  <Menu.Item
                    onPress={() => {
                      console.log('Task menu 1');
                    }}
                    title="Search for chat"
                    leadingIcon={'comment-search-outline'}
                  />
                </View>
              )}
            </Menu>
          </View>
        </Appbar>
      ) : (
        <View>
          <Searchbar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            cancelButtonTitle="cancel"
            autoFocus
            icon="arrow-left"
            onIconPress={BlurHandler}
            theme={{roundness: 0}}
            cancel={() => {
              console.log('hello');
            }}
          />
        </View>
      )}
    </>
  );
};

export default Header;
