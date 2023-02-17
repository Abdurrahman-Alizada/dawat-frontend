import {
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Header from '../../../../Components/ProfileScreenHeader';
import {
  Text,
  Avatar,
  List,
  IconButton,
  TextInput,
  ActivityIndicator,
  Button,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import {
  useGetCurrentLoginUserQuery,
  useUpdateNameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateImageURLMutation,
} from '../../../../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AvatarModal from './AvatarModal';

export default ProfileIndex = ({route}) => {
  const theme = useTheme();
  const {
    data: user,
    isError,
    error,
    isLoading,
  } = useGetCurrentLoginUserQuery(route.params?.id);

  const [editNam, setEditName] = useState(false);
  const [name, setName] = useState('');

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(false);

  const [editPassword, setEditPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [updateName, {isLoading: updateNameLoading}] = useUpdateNameMutation();
  const [updateEmail, {isLoading: updateEmailLoading}] =
    useUpdateEmailMutation();
  const [updatePassword, {isLoading: updatePasswordLoading}] =
    useUpdatePasswordMutation();
  const [updateImageURL, {isLoading: updateImageURLLoading}] =
    useUpdateImageURLMutation();

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
  const [modalVisible, setModalVisible] = useState(false);
  const [fileData, setfileData] = useState(null);
  const fileDataRef = useRef(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  let openGallery = () => {
    setModalVisible(!modalVisible);
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
    setModalVisible(false);
  };

  let openCamera = () => {
    setModalVisible(!modalVisible);

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
    setModalVisible(false);
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
              setSnakeBarMessage(
                'Something went wrong while updating profile image',
              );
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

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <Header />
        {user ? (
          <List.Section
            style={{
              marginVertical: '2%',
              paddingVertical: '2%',
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
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

            <View style={{padding: '5%'}}>
              <List.Subheader>Name </List.Subheader>

              <List.Item
                title={user?.name}
                left={props => <List.Icon {...props} icon="account-outline" />}
                right={() => (
                  <IconButton
                    icon="pencil"
                    mode="outlined"
                    size={20}
                    onPress={() => {
                      setEditEmail(false);
                      setEditName(true);
                    }}
                  />
                )}
              />

              <List.Subheader>Email</List.Subheader>

              <List.Item
                title={user?.email}
                left={props => <List.Icon {...props} icon="email-outline" />}
                right={() => (
                  <IconButton
                    icon="pencil"
                    mode="outlined"
                    size={20}
                    onPress={() => {
                      setEditName(false);
                      setEditEmail(true);
                    }}
                  />
                )}
              />
              <List.Subheader>Password</List.Subheader>

              <List.Item
                title="*******"
                left={props => (
                  <List.Icon {...props} icon="account-lock-outline" />
                )}
                right={() => (
                  <IconButton
                    icon="pencil"
                    mode="outlined"
                    size={20}
                    onPress={() => {
                      setEditName(false);
                      setEditEmail(false);
                      setEditPassword(true);
                    }}
                  />
                )}
              />
            </View>
          </List.Section>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <ActivityIndicator animating={isLoading} />
          </View>
        )}
      </View>

      {editNam && (
        <View style={{padding: '2%', backgroundColor: '#fff'}}>
          <TextInput
            label="Enter name"
            autoFocus={true}
            mode="outlined"
            value={name}
            onChangeText={text => setName(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              alignSelf: 'flex-end',
            }}>
            <Button icon="close" mode="text" onPress={() => setEditName(false)}>
              cancel
            </Button>
            <Button
              icon="check"
              mode="text"
              loading={updateNameLoading}
              onPress={() => editNameHandler()}>
              Ok
            </Button>
          </View>
        </View>
      )}

      {editEmail && (
        <View style={{padding: '2%', backgroundColor: '#fff'}}>
          <TextInput
            label="Enter email"
            autoFocus={true}
            mode="outlined"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              alignSelf: 'flex-end',
            }}>
            <Button
              icon="close"
              mode="text"
              onPress={() => setEditEmail(false)}>
              cancel
            </Button>
            <Button
              icon="check"
              mode="text"
              loading={updateEmailLoading}
              onPress={() => editEmailHandler()}>
              Ok
            </Button>
          </View>
        </View>
      )}

      {editPassword && (
        <View style={{padding: '2%', backgroundColor: '#fff'}}>
          <TextInput
            label="Enter old password"
            autoFocus={true}
            mode="outlined"
            value={oldPassword}
            onChangeText={text => setOldPassword(text)}
          />
          <TextInput
            label="Enter new password"
            style={{marginTop: '2%'}}
            mode="outlined"
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              alignSelf: 'flex-end',
            }}>
            <Button
              icon="close"
              mode="text"
              onPress={() => setEditPassword(false)}>
              cancel
            </Button>
            <Button
              icon="check"
              mode="text"
              loading={updatePasswordLoading}
              onPress={() => editPasswordHandler()}>
              Ok
            </Button>
          </View>
        </View>
      )}

      <Snackbar
        visible={showSnakeBar}
        onDismiss={() => setShowSnakeBar(false)}
        duration={4000}>
        {snakeBarMessage}
      </Snackbar>

      <Modal
        onBlur={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: theme.colors.backdrop,
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: '5%',
              position: 'absolute',
              width: '100%',
              backgroundColor:theme.colors.background
            }}>
            <IconButton
              style={{position: 'absolute', right: 5}}
              icon="close-circle-outline"
              // mode="outlined"
              size={30}
              onPress={() => setModalVisible(false)}
            />
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="camera-image"
                mode="outlined"
                size={40}
                onPress={openCamera}
              />
              <Text>Camera</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="image-outline"
                mode="outlined"
                size={40}
                onPress={openGallery}
              />
              <Text>Gallery</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="account-circle-outline"
                mode="outlined"
                size={40}
                onPress={() => {
                  setModalVisible(false);
                  setAvatarModalVisible(true);
                }}
              />
              <Text>Avatars</Text>
            </View>
          </View>
        </View>
      </Modal>

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
