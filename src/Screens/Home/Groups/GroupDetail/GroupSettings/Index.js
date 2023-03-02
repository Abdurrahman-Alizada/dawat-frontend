import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  Avatar,
  TextInput,
  Button,
  List,
  ActivityIndicator,
  Divider,
  Text,
  IconButton,
  Snackbar,
  Checkbox,
  Searchbar,
  useTheme,
} from 'react-native-paper';
import {
  useUpdateGroupInfoMutation,
  useDeleteGroupForUserMutation,
} from '../../../../../redux/reducers/groups/groupThunk';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AvatarModal from '../../../Menus/Profile/AvatarModal';
import {useDispatch, useSelector} from 'react-redux';
import {handleCurrentViewingGroup} from '../../../../../redux/reducers/groups/groups';
import {Modalize} from 'react-native-modalize';
// imports end

const Index = ({route, navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );
  // component state - start
  const {users, groupName, _id, groupDescription} = currentViewingGroup;
  const [name, setName] = useState(groupName);
  const [description, setDescription] = useState(groupDescription);
  const [userId, setUserId] = useState('');

  // image uploading state
  const [modalVisible, setModalVisible] = useState(false);
  const fileDataRef = useRef(null);
  // const [avatarURL, setAvatarURL] = useState( route?.params?.group?.group.imageURL,);
  const [avatarURL, setAvatarURL] = useState(currentViewingGroup.imageURL);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // snakebar
  const [snakeBarMessage, setSnakeBarMessage] = useState('');
  const [showSnakeBar, setShowSnakeBar] = useState(false);

  // edit data
  const [editGroupName, seteditGroupName] = useState(false);
  const [editGroupDescription, setEditGroupDescription] = useState(false);

  // add member to group
  const modalizeRef = useRef(null);

  // show more for description
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  // redux toolkit - start
  const [updateGroupInfo, {isLoading}] = useUpdateGroupInfoMutation();
  const [deleteGroupForUser, {isLoading: deleteLoading}] =
    useDeleteGroupForUserMutation();
  // redux toolkit - end

  // functions - start
  const handleSubmit = () => {
    updateGroupInfo({
      groupId: _id,
      groupName: name,
      groupDescription: description,
      imageURL: avatarURL,
    })
      .then(res => {
        dispatch(handleCurrentViewingGroup(res.data));
        setSnakeBarMessage('Group information has been updated');
        setShowSnakeBar(true);
        seteditGroupName(false);
        setEditGroupDescription(false);
      })
      .catch(e => {
        setSnakeBarMessage('Something went wrong. Please try again');
        setShowSnakeBar(true);
      });
  };

  const handleLeave = async () => {
    setSnakeBarMessage('Leaving group');
    setShowSnakeBar(true);
    deleteGroupForUser({
      chatId: _id,
      userId: await AsyncStorage.getItem('userId'),
    })
      .then(res => {
        setShowSnakeBar(false);
        navigation.replace('Drawer');
      })
      .catch(e => {
        console.log('error in handleLeave', e);
      });
  };

  const handleRemoveUserFromGroup = async userId => {
    setSnakeBarMessage('Removing user from group');
    setShowSnakeBar(true);
    deleteGroupForUser({
      chatId: _id,
      userId: userId,
    })
      .then(res => {
        dispatch(handleCurrentViewingGroup(res.data));
        setShowSnakeBar(false);
      })
      .catch(e => {
        console.log('error in handleLeave', e);
      });
  };

  const onTextLayout = useCallback(
    e => {
      setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    },
    [textShown],
  );

  // image upload functions
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
        imageUploadHandler();
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
    onCloseModalize();
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
        setAvatarURL('');
        fileDataRef.current = image;
        imageUploadHandler();
      })
      .catch(e => {
        console.log('Error in image selection', e);
      });
    onCloseModalize();
  };

  const imageUploadHandler = async () => {
    if (fileDataRef.current) {
      const uri = fileDataRef.current?.path;
      const type = fileDataRef.current?.mime;
      const name = 'user-profile';
      const photo = {uri, type, name};
      const data = new FormData();
      data.append('file', photo);
      data.append('upload_preset', 'bzgif1or');
      data.append('cloud_name', 'dblhm3cbq');
      fetch('https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload', {
        method: 'post',
        body: data,
      })
        .then(res => res.json())
        .then(async data => {
          updateGroupInfo({
            groupId: _id,
            groupName: name,
            groupDescription: groupDescription,
            imageURL: avatarURL,
          })
            .then(res => {
              dispatch(handleCurrentViewingGroup(res.data));
              setSnakeBarMessage('Group information has been updated');
              setShowSnakeBar(true);
              seteditGroupName(false);
              setEditGroupDescription(false);
            })
            .catch(e => {
              setSnakeBarMessage('Something went wrong. Please try again');
              setShowSnakeBar(true);
            });
        })
        .catch(err => {
          console.log('An Error Occured While Uploading profile image', err);
          fileDataRef.current = null;
          return;
        });
    }

    if (avatarURL) {
      updateGroupInfo({
        groupId: _id,
        groupName: name,
        groupDescription: groupDescription,
        imageURL: avatarURL,
      })
        .then(res => {
          dispatch(handleCurrentViewingGroup(res.data));
          setSnakeBarMessage('Group information has been updated');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
        })
        .catch(e => {
          setSnakeBarMessage('Something went wrong. Please try again');
          setShowSnakeBar(true);
        });
    }
  };

  const getCurrentUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  useEffect(() => {
    getCurrentUserId();
  }, []);

  // functions - end

  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };

  const onCloseModalize = () => {
    modalizeRef.current?.close();
  };

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <ScrollView>
          <List.Section
            style={{padding: '2%', backgroundColor: theme.colors.background}}>
            <TouchableOpacity
              onPress={() => {
                seteditGroupName(false);
                setEditGroupDescription(false);
                onOpenModalize();
              }}
              style={{marginVertical: '4%'}}>
              {fileDataRef.current ? (
                <Avatar.Image
                  source={{uri: fileDataRef.current?.path}}
                  style={{alignSelf: 'center'}}
                  size={130}
                />
              ) : (
                <View>
                  {avatarURL === '' ? (
                    <Avatar.Icon
                      icon="account-circle-outline"
                      style={{alignSelf: 'center'}}
                      size={130}
                    />
                  ) : (
                    <View>
                      {avatarURL ? (
                        <Avatar.Image
                          source={{uri: avatarURL}}
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

              <ActivityIndicator
                style={{position: 'absolute', left: '55%', top: 75}}
                size="large"
                animating={isLoading}
              />
            </TouchableOpacity>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <List.Subheader>Name</List.Subheader>
                <IconButton
                  disabled={isLoading}
                  icon="pencil"
                  mode="outlined"
                  size={20}
                  onPress={() => {
                    setEditGroupDescription(false);
                    seteditGroupName(true);
                  }}
                />
              </View>
              <List.Item title={name} />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <List.Subheader>Description</List.Subheader>
                <IconButton
                  disabled={isLoading}
                  icon="pencil"
                  mode="outlined"
                  size={20}
                  onPress={() => {
                    seteditGroupName(false);
                    setEditGroupDescription(true);
                  }}
                />
              </View>
              <List.Item
                title={() => (
                  <View style={{}}>
                    <Text
                      onTextLayout={onTextLayout}
                      numberOfLines={textShown ? undefined : 2}
                      style={{}}>
                      {description}
                    </Text>

                    {lengthMore ? (
                      <TouchableOpacity onPress={() => toggleNumberOfLines()}>
                        <Text
                          style={{
                            fontFamily: 'DM Sans',
                            fontWeight: 'bold',
                          }}>
                          {textShown ? 'Read less...' : 'Read more...'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>
                )}
              />
            </View>
          </List.Section>

          <List.Section
            style={{padding: '2%', backgroundColor: theme.colors.background}}>
            <List.Subheader>Group members</List.Subheader>
            <List.Item
              onPress={() => {
                navigation.navigate('updateGroupMembers');
              }}
              title="Add Member"
              left={() => <Avatar.Icon size={50} icon="account-plus-outline" />}
            />
            <Divider />
            {users.map((member, index) => (
              <List.Item
                key={index}
                title={member.name}
                description={member.email}
                right={props => (
                  <IconButton
                    {...props}
                    disabled={
                      member._id === userId || deleteLoading ? true : false
                    }
                    icon="delete"
                    size={20}
                    onPress={() => handleRemoveUserFromGroup(member._id)}
                    mode="contained-tonal"
                  />
                )}
                left={() => (
                  <Avatar.Image
                    source={{
                      uri: member.imageURL
                        ? member.imageURL
                        : 'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
                    }}
                    size={50}
                  />
                )}
              />
            ))}
          </List.Section>

          <List.Section
            style={{
              padding: '2%',
              backgroundColor: theme.colors.secondaryContainer,
            }}>
            <List.Item
              onPress={handleLeave}
              title="Leave group"
              left={() => (
                <List.Icon color={theme.colors.error} icon="logout" />
              )}
              titleStyle={{color: theme.colors.error}}
            />
            {/* <Divider />
            <List.Item
              title="Report"
              onPress={() => console.log('report pressed')}
              left={() => <List.Icon icon="thumb-down-outline" />}
            /> */}
          </List.Section>
        </ScrollView>
      </View>

      <Snackbar
        visible={showSnakeBar}
        icon={
          deleteLoading
            ? () => <ActivityIndicator animating={true} size="small" />
            : 'check'
        }
        onIconPress={() => console.log('hello')}
        onDismiss={() => setShowSnakeBar(false)}
        duration={4000}>
        {snakeBarMessage}
      </Snackbar>

      {editGroupName && (
        <View
          style={{padding: '2%', backgroundColor: theme.colors.surfaceVariant}}>
          <TextInput
            autoFocus={true}
            label="Group name"
            mode="outlined"
            value={name}
            onChangeText={text => {
              setName(text);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '50%'}}
              icon="close"
              mode="text"
              onPress={() => seteditGroupName(false)}>
              cancel
            </Button>
            <Button
              style={{width: '50%'}}
              icon="check"
              mode="text"
              loading={isLoading}
              onPress={() => handleSubmit()}>
              Ok
            </Button>
          </View>
        </View>
      )}
      {editGroupDescription && (
        <View style={{padding: '2%', backgroundColor: '#fff'}}>
          <TextInput
            autoFocus={true}
            label="Group Description"
            mode="outlined"
            multiline
            value={description}
            onChangeText={text => {
              setDescription(text);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              alignSelf: 'flex-end',
            }}>
            <Button
              style={{width: '50%'}}
              icon="close"
              mode="text"
              onPress={() => setEditGroupDescription(false)}>
              cancel
            </Button>
            <Button
              style={{width: '50%'}}
              icon="check"
              mode="text"
              loading={isLoading}
              onPress={() => handleSubmit()}>
              Ok
            </Button>
          </View>
        </View>
      )}

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
                onCloseModalize();
                setAvatarModalVisible(true);
              }}
            />
            <Text>Avatars</Text>
          </View>
        </View>
      </Modalize>

      {avatarModalVisible && (
        <AvatarModal
          avatarModalVisible={avatarModalVisible}
          setAvatarModalVisible={setAvatarModalVisible}
          setAvatarURL={setAvatarURL}
          fileDataRef={fileDataRef}
          imageUploadHandler={imageUploadHandler}
        />
      )}
    </SafeAreaView>
  );
};

export default Index;

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
