import {View, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Dialog,
  Text,
  IconButton,
  List,
  Snackbar,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {
  useGetCurrentLoginUserQuery,
  useUpdateNameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateImageURLMutation,
  useDeleteUserByItselfMutation,
} from '../../../redux/reducers/user/userThunk';
import {handleCurrentLoaginUser} from '../../../redux/reducers/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AvatarModal from './AvatarModal';
import {Modalize} from 'react-native-modalize';
import {useDispatch} from 'react-redux';
import {DrawerActions} from '@react-navigation/native';
import {groupApi} from '../../../redux/reducers/groups/groupThunk';
import {useTranslation} from 'react-i18next';

export default ProfileIndex = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const modalizeRef = useRef(null);
  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };

  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };

  const {data: user, isError, error, isLoading} = useGetCurrentLoginUserQuery(route.params?.id);

  const [editNam, setEditName] = useState(false);
  const [name, setName] = useState(user?.name);

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(user?.email);

  const [editPassword, setEditPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [updateName, {isLoading: updateNameLoading}] = useUpdateNameMutation();
  const [updateEmail, {isLoading: updateEmailLoading}] = useUpdateEmailMutation();
  const [updatePassword, {isLoading: updatePasswordLoading}] = useUpdatePasswordMutation();
  const [updateImageURL, {isLoading: updateImageURLLoading}] = useUpdateImageURLMutation();

  const [snakeBarMessage, setSnakeBarMessage] = useState('');
  const [showSnakeBar, setShowSnakeBar] = useState(false);

  const editNameHandler = async () => {
    const id = await AsyncStorage.getItem('id');
    updateName({id: id, name: name}).then(() => {
      setEditName(false);
      setSnakeBarMessage('Name has been updated successfully');
      setShowSnakeBar(true);
    });
  };
  const editEmailHandler = async () => {
    const id = await AsyncStorage.getItem('id');
    updateEmail({id: id, email: email}).then(() => {
      setEditEmail(false);
      setSnakeBarMessage('Email has been updated successfully');
      setShowSnakeBar(true);
    });
  };
  const editPasswordHandler = async () => {
    const id = await AsyncStorage.getItem('id');
    updatePassword({
      id: id,
      oldPassword: oldPassword,
      newPassword: newPassword,
    }).then(result => {
      // console.log("updated user is: ", result)
      setEditPassword(false);
      setNewPassword('');
      setOldPassword('');
      setSnakeBarMessage('Password has been updated successfully');
      setShowSnakeBar(true);
    });
  };

  // image uploading - start
  const [fileData, setfileData] = useState(null);
  const fileDataRef = useRef(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  let openGallery = () => {
    onCloseModalize();
    ImagePicker.openPicker({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setAvatarURL('');
        fileDataRef.current = image;
        setfileData(image);
        imageUploadHandler();
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
    onCloseModalize();
  };

  let openCamera = () => {
    onCloseModalize();
    ImagePicker.openCamera({
      // cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log('image', image);
        setAvatarURL('');
        fileDataRef.current = image;
        setfileData(image);
        imageUploadHandler();
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
    onCloseModalize();
  };
  const imageUploadHandler = async () => {
    const id = await AsyncStorage.getItem('id');

    if (fileDataRef.current) {
      const uri = fileDataRef.current?.path;
      const type = fileDataRef.current?.mime;
      const name = user?.name ? user?.name : 'user-profile';
      const photo = {uri, type, name};
      const data = new FormData();
      data.append('file', photo);
      data.append('upload_preset', 'bzgif1or');
      data.append('cloud_name', 'dblhm3cbq');
      console.log('helllo image=>', data._parts);
      fetch('https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload', {
        method: 'post',
        body: data,
      })
        .then(res => res.json())
        .then(async data => {
          updateImageURL({id: id, imageURL: data.secure_url})
            .then(async res => {
              setSnakeBarMessage('Profile image has been updated successfully');
              setShowSnakeBar(true);
              fileDataRef.current = null;
              setfileData(null);
              return;
            })
            .catch(err => {
              setSnakeBarMessage('Something went wrong while updating profile image');
              fileDataRef.current = null;
              setfileData(null);
              return;
            });
        })
        .catch(err => {
          console.log('An Error Occured While Uploading profile image', err);
          fileDataRef.current = null;
          setfileData(null);
          return;
        });
    }

    if (avatarURL) {
      updateImageURL({id: id, imageURL: avatarURL})
        .then(async res => {
          setSnakeBarMessage('Profile image has been updated successfully');
          setShowSnakeBar(true);
        })
        .catch(err => {
          setSnakeBarMessage('Something went wrong while uploading image');
        });
    }
  };
  // image uploading - end

  // delete dialog for deleting user by itself
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [deleleUserByItSelf, {isLoading: deleteLoading, isSuccess: isDeleteUserSuccess}] =
    useDeleteUserByItselfMutation();
  const deleteUserAccountHandler = async () => {
    deleleUserByItSelf(user._id)
      .then(res => {
        AsyncStorage.clear();
        dispatch(handleCurrentLoaginUser({}));
        setDeleteDialogVisible(false);
        navigation.navigate('Auth', {screen: 'Login'});
      })
      .catch(e => {
        console.log(e);
      });
  };

  const logout = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('isAppFirstLaunched1', '1');
    dispatch(handleCurrentLoaginUser({}));
    dispatch(groupApi.util.resetApiState());
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        {isLoading ? (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator animating={true} />
            <Text variant="bodyLarge" style={{marginTop: '3%'}}>
              {t('Loading....')}
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            {user ? (
              <List.Section
                style={{
                  marginVertical: '2%',
                  justifyContent: 'space-between',
                  flex: 1,
                  paddingVertical: '2%',
                }}>
                <View style={{padding: '5%'}}>
                  <TouchableOpacity
                    onPress={onOpenModalize}
                    style={{width: 130, alignSelf: 'center'}}>
                    {fileDataRef.current ? (
                      <Avatar.Image
                        source={{uri: fileDataRef.current?.path}}
                        style={{alignSelf: 'center'}}
                        size={130}
                      />
                    ) : (
                      <View>
                        {avatarURL === '' && !user?.imageURL ? (
                          <Avatar.Icon
                            icon="account-circle-outline"
                            style={{alignSelf: 'center'}}
                            size={130}
                          />
                        ) : (
                          <View>
                            {user?.imageURL ? (
                              <Avatar.Image
                                source={{uri: user?.imageURL}}
                                style={{alignSelf: 'center'}}
                                size={130}
                              />
                            ) : (
                              <Avatar.Image
                                source={{uri: avatarURL}}
                                style={{alignSelf: 'center'}}
                                size={130}
                              />
                            )}
                          </View>
                        )}
                      </View>
                    )}
                    {updateImageURLLoading && (
                      <ActivityIndicator
                        style={{position: 'absolute', left: '55%', top: 75}}
                        size="large"
                        animating={updateImageURLLoading}
                      />
                    )}
                  </TouchableOpacity>

                  <TextInput
                    label={t('Name')}
                    style={{
                      textAlignVertical: 'top',
                      marginTop: '2%',
                      backgroundColor: theme.colors.background,
                    }}
                    underlineColor={theme.colors.background}
                    activeOutlineColor={theme.colors.onBackground}
                    // autoFocus={true}
                    // mode="outlined"
                    value={user?.name}
                    editable={false}
                    right={
                      <TextInput.Icon
                        icon={'pencil'}
                        onPress={() => {
                          setEditEmail(false);
                          setEditName(true);
                        }}
                      />
                    }
                  />

                  <TextInput
                    label={t('Email')}
                    style={{
                      textAlignVertical: 'top',
                      marginTop: '5%',
                      backgroundColor: theme.colors.background,
                    }}
                    underlineColor={theme.colors.background}
                    activeOutlineColor={theme.colors.onBackground}
                    value={user?.email}
                    editable={false}
                    right={
                      <TextInput.Icon
                        icon={'pencil'}
                        onPress={() => {
                          setEditName(false);
                          setEditEmail(true);
                        }}
                      />
                    }
                  />

                  <TextInput
                    label={t('Password')}
                    style={{
                      textAlignVertical: 'top',
                      marginTop: '5%',
                      backgroundColor: theme.colors.background,
                    }}
                    underlineColor={theme.colors.background}
                    activeOutlineColor={theme.colors.onBackground}
                    value={'*******'}
                    editable={false}
                    right={
                      <TextInput.Icon
                        icon={'pencil'}
                        onPress={() => {
                          setEditName(false);
                          setEditEmail(false);
                          setEditPassword(true);
                        }}
                      />
                    }
                  />
                </View>
                <View>
                  <Button
                    contentStyle={{padding: '2%'}}
                    theme={{roundness: 20}}
                    textColor={theme.colors.error}
                    mode="outlined"
                    style={{marginHorizontal: '9%'}}
                    onPress={logout}>
                    {t('Logout')}
                  </Button>
                  <Button
                    contentStyle={{padding: '2%'}}
                    theme={{roundness: 20}}
                    // mode="outlined"
                    buttonColor={theme.colors.error}
                    style={{marginHorizontal: '9%', marginVertical: '5%'}}
                    textColor={theme.colors.onError}
                    onPress={() => setDeleteDialogVisible(true)}>
                    {t('Delete my account')}
                  </Button>
                </View>
              </List.Section>
            ) : (
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text variant="bodyLarge" style={{marginTop: '3%'}}>
                  {t('No user data')}{' '}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {editNam && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            label={t('Enter name')}
            style={{
              textAlignVertical: 'top',
              marginTop: '2%',
              backgroundColor: theme.colors.background,
            }}
            underlineColor={theme.colors.background}
            activeOutlineColor={theme.colors.onBackground}
            autoFocus={true}
            mode="outlined"
            value={name}
            onChangeText={text => setName(text)}
          />

          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '49%', marginRight: '1%'}}
              icon="close"
              mode="outlined"
              theme={{roundness: 1}}
              onPress={() => {
                setName(user?.name);
                setEditName(false);
              }}>
              {t('Cancel')}
            </Button>
            <Button
              style={{
                width: '49%',
                marginLeft: '1%',
                color: theme.colors.onBackground,
              }}
              icon="check"
              mode="contained"
              loading={updateNameLoading}
              onPress={() => editNameHandler()}
              theme={{roundness: 1}}
              disabled={updateNameLoading || name.length < 1}>
              {t('Ok')}
            </Button>
          </View>
        </View>
      )}

      {editEmail && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            label={t('Enter email')}
            autoFocus={true}
            mode="outlined"
            value={email}
            style={{
              textAlignVertical: 'top',
              marginTop: '2%',
              backgroundColor: theme.colors.background,
            }}
            underlineColor={theme.colors.background}
            activeOutlineColor={theme.colors.onBackground}
            onChangeText={text => setEmail(text)}
          />

          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '49%', marginRight: '1%'}}
              icon="close"
              mode="outlined"
              theme={{roundness: 1}}
              onPress={() => {
                setEmail(user?.email);
                setEditEmail(false);
              }}>
              {t('Cancel')}
            </Button>
            <Button
              style={{
                width: '49%',
                marginLeft: '1%',
                color: theme.colors.onBackground,
              }}
              icon="check"
              mode="contained"
              loading={updateEmailLoading}
              onPress={() => editEmailHandler()}
              theme={{roundness: 1}}
              disabled={updateEmailLoading || email.length < 1}>
              {t('Ok')}
            </Button>
          </View>
        </View>
      )}

      {editPassword && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            label="Enter old password"
            autoFocus={true}
            mode="outlined"
            value={oldPassword}
            onChangeText={text => setOldPassword(text)}
            style={{
              textAlignVertical: 'top',
              marginTop: '2%',
              backgroundColor: theme.colors.background,
            }}
            underlineColor={theme.colors.background}
            activeOutlineColor={theme.colors.onBackground}
          />
          <TextInput
            label={t('Enter new password')}
            mode="outlined"
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            style={{
              textAlignVertical: 'top',
              marginTop: '2%',
              backgroundColor: theme.colors.background,
            }}
            underlineColor={theme.colors.background}
            activeOutlineColor={theme.colors.onBackground}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '49%', marginRight: '1%'}}
              icon="close"
              mode="outlined"
              theme={{roundness: 1}}
              onPress={() => {
                setEditPassword(false);
              }}>
              {t('Cancel')}
            </Button>
            <Button
              style={{
                width: '49%',
                marginLeft: '1%',
                color: theme.colors.onBackground,
              }}
              icon="check"
              mode="contained"
              loading={updatePasswordLoading}
              onPress={() => editPasswordHandler()}
              theme={{roundness: 1}}
              disabled={
                updatePasswordLoading || newPassword.length < 1 || newPassword === oldPassword
              }>
              {t('Ok')}
            </Button>
          </View>
        </View>
      )}

      <Snackbar visible={showSnakeBar} onDismiss={() => setShowSnakeBar(false)} duration={4000}>
        {snakeBarMessage}
      </Snackbar>

      {avatarModalVisible && (
        <AvatarModal
          avatarModalVisible={avatarModalVisible}
          setAvatarModalVisible={setAvatarModalVisible}
          setAvatarURL={setAvatarURL}
          setfileData={setfileData}
          fileDataRef={fileDataRef}
          imageUploadHandler={imageUploadHandler}
        />
      )}

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>{t('Are you sure?')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t(
                'If you delete your account, your account with all asssociated data will be delete.',
              )}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>{t('Cancel')}</Button>
            <Button
              loading={deleteLoading}
              textColor={theme.colors.error}
              onPress={deleteUserAccountHandler}>
              {t('Ok, I understand')}
            </Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
        <Modalize
          modalStyle={{backgroundColor: theme.colors.background}}
          ref={modalizeRef}
          adjustToContentHeight={true}
          handlePosition="inside">
          <View
            style={{
              paddingVertical: '8%',
              paddingHorizontal: '5%',
              flexDirection: 'row',
              backgroundColor: theme.colors.background,
            }}>
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="camera-image"
                mode="outlined"
                size={40}
                onPress={openCamera}
              />
              <Text>{t('Camera')}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="image-outline"
                mode="outlined"
                size={40}
                onPress={openGallery}
              />
              <Text>{t('Gallery')}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="account-circle-outline"
                mode="outlined"
                size={40}
                onPress={() => {
                  onCloseModalize();
                  setAvatarModalVisible(true);
                }}
              />
              <Text>{t('Avatars')}</Text>
            </View>
          </View>
        </Modalize>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  images: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginHorizontal: 30,
  },
  error: {
    color: 'red',
    marginLeft: 20,
  },
});
