import React, {useRef, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
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
import {useDeleteMultipleInvitiMutation} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';

const BOTTOM_APPBAR_HEIGHT = 70;

const DeleteMultipleInviti = ({navigation}) => {
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
        if(resp.data.deletedInvitis?.deletedCount){
           navigation.goBack();
        }
    });
  };

  const idsRef = useRef([]);
  const [ids, setIds] = useState([]);
  const [extraData, setExtradata] = useState(false);

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
  const [snackBarVisible, setSnackBarVisible] = useState(false)
  const [snackBarText, setSnackBarText] = useState('')

  // confirmation dialoge
  const [dialogeVisible, setDialogeVisible] = useState(false);

  const showDialog = () => setDialogeVisible(true);
  const hideDialog = () => setDialogeVisible(false);

  return (
    <View style={{flex: 1}}>
      <Appbar
        style={{
          backgroundColor: theme.colors.background,
        }}
        elevated>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          style={{maxWidth: '10%'}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '90%',
            paddingHorizontal: '5%',
            alignItems: 'center',
          }}>
          <Appbar.Content title={`${ids.length} selected`} />
          <Appbar.Action disabled={ids.length ? false : true} icon="delete" onPress={showDialog} />
        </View>
      </Appbar>

      <FlashList
        data={invitaionsForSearch}
        estimatedItemSize={100}
        extraData={extraData}
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
        {
          !isLoading ?
        <View style={{flexDirection:"row", justifyContent:"space-around", width:"100%"}}>
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
        :
        <View style={{width:"100%", justifyContent:"space-evenly", alignItems:"center", flexDirection:"row"}}>
          <Text>Deleting {ids.length} invitie(s)</Text>
          <ActivityIndicator animating  />
        </View>
        }
     
      </Appbar>

      <Portal>
          <Dialog visible={dialogeVisible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
            <Dialog.Title>Deleting {ids.length} invitie(s)</Dialog.Title>

            <Dialog.Content>
              <Text variant="bodyMedium">Are you sure to delete selected invities</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
              textColor={theme.colors.error}
              onPress={()=>{
                hideDialog()
                deleteMultipleInvitiHandler()
              }}>Yes, delete it</Button>

              <Button 
              textColor={theme.colors.secondary}
              onPress={()=>{
                hideDialog()
              }}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      <Snackbar
        visible={snackBarVisible}
        onDismiss={()=>setSnackBarVisible(false)}
        >
        {snackBarText}
      </Snackbar>

    </View>
  );
};

export default DeleteMultipleInviti;

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
