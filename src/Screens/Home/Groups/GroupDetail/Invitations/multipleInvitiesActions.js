import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Appbar,
  Avatar,
  useTheme,
  Snackbar,
  List,
  Text,
  Portal,
  Dialog,
  Button,
  Checkbox,
  Menu,
  ActivityIndicator,
  IconButton,
  Divider,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useDeleteMultipleInvitiMutation,
  useUpdateStatusOfMultipleInvitiesMutation,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';

const BOTTOM_APPBAR_HEIGHT = 70;

const MultipleInvitiAction = ({navigation}) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();

  const invitaionsForSearch = useSelector(
    state => state.invitations.invitations,
  );
  const currentViewingGroup = useSelector(
    state => state.groups.currentViewingGroup,
  );

  const [deleteMultipleInviti, {isLoading, error, isError}] =
    useDeleteMultipleInvitiMutation();
  const deleteMultipleInvitiHandler = async () => {
    deleteMultipleInviti({
      invities: ids,
      groupId: currentViewingGroup._id,
    }).then(resp => {
      if (resp.data.deletedInvitis?.deletedCount) {
        navigation.goBack();
      }
    });
  };

  const [
    updateStatusOfMultipleInvities,
    {isLoading: multipleStatusUpdateLoading},
  ] = useUpdateStatusOfMultipleInvitiesMutation();

  const [currentStatus, setcurrentStatus] = useState('');

  const updateStatusOfMultipleInvitiHandler = async lastStatus => {
    setcurrentStatus(lastStatus);
    updateStatusOfMultipleInvities({
      invities: ids,
      lastStatus: lastStatus,
      groupId: currentViewingGroup._id,
    }).then(resp => {
      console.log(resp);
      navigation.goBack();
    });
  };

  const idsRef = useRef([]);
  const [ids, setIds] = useState([]);
  const [extraData, setExtradata] = useState(false);

  // item to render for flashlist
  const Item = ({item}) => {
    const [include, setInclude] = useState(idsRef.current.includes(item?._id));
    const add = () => {
      if (include) {
        idsRef.current = idsRef.current.filter(userId => userId !== item?._id);
        setIds(idsRef.current);
      } else {
        idsRef.current = [...idsRef.current, item._id];
        setIds(idsRef.current);
      }
      setInclude(!include);
    };
    return (
      <View>
        <List.Item
          title={item.invitiName}
          onPress={add}
          // title={getHighlightedText(item.invitiName)}
          description={item.invitiDescription}
          left={props => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Checkbox
                {...props}
                status={include ? 'checked' : 'unchecked'}
                onPress={add}
              />
              <Avatar.Image
                size={45}
                avatarStyle={{borderRadius: 20}}
                source={
                  item.invitiImageURL
                    ? {uri: item.invitiImageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            </View>
          )}
          style={{
            paddingVertical: '1%',
            backgroundColor: include
              ? theme.colors.elevation.level1
              : theme.colors.background,
          }}
          right={props => {
            if (item.lastStatus.invitiStatus === 'invited')
              return <List.Icon {...props} icon="check" />;
            if (item.lastStatus.invitiStatus === 'pending')
              return <List.Icon {...props} icon="clock-outline" />;
            else if (item.lastStatus.invitiStatus === 'rejected')
              return <List.Icon {...props} icon="cancel" />;
          }}
        />
      </View>
    );
  };

  // bottom appbar menu
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // snackbar
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState('');

  // dialoges
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [markAsInvitedDialogVisible, setMarkAsInvitedDialogVisible] =
    useState(false);
  const [markAsRejectedDialogVisible, setMarkAsRejectedDialogVisible] =
    useState(false);
  const [markAsPendingDialogVisible, setMarkAsPendingDialogVisible] =
    useState(false);

  return (
    <View style={{flex: 1}}>
      <Appbar
        style={{
          backgroundColor: theme.colors.background,
          marginBottom: 2,
        }}
        elevated
        mode="medium">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${ids.length} items selected`} />

        <Appbar.Action
          disabled={ids.length ? false : true}
          isLeading
          icon="check"
          style={{marginHorizontal: '3%'}}
          onPress={() => setMarkAsInvitedDialogVisible(true)}
        />
        <Appbar.Action
          disabled={ids.length ? false : true}
          isLeading
          icon="clock-outline"
          style={{marginHorizontal: '3%'}}
          onPress={() => setMarkAsPendingDialogVisible(true)}
        />
        <Appbar.Action
          disabled={ids.length ? false : true}
          isLeading
          icon="cancel"
          style={{marginHorizontal: '3%'}}
          onPress={() => setMarkAsRejectedDialogVisible(true)}
        />
        <Appbar.Action
          disabled={ids.length ? false : true}
          icon="delete"
          iconColor={theme.colors.error}
          style={{marginHorizontal: '3%'}}
          onPress={() => setDeleteDialogVisible(true)}
        />
      </Appbar>

      <FlashList
        data={invitaionsForSearch}
        estimatedItemSize={100}
        extraData={extraData || theme}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={{marginTop: '50%', alignItems: 'center'}}>
            <Text>No invitation to delete</Text>
          </View>
        )}
        renderItem={({item}) => <Item item={item} />}
      />

      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}
        elevated
        safeAreaInsets={{bottom}}>
        {isLoading && (
          <View
            style={{
              width: '100%',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text>Deleting {ids.length} invitie(s)</Text>
            <ActivityIndicator animating />
          </View>
        )}

        {!isLoading && !multipleStatusUpdateLoading ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
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
              <Menu.Item
                leadingIcon="check"
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitaionsForSearch.reduce(
                    (arr, item) => (
                      item.lastStatus.invitiStatus == 'invited' &&
                        arr.push(item._id),
                      arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title="Select all invited"
              />
              <Menu.Item
                leadingIcon="clock-outline"
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitaionsForSearch.reduce(
                    (arr, item) => (
                      item.lastStatus.invitiStatus === 'pending' &&
                        arr.push(item._id),
                      arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title="Select all pending"
              />
              <Menu.Item
                leadingIcon="cancel"
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitaionsForSearch.reduce(
                    (arr, item) => (
                      item.lastStatus.invitiStatus == 'rejected' &&
                        arr.push(item._id),
                      arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title="Select all rejected"
              />
              <Divider />
              <Menu.Item
                leadingIcon={'tag-minus-outline'}
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitaionsForSearch.reduce(
                    (arr, item) => (
                      (item.lastStatus.invitiStatus == 'other' ||
                        item.lastStatus.invitiStatus == '') &&
                        arr.push(item._id),
                      arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title="Select all without tag"
              />
            </Menu>
            <Appbar.Action
              icon="check-all"
              onPress={() => {
                const invitedUsers = invitaionsForSearch.reduce(
                  (arr, item) => (
                    item.lastStatus.invitiStatus && arr.push(item._id), arr
                  ),
                  [],
                );
                idsRef.current = invitedUsers;
                setIds(invitedUsers);
                setExtradata(!extraData);
              }}
            />
            <Appbar.Action
              icon="filter-remove-outline"
              onPress={() => {
                idsRef.current = [];
                setIds([]);
                setExtradata(!extraData);
              }}
            />
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {isLoading && <Text>Deleting {ids.length} invitie(s)</Text>} 
            {multipleStatusUpdateLoading && <Text>updating {ids.length} invitie(s) status to {currentStatus}</Text>}
            <ActivityIndicator animating />
          </View>
        )}
      </Appbar>

      <Portal>
        {/* delete dialog */}
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Deleting {ids.length} invitie(s)</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure to delete selected invities
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setDeleteDialogVisible(false);
                deleteMultipleInvitiHandler();
              }}>
              Yes, delete it
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setDeleteDialogVisible(false);
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* mark as invited dialog */}
        <Dialog
          visible={markAsInvitedDialogVisible}
          onDismiss={() => setMarkAsInvitedDialogVisible(false)}>
          <Dialog.Icon icon="check-all" />
          <Dialog.Title>Mark {ids.length} invitie(s) as invited</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure to mark as invited selected invities
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.primary}
              onPress={() => {
                setMarkAsInvitedDialogVisible(false);
                updateStatusOfMultipleInvitiHandler('invited');
              }}>
              Yes, mark as invited
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setMarkAsInvitedDialogVisible(false);
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* mark as pending dialog */}
        <Dialog
          visible={markAsPendingDialogVisible}
          onDismiss={() => setMarkAsPendingDialogVisible(false)}>
          <Dialog.Icon icon="clock-outline" />
          <Dialog.Title>Mark {ids.length} invitie(s) as pending</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure to mark as pending selected invities
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.tertiary}
              onPress={() => {
                setMarkAsPendingDialogVisible(false);
                updateStatusOfMultipleInvitiHandler('pending');
              }}>
              Yes, mark as pending
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setMarkAsPendingDialogVisible(false);
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* mark as rejected dialog */}
        <Dialog
          visible={markAsRejectedDialogVisible}
          onDismiss={() => setMarkAsRejectedDialogVisible(false)}>
          <Dialog.Icon icon="clock-outline" />
          <Dialog.Title>Mark {ids.length} invitie(s) as rejected</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure to mark as rejected selected invities
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setMarkAsRejectedDialogVisible(false);
                updateStatusOfMultipleInvitiHandler('rejected');
              }}>
              Yes, mark as rejected
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setMarkAsRejectedDialogVisible(false);
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}>
        {snackBarText}
      </Snackbar>
    </View>
  );
};

export default MultipleInvitiAction;

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});
