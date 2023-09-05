import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
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
  useTheme,
  Chip,
  Card,
} from 'react-native-paper';
import {
  useUpdateGroupInfoMutation,
  useUpdateGroupNameMutation,
  useUpdateGroupDescriptionMutation,
  useUpdateImageURLMutation,
  useDeleteGroupForUserMutation,
} from '../../../../../redux/reducers/groups/groupThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AvatarModal from '../../../Menus/Profile/AvatarModal';
import {useDispatch, useSelector} from 'react-redux';
import {
  handleCurrentViewingGroup,
  handleGroupsFlag,
  handlePinGroup,
} from '../../../../../redux/reducers/groups/groups';
import {Modalize} from 'react-native-modalize';
import Countdown from 'react-native-countdown-xambra';
import LoginForMoreFeatures from '../../../../../Components/LoginForMoreFeatures';
import createRandomId from '../../../../../utils/createRandomId';
// imports end

const Index = ({route, navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [localDeleteLoding, setLocalDeleteLoading] = useState(false);
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );
  const PG = useSelector(state => state.groups?.pinGroup);

  const [adminIds, setAdminIds] = useState([]);
  const getMembersLenght = () => {
    for (let i = 0; i < groupAdmins?.length; i++) {
      setAdminIds([...adminIds, groupAdmins[i]?._id]);
    }
  };
  useEffect(() => {
    getMembersLenght();
  }, []);

  // component state - start
  const {users, groupName, _id, groupDescription, groupAdmins, createdBy} =
    currentViewingGroup;
  const [name, setName] = useState(groupName);
  const [description, setDescription] = useState(groupDescription);
  const [userId, setUserId] = useState('');

  // image uploading state
  const [modalVisible, setModalVisible] = useState(false);
  const fileDataRef = useRef(null);
  // const [avatarURL, setAvatarURL] = useState( route?.params?.group?.group.imageURL,);
  const [avatarURL, setAvatarURL] = useState(currentViewingGroup?.imageURL);
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

  const [updateLocalGroupNameLoading, setUpdateLocalGroupNameLoading] =
    useState(false);
  const [updateGroupName, {isLoading: updateGroupNameLoading}] =
    useUpdateGroupNameMutation();
  const [updateGroupDescription, {isLoading: updateGroupDescriptionLoading}] =
    useUpdateGroupDescriptionMutation();
  const [updateImageURL, {isLoading: updateImageURLLoging}] =
    useUpdateImageURLMutation();
  const [imageUploading, setimageUploading] = useState(false);

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

  const handleUpdateGroupName = () => {
    updateGroupName({
      groupId: _id,
      previousGroupName: currentViewingGroup?.groupName,
      newGroupName: name,
    })
      .then(res => {
        if (res.data._id) {
          dispatch(handleCurrentViewingGroup(res.data));
          setSnakeBarMessage('Group name has been updated');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
        } else {
          setSnakeBarMessage('Something went wrong. Please try again');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
        }
      })
      .catch(e => {
        setSnakeBarMessage('Something went wrong. Please try again');
        setShowSnakeBar(true);
        seteditGroupName(false);
        setEditGroupDescription(false);
      });
  };

  const groupsFlag = useSelector(state => state.groups?.groupsFlag);
  const updateLocalPinGroup = async group => {
    await AsyncStorage.setItem('pinGroup', JSON.stringify(group));
    dispatch(handlePinGroup(group));
  };

  const updateLocalGroupS = async groupFromDB => {
    setUpdateLocalGroupNameLoading(true);
    let group = groupFromDB
      ? groupFromDB
      : {
          _id: currentViewingGroup?._id,
          isSyncd: currentViewingGroup?.isSyncd,
          groupName: name,
          groupDescription: description,
          time: new Date(),
        };

    dispatch(handleCurrentViewingGroup(group));
    setSnakeBarMessage('Group name has been updated');
    setShowSnakeBar(true);
    seteditGroupName(false);
    setEditGroupDescription(false);

    let groups = await AsyncStorage.getItem('groups');
    if (groups) {
      let data = JSON.parse(groups).filter(
        grp => grp._id !== currentViewingGroup._id,
      );
      let newGroups = [group, ...data];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
    } else {
      let newGroups = [group];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
    }
    dispatch(handleGroupsFlag(!groupsFlag));
    setUpdateLocalGroupNameLoading(false);

    let pg = JSON.parse(await AsyncStorage.getItem('pinGroup'));
    if (pg?._id === currentViewingGroup._id) {
      updateLocalPinGroup(group);
    }

    // navigation.navigate('GroupStack', {screen: 'HomeIndex'});
  };

  const handleUpdateGroupDescription = () => {
    updateGroupDescription({
      groupId: _id,
      groupDescription: description,
      newGroupName: name,
    })
      .then(res => {
        if (res.data?._id) {
          dispatch(handleCurrentViewingGroup(res.data));
          setSnakeBarMessage('Group description has been updated');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
        } else {
          setSnakeBarMessage('Something went wrong. Please try again');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
        }
      })
      .catch(e => {
        setSnakeBarMessage('Something went wrong. Please try again');
        setShowSnakeBar(true);
        seteditGroupName(false);
        setEditGroupDescription(false);
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
        handleDelete()
      })
      .catch(e => {
        console.log('error in handleLeave', e);
      });
  };

  const handleDelete = async () => {
    setSnakeBarMessage('Deleting group');
    setLocalDeleteLoading(true);
    setShowSnakeBar(true);
    let retString = await AsyncStorage.getItem('groups');
    let grps = JSON.parse(retString);
    const newArr = grps.filter(object => {
      return object._id !== currentViewingGroup?._id;
    });
    await AsyncStorage.setItem('groups', JSON.stringify(newArr));
    let pg = JSON.parse(await AsyncStorage.getItem('pinGroup'));

    if (pg?._id === currentViewingGroup._id) {
      await AsyncStorage.setItem(
        'pinGroup',
        JSON.stringify(newArr?.length ? newArr[0] : null),
      );
    }
    dispatch(handlePinGroup(newArr?.length ? newArr[0] : {}));
    setLocalDeleteLoading(false);
    navigation.replace('Drawer');
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
      setimageUploading(true);
      const uri = fileDataRef.current.path;
      const type = fileDataRef.current.mime;
      const name = currentViewingGroup?.groupName;
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
          updateImageURL({
            groupId: _id,
            imageURL: data.url,
          })
            .then(res => {
              dispatch(handleCurrentViewingGroup(res.data));
              setSnakeBarMessage('Group profile image has been updated');
              setShowSnakeBar(true);
              seteditGroupName(false);
              setEditGroupDescription(false);
              setimageUploading(false);
            })
            .catch(e => {
              setSnakeBarMessage('Something went wrong. Please try again');
              setShowSnakeBar(true);
            });
        })
        .catch(err => {
          console.log('An Error Occured While Uploading profile image', err);
          fileDataRef.current = null;
          setimageUploading(false);
          return;
        });
    } else if (avatarURL) {
      setimageUploading(true);
      updateImageURL({
        groupId: _id,
        imageURL: avatarURL,
      })
        .then(res => {
          dispatch(handleCurrentViewingGroup(res.data));
          setSnakeBarMessage('Group information has been updated');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
          setimageUploading(false);
        })
        .catch(e => {
          setSnakeBarMessage('Something went wrong. Please try again');
          setShowSnakeBar(true);
          setimageUploading(false);
        });
    } else {
      Alert.alert('Image not selected', 'Please select an image');
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

  const [token, setToken] = useState(null);
  useLayoutEffect(() => {
    const getToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getToken();
  }, []);

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <ScrollView>
          <KeyboardAvoidingView
            enabled={false}
            keyboardVerticalOffset={0}
            behavior="height"
            style={{flex: 1}}>
            <View>
              <Image
                style={{
                  width: '100%',
                  opacity: 0.9,
                  alignSelf: 'center',
                  resizeMode: 'cover',
                }}
                source={require('../../../../../assets/images/main-1.png')}
              />
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#26231c',
                  opacity: 0.8,
                  padding: '5%',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 24,
                  }}>
                  {groupName}
                </Text>
                <Countdown
                  // until={pinGroupTime.current ? pinGroupTime.current : 0}
                  until={200000}
                  // onFinish={() => alert('finished')}
                  // onPress={() => alert('hello')}
                  size={22}
                  style={{margin: '2%'}}
                  digitTxtStyle={{color: '#fff'}}
                  digitStyle={{backgroundColor: '#265AE8'}}
                  timeLabelStyle={{color: '#fff'}}
                  // timeToShow={['D','H']}
                  // showSeparator
                  separatorStyle={{color: '#fff', alignSelf: 'center'}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: '2%',
                  }}>
                  <Button
                    style={{
                      width: '25%',
                    }}
                    theme={{roundness: 2}}
                    mode="contained"
                    icon={'pencil-outline'}
                    contentStyle={{padding: '2%', flexDirection: 'row-reverse'}}
                    labelStyle={{
                      fontWeight: 'bold',
                      color: theme.colors.onBackground,
                    }}
                    buttonColor={theme.colors.cardBG}
                    onPress={() => {
                      setEditGroupDescription(false);
                      seteditGroupName(true);
                    }}>
                    Name
                  </Button>

                  <Button
                    style={{
                      width: '25%',
                    }}
                    theme={{roundness: 2}}
                    mode="contained"
                    icon={'pencil-outline'}
                    contentStyle={{padding: '2%', flexDirection: 'row-reverse'}}
                    labelStyle={{
                      fontWeight: 'bold',
                      color: theme.colors.onBackground,
                    }}
                    buttonColor={theme.colors.cardBG}
                    onPress={async () => {
                      await AsyncStorage.setItem('isLoggedIn', 'login');
                      navigation.navigate('SignUpwithEmail');
                    }}>
                    Date
                  </Button>

                  <Button
                    style={{
                      width: '40%',
                    }}
                    textColor={theme.colors.textGray}
                    theme={{roundness: 2}}
                    mode="contained"
                    icon={'pencil-outline'}
                    // onPress={handleSubmit}
                    contentStyle={{padding: '2%', flexDirection: 'row-reverse'}}
                    labelStyle={{
                      width: '60%',
                      fontWeight: 'bold',
                      color: theme.colors.onBackground,
                    }}
                    buttonColor={theme.colors.cardBG}
                    onPress={async () => {
                      await AsyncStorage.setItem('isLoggedIn', 'login');
                      navigation.navigate('SignUpwithEmail');
                    }}>
                    Background
                  </Button>
                </View>
              </View>
            </View>

            <Card
              style={{
                backgroundColor: theme.colors.cardBG,
              }}
              theme={{roundness: 2}}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="titleLarge">Description</Text>
                  <TouchableOpacity
                    onPress={() => {
                      seteditGroupName(false);
                      setEditGroupDescription(true);
                    }}>
                    <Avatar.Icon
                      size={35}
                      icon="pencil"
                      style={{backgroundColor: theme.colors.cardBG}}
                    />
                  </TouchableOpacity>
                </View>
                <Text variant="bodyMedium">{description}</Text>
              </Card.Content>
            </Card>

            {token ? (
              <Card
                style={{
                  backgroundColor: theme.colors.cardBG,
                  marginTop: '2%',
                }}
                theme={{roundness: 2}}>
                <List.Section
                  style={{
                    padding: '2%',
                    backgroundColor: theme.colors.cardBG,
                  }}>
                  <List.Subheader>
                    Group members ({users?.length ? users?.length : 1})
                  </List.Subheader>
                  <List.Item
                    onPress={() => {
                      navigation.navigate('updateGroupMembers');
                    }}
                    title="Add Member"
                    left={() => (
                      <Avatar.Icon size={50} icon="account-plus-outline" />
                    )}
                  />

                  <Divider />
                  {users?.map((member, index) => (
                    <List.Item
                      key={index}
                      title={member.name}
                      description={() => (
                        <View style={{width: '40%', marginTop: 5}}>
                          {adminIds.includes(member?._id) ? (
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  backgroundColor: theme.colors.surfaceVariant,
                                  paddingVertical: '2%',
                                  paddingHorizontal: '5%',
                                  borderRadius: 5,
                                  marginRight: '5%',
                                }}>
                                <Text style={{textAlign: 'center'}}>Admin</Text>
                              </View>

                              {createdBy?._id === member?._id && (
                                <View
                                  style={{
                                    backgroundColor:
                                      theme.colors.primaryContainer,
                                    paddingVertical: '2%',
                                    paddingHorizontal: '5%',
                                    borderRadius: 5,
                                  }}>
                                  <Text style={{textAlign: 'center'}}>
                                    Creator
                                  </Text>
                                </View>
                              )}
                            </View>
                          ) : null}
                        </View>
                      )}
                      // description={member.email}
                      titleStyle={{fontWeight: 'bold'}}
                      right={props => (
                        <View>
                          {adminIds.includes(userId) ? (
                            <IconButton
                              {...props}
                              disabled={
                                createdBy?._id === member._id ||
                                member._id === userId ||
                                deleteLoading
                                  ? true
                                  : false
                              }
                              icon="delete"
                              size={20}
                              onPress={() =>
                                handleRemoveUserFromGroup(member._id)
                              }
                              mode="contained-tonal"
                            />
                          ) : null}
                        </View>
                      )}
                      left={() => (
                        <Avatar.Image
                          source={
                            member.imageURL
                              ? {uri: member.imageURL}
                              : require('../../../../../assets/drawer/male-user.png')
                          }
                          size={60}
                        />
                      )}
                    />
                  ))}
                </List.Section>
              </Card>
            ) : (
              <LoginForMoreFeatures
                token={token}
                isLoading={isLoading}
                localLoading={isLoading}
                navigation={navigation}
              />
            )}

            <Card
              style={{
                backgroundColor: theme.colors.cardBG,
                marginVertical: '2%',
                paddingHorizontal: '2%',
              }}
              theme={{roundness: 2}}>
              <List.Section
                style={{
                  padding: '2%',
                }}>
                {token ? (
                  <List.Item
                    onPress={handleLeave}
                    title="Leave group"
                    left={() => (
                      <List.Icon color={theme.colors.error} icon="logout" />
                    )}
                    titleStyle={{color: theme.colors.error}}
                  />
                ) : (
                  <List.Item
                    onPress={handleDelete}
                    title="Delete group"
                    left={() => (
                      <List.Icon color={theme.colors.error} icon="delete" />
                    )}
                    titleStyle={{color: theme.colors.error}}
                  />
                )}

                {/* <Divider />
            <List.Item
              title="Report"
              onPress={() => console.log('report pressed')}
              left={() => <List.Icon icon="thumb-down-outline" />}
            /> */}
              </List.Section>
            </Card>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>

      <Snackbar
        visible={showSnakeBar}
        icon={
          deleteLoading || localDeleteLoding
            ? () => <ActivityIndicator animating={true} size="small" />
            : 'check'
        }
        onIconPress={() => console.log('hello')}
        onDismiss={() => setShowSnakeBar(false)}
        duration={4000}>
        {snakeBarMessage}
      </Snackbar>

      <Snackbar
        visible={deleteLoading}
        icon={() => <ActivityIndicator animating={true} size="small" />}
        onIconPress={() => console.log('hello')}
        onDismiss={() => setShowSnakeBar(false)}>
        {snakeBarMessage}
      </Snackbar>

      {editGroupName && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            autoFocus={true}
            label="Group name"
            mode="outlined"
            value={name}
            onChangeText={text => {
              setName(text);
            }}
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
                setName(groupName);
                seteditGroupName(false);
              }}>
              cancel
            </Button>
            <Button
              style={{
                width: '49%',
                marginLeft: '1%',
                color: theme.colors.onBackground,
              }}
              icon="check"
              mode="contained"
              loading={updateGroupNameLoading || updateLocalGroupNameLoading}
              onPress={() =>
                token ? handleUpdateGroupName() : updateLocalGroupS()
              }
              theme={{roundness: 1}}
              disabled={
                updateGroupNameLoading ||
                updateLocalGroupNameLoading ||
                name.length < 1
              }>
              Ok
            </Button>
          </View>
        </View>
      )}
      {editGroupDescription && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            autoFocus={true}
            label="Group Description"
            mode="outlined"
            multiline
            value={description}
            onChangeText={text => {
              setDescription(text);
            }}
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
                setDescription(groupDescription);
                setEditGroupDescription(false);
              }}>
              cancel
            </Button>
            <Button
              style={{
                width: '49%',
                marginLeft: '1%',
                color: theme.colors.onBackground,
              }}
              icon="check"
              mode="contained"
              loading={
                updateGroupDescriptionLoading || updateLocalGroupNameLoading
              }
              onPress={() =>
                token ? handleUpdateGroupDescription() : updateLocalGroupS()
              }
              theme={{roundness: 1}}
              disabled={
                updateLocalGroupNameLoading ||
                updateGroupDescriptionLoading ||
                description.length < 1
              }>
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
