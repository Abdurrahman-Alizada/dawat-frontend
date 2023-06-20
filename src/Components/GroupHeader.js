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
  handleIsInvitaionSummaryOpen,
} from '../redux/reducers/groups/invitations/invitationSlice';
import {handleIsSearch} from '../redux/reducers/groups/groups';
import {
  handleIsTaskSearch,
  handleTasksSearch,
  handleIsTaskSummaryOpen,
} from '../redux/reducers/groups/tasks/taskSlice';
import {isConfirmDialogVisibleHandler} from '../redux/reducers/groups/chat/chatSlice';

const Header = ({
  openGuestsImportExportModalize,
  openGuestsSummaryModalize,
  openTasksSummaryModalize,
  group,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();

  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const currentLoginUser = useSelector(
    state => state.user?.currentLoginUser,
  );

  const isMessagesSelected = useSelector(
    state => state.chat.isMessagesSelected,
  );

  const currentTab = useSelector(state => state.groups.currentTab);

  const getMembersOfGroup = () => {
    let membersText = currentViewingGroup.users?.map(user => {
      return user.name == currentLoginUser.name ? 'You' : ' '+ user.name  ;
    });
    return membersText.toString().length < 25
      ? membersText.toString()
      : `${membersText.toString().substring(0, 25)}...`;
  };

  //search
  const isSearch = useSelector(state => state.groups.isSearch);

  // invitationsopenTasksSummaryModalize
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
    dispatch(handleIsSearch(false));
    dispatch(handleIsInvitationSearch(false));
  };

  // tasks
  const isTasksSearch = useSelector(state => state.tasks.isTasksSearch);
  const updateSearchForTasks = search => {
    setSearch(search);
    dispatch(handleTasksSearch(search));
  };
  const BlurHandlerForTasks = () => {
    setSearch('');
    dispatch(handleIsSearch(false));
    dispatch(handleIsTaskSearch(false));
  };

  // end search

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
              {currentViewingGroup.imageURL ? (
                <Avatar.Image
                  size={40}
                  source={{
                    uri: currentViewingGroup.imageURL,
                  }}
                />
              ) : (
                <Avatar.Text
                  label={currentViewingGroup?.groupName?.charAt(0)}
                  size={40}
                />
              )}
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
              flexDirection: 'row',
              maxWidth: '25%',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            {currentTab === 'Chat' && isMessagesSelected ? (
              <Appbar.Action
                icon="delete-outline"
                color={theme.colors.onBackground}
                onPress={() => {
                  dispatch(isConfirmDialogVisibleHandler(true));
                }}
              />
            ) : (
              <View>
                {currentTab !== 'Logs' && currentTab !== 'Chat' && (
                  <Appbar.Action
                    icon="briefcase-outline"
                    color={theme.colors.onBackground}
                    onPress={() => {
                      if (currentTab === 'Guests') {
                        dispatch(handleIsInvitaionSummaryOpen(true));
                        openGuestsSummaryModalize()
                      } else if (currentTab === 'To-do') {
                        dispatch(handleIsTaskSummaryOpen(true));
                        openTasksSummaryModalize();
                      }
                    }}
                  />
                )}
              </View>
            )}

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
              {currentTab === 'Guests' && (
                <View>
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      dispatch(handleIsSearch(true));
                      dispatch(handleIsInvitationSearch(true));
                    }}
                    title="Search for inviti"
                    leadingIcon={'account-search'}
                  />
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
                </View>
              )}
              {currentTab === 'To-do' && (
                <View>
                  <Menu.Item
                    onPress={() => {
                      dispatch(handleIsSearch(true));
                      dispatch(handleIsTaskSearch(true));
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
          {isInvitaionSearch && (
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
          )}

          {isTasksSearch && (
            <Searchbar
              placeholder="Search for task..."
              onChangeText={updateSearchForTasks}
              value={search}
              cancelButtonTitle="cancel"
              autoFocus
              icon="arrow-left"
              onIconPress={BlurHandlerForTasks}
              theme={{roundness: 0}}
              cancel={() => {
                console.log('hello');
              }}
            />
          )}
        </View>
      )}
    </>
  );
};

export default Header;
