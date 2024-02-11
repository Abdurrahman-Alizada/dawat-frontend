import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
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
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useDeleteMultipleInvitiMutation,
  useUpdateStatusOfMultipleInvitiesMutation,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleInvitiFlag} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import { useTranslation } from 'react-i18next';

const BOTTOM_APPBAR_HEIGHT = 70;

const MultipleInvitiAction = ({navigation}) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const invitationsForSearch = useSelector(state => state.invitations.invitations);
  const currentViewingGroup = useSelector(state => state.groups.currentViewingGroup);
  const invitiFlag = useSelector(state => state.invitations.invitiFlag);

  const [deleteMultipleInviti, {isLoading, error, isError}] = useDeleteMultipleInvitiMutation();
  const deleteMultipleInvitiHandler = async () => {
    if (token) {
      deleteMultipleInviti({
        invities: ids,
        groupId: currentViewingGroup._id,
      }).then(resp => {
        if (resp.data.deletedInvitis?.deletedCount) {
          // navigation.goBack();
          deleteInvitiLocal();
        }
      });
    } else {
      deleteInvitiLocal();
    }
  };

  const deleteInvitiLocal = async () => {
    let guests = JSON.parse(await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`));
    guests = guests.filter(object => {
      return !ids.includes(object._id);
    });
    await AsyncStorage.setItem(`guests_${currentViewingGroup?._id}`, JSON.stringify(guests));
    dispatch(handleInvitiFlag(!invitiFlag));
    guests = null;
    navigation.goBack();
  };

  const [updateStatusOfMultipleInvities, {isLoading: multipleStatusUpdateLoading}] =
    useUpdateStatusOfMultipleInvitiesMutation();

  const [currentStatus, setcurrentStatus] = useState('');

  const updateStatusOfMultipleInvitiHandler = async lastStatus => {
    if (token) {
      setcurrentStatus(lastStatus);
      updateStatusOfMultipleInvities({
        invities: ids,
        lastStatus: lastStatus,
        groupId: currentViewingGroup._id,
      }).then(resp => {
        // console.log(resp);
        // navigation.goBack();
      updateInvitiLocal(lastStatus);

      });
    } else {
      updateInvitiLocal(lastStatus);
    }
  };

  const updateInvitiLocal = async lastStatus => {
    let guests = JSON.parse(await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`));
    let guestsToUpdate = guests.filter(object => {
      return ids.includes(object._id);
    });

    let updatedGuests = guestsToUpdate.map(obj => {
      return {...obj, lastStatus: {addedBy: {name: 'You'}, invitiStatus: lastStatus}};
    });

    let guestsNotToUpdate = guests.filter(object => {
      return !ids.includes(object._id);
    });

    guests = [...updatedGuests, ...guestsNotToUpdate];
    await AsyncStorage.setItem(`guests_${currentViewingGroup?._id}`, JSON.stringify(guests));
    dispatch(handleInvitiFlag(!invitiFlag));
    (guests = null), (guestsToUpdate = null), (guestsNotToUpdate = null);
    navigation.goBack();
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
              <Checkbox {...props} status={include ? 'checked' : 'unchecked'} onPress={add} />
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
            backgroundColor: include ? theme.colors.elevation.level1 : theme.colors.background,
          }}
          right={props => {
            if (item.lastStatus?.invitiStatus === 'invited')
              return <List.Icon {...props} icon="check" />;
            if (item.lastStatus?.invitiStatus === 'pending')
              return <List.Icon {...props} icon="clock-outline" />;
            else if (item.lastStatus?.invitiStatus === 'rejected')
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
  const [markAsInvitedDialogVisible, setMarkAsInvitedDialogVisible] = useState(false);
  const [markAsRejectedDialogVisible, setMarkAsRejectedDialogVisible] = useState(false);
  const [markAsPendingDialogVisible, setMarkAsPendingDialogVisible] = useState(false);

  const [token, setToken] = useState('');
  useEffect(() => {
    const getToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getToken();
  }, []);

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
        <Appbar.Content title={`${ids.length} ${t("selected")}`} />

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
        data={invitationsForSearch}
        estimatedItemSize={100}
        extraData={extraData || theme}
        ListEmptyComponent={() => (
          <View style={{marginTop: '50%', alignItems: 'center'}}>
            <Text>{t("No invitation to delete")}</Text>
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
              anchor={<IconButton icon="dots-vertical" size={25} onPress={() => openMenu()} />}>
              <Menu.Item
                leadingIcon="check"
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitationsForSearch.reduce(
                    (arr, item) => (
                      item.lastStatus?.invitiStatus == 'invited' && arr.push(item._id), arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title={t("Select all invited")}
              />
              <Menu.Item
                leadingIcon="clock-outline"
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitationsForSearch.reduce(
                    (arr, item) => (
                      item.lastStatus?.invitiStatus === 'pending' && arr.push(item._id), arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title={t("Select all pending")}
              />
              <Menu.Item
                leadingIcon="cancel"
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitationsForSearch.reduce(
                    (arr, item) => (
                      item.lastStatus?.invitiStatus == 'rejected' && arr.push(item._id), arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title={t("Select all rejected")}
              />
              <Divider />
              <Menu.Item
                leadingIcon={'tag-minus-outline'}
                onPress={() => {
                  closeMenu();
                  const invitedUsers = invitationsForSearch.reduce(
                    (arr, item) => (
                      (item.lastStatus?.invitiStatus == 'other' ||
                        item.lastStatus?.invitiStatus == '') &&
                        arr.push(item._id),
                      arr
                    ),
                    [],
                  );
                  idsRef.current = invitedUsers;
                  setIds(invitedUsers);
                  setExtradata(!extraData);
                }}
                title={t("Select all without tag")}
              />
            </Menu>
            <Appbar.Action
              icon="check-all"
              onPress={() => {
                const invitedUsers = invitationsForSearch.reduce(
                  (arr, item) => (item.lastStatus?.invitiStatus && arr.push(item._id), arr),
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
            {isLoading && <Text>{t("Deleting")} {ids.length} {t("guests(s)")}</Text>}
            {multipleStatusUpdateLoading && (
              <Text>
                {t("updating")} {ids.length} {t("invitie(s) status to")} '{t(currentStatus)}'
              </Text>
            )}
            <ActivityIndicator animating />
          </View>
        )}
      </Appbar>

      <Portal>
        {/* delete dialog */}
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>{t("Deleting")} {ids.length} {t("guests(s)")}</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">{t("Are you sure to delete selected guests")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setDeleteDialogVisible(false);
                deleteMultipleInvitiHandler();
              }}>
              {t("Yes, delete it")}
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setDeleteDialogVisible(false);
              }}>
              {t("Cancel")}
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* mark as invited dialog */}
        <Dialog
          visible={markAsInvitedDialogVisible}
          onDismiss={() => setMarkAsInvitedDialogVisible(false)}>
          <Dialog.Icon icon="check-all" />
          <Dialog.Title>{t("Mark")} {ids.length} {t("guests(s) as invited")}</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">{t("Are you sure to mark as invited selected guests")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.primary}
              onPress={() => {
                setMarkAsInvitedDialogVisible(false);
                updateStatusOfMultipleInvitiHandler('invited');
              }}>
              {t("Yes, mark as invited")}
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setMarkAsInvitedDialogVisible(false);
              }}>
              {t("Cancel")}
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* mark as pending dialog */}
        <Dialog
          visible={markAsPendingDialogVisible}
          onDismiss={() => setMarkAsPendingDialogVisible(false)}>
          <Dialog.Icon icon="clock-outline" />
          <Dialog.Title>{t("Mark")} {ids.length} {t("guests(s) as pending")}</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">{t("Are you sure to mark as pending selected guests")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.tertiary}
              onPress={() => {
                setMarkAsPendingDialogVisible(false);
                updateStatusOfMultipleInvitiHandler('pending');
              }}>
              {t("Yes, mark as pending")}
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setMarkAsPendingDialogVisible(false);
              }}>
              {t("Cancel")}
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* mark as rejected dialog */}
        <Dialog
          visible={markAsRejectedDialogVisible}
          onDismiss={() => setMarkAsRejectedDialogVisible(false)}>
          <Dialog.Icon icon="clock-outline" />
          <Dialog.Title>{t("Mark")} {ids.length} {t("guests(s) as rejected")}</Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium">{t("Are you sure to mark as rejected selected guests")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setMarkAsRejectedDialogVisible(false);
                updateStatusOfMultipleInvitiHandler('rejected');
              }}>
              {t("Yes, mark as rejected")}
            </Button>

            <Button
              textColor={theme.colors.secondary}
              onPress={() => {
                setMarkAsRejectedDialogVisible(false);
              }}>
              {t("Cancel")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Snackbar visible={snackBarVisible} onDismiss={() => setSnackBarVisible(false)}>
        {t(snackBarText)}
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
