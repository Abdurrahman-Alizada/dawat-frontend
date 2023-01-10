import {Text, View, SafeAreaView, StyleSheet, Modal} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../../Components/ProfileScreenHeader';
import {
  Avatar,
  List,
  IconButton,
  TextInput,
  ActivityIndicator,
  Button,
  Snackbar,
} from 'react-native-paper';
import {
  useGetCurrentLoginUserQuery,
  useUpdateNameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateImageURLMutation
} from '../../../../redux/reducers/user/userThunk';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AvatarModal from './AvatarModal';

export default ProfileIndex = ({route}) => {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [fileData, setfileData] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  let openGallery = () => {
    setModalVisible(!modalVisible);
    ImagePicker.openPicker({
      cropperCircleOverlay: true,
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setfileData(image);
    });
    setModalVisible(false);
  };

  const imageUploadHandler =async ()=>{
    console.log("helo", avatarURL)
    const id = await AsyncStorage.getItem('id');
    if(avatarURL){
      updateImageURL({id: id, imageURL:avatarURL}).then(async (res) => {
        console.log(res)
        setAvatarURL(res.imageURL)
        await AsyncStorage.setItem("imageURL", res.imageURL)
        setSnakeBarMessage('Profile image has been updated successfully');
        setShowSnakeBar(true);
      }).catch((err)=>{
        setSnakeBarMessage('Something went wrong while uploading image');
      })
    }

  }

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
            <View>
              {fileData ? (
                <Avatar.Image
                  source={{uri: fileData.path}}
                  style={{alignSelf: 'center'}}
                  size={130}
                />
              ) : (
                <View>
                  {avatarURL === '' && !user?.imageURL  ? (
                    <Avatar.Icon
                      icon="account-circle-outline"
                      style={{alignSelf: 'center'}}
                      size={130}
                    />
                  ) : (
                    <View>
                      {
                        user?.imageURL ? 
                        <Avatar.Image
                          source={{uri: user?.imageURL}}
                          style={{alignSelf: 'center'}}
                          size={130}
                        />
                        : 
                        <Avatar.Image
                          source={{uri: avatarURL}}
                          style={{alignSelf: 'center'}}
                          size={130}
                        />
                      }
                    </View>
                  )}
                </View>
              )}
              {
                updateImageURLLoading ?
                <></>
                :
                <IconButton
                  style={{position: 'absolute', left: '55%', top: 75}}
                  icon="camera"
                  mode="contained"
                  size={28}
                  onPress={() => setModalVisible(true)}
                />
              }
            </View>

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
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, {position: 'absolute', width: '100%'}]}>
            <IconButton
              style={{position: 'absolute', right: 5}}
              icon="close-circle-outline"
              // mode="outlined"
              size={30}
              onPress={() => setModalVisible(false)}
            />
            {/* <View style={{alignItems: 'center'}}>
              <IconButton
                style={{marginHorizontal: '2%'}}
                icon="camera-image"
                mode="outlined"
                size={40}
                onPress={openCamera}
              />
              <Text>Camera</Text>
            </View> */}
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
          imageUploadHandler={imageUploadHandler}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#D70F64',
    color: '#FFFFFF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: '2%',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 5,
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
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

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: '5%',
    // justifyContent: 'center',
  },
});
