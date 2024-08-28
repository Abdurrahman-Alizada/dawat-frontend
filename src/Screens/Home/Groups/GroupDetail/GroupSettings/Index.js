import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
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
  Card,
} from 'react-native-paper';
import {
  useUpdateGroupNameMutation,
  useUpdateGroupDescriptionMutation,
  useDeleteGroupForUserMutation,
  useUpdateGroupTimeMutation,
} from '../../../../../redux/reducers/groups/groupThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  handleCurrentViewingGroup,
  handleGroupsFlag,
  handlePinGroup,
} from '../../../../../redux/reducers/groups/groups';
import Countdown from 'react-native-countdown-xambra';
import LoginForMoreFeatures from '../../../../../Components/LoginForMoreFeatures';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import BackgroundImages from '../../changeBackMainImage/mainBackgroundImages';
import DatePicker from 'react-native-date-picker';
import EventSettingsAppbar from '../../../../../Components/Appbars/eventSettingsAppbar';
import {useTranslation} from 'react-i18next';
// imports end

const Index = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [adminIds, setAdminIds] = useState([]);
  const [localDeleteLoding, setLocalDeleteLoading] = useState(false);

  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);
  const currentBackgroundImgSrcId = useSelector(state => state.groups.currentBackgroundImgSrcId);

  const getMembersLenght = () => {
    for (let i = 0; i < groupAdmins?.length; i++) {
      setAdminIds([...adminIds, groupAdmins[i]?._id]);
    }
  };
  useEffect(() => {
    getMembersLenght();
  }, []);

  // component state - start
  const {users, groupName, _id, groupDescription, groupAdmins, createdBy} = currentViewingGroup;
  const [name, setName] = useState(groupName);
  const [description, setDescription] = useState(groupDescription);
  const [userId, setUserId] = useState('');

  // snakebar
  const [snakeBarMessage, setSnakeBarMessage] = useState('');
  const [showSnakeBar, setShowSnakeBar] = useState(false);

  // edit data
  const [editGroupName, seteditGroupName] = useState(false);
  const [editGroupDescription, setEditGroupDescription] = useState(false);

  // show more for description
  const [localLoading, setLocalLoading] = useState(true); //To show ur remaining Text
  useEffect(() => {
    setTimeout(() => {
      setLocalLoading(false);
    }, 2000);
  }, []);
  // redux toolkit - start

  const [updateLocalGroupNameLoading, setUpdateLocalGroupNameLoading] = useState(false);
  const [updateGroupName, {isLoading: updateGroupNameLoading}] = useUpdateGroupNameMutation();
  const [updateGroupTime, {isLoading: updateGroupTimeLoading}] = useUpdateGroupTimeMutation();
  const [updateGroupDescription, {isLoading: updateGroupDescriptionLoading}] =
    useUpdateGroupDescriptionMutation();

  const [deleteGroupForUser, {isLoading: deleteLoading}] = useDeleteGroupForUserMutation();
  // redux toolkit - end

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

    updateLocalGroupS();
  };

  const handleUpdateGroupTime = date => {
    setDueDate(date);
    setOpenDueDate(false);

    updateGroupTime({
      groupId: _id,
      previousGroupTime: currentViewingGroup?.time,
      newGroupTime: date,
    })
      .then(res => {
        if (res.data._id) {
          dispatch(handleCurrentViewingGroup(res.data));
          seteditGroupName(false);
          setEditGroupDescription(false);
        } else {
          setSnakeBarMessage('Something went wrong');
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

    updateLocalGroupS(date);
  };
  const groupsFlag = useSelector(state => state.groups?.groupsFlag);
  const updateLocalPinGroup = async group => {
    await AsyncStorage.setItem('pinGroupId', JSON.stringify(group?._id));
    dispatch(handlePinGroup(group));
  };

  const updateLocalGroupS = async date => {
    setUpdateLocalGroupNameLoading(true);

    let group = date
      ? {
          ...currentViewingGroup,
          groupName: name,
          groupDescription: description,
          time: date,
        }
      : {
          ...currentViewingGroup,
          groupName: name,
          groupDescription: description,
        };
    dispatch(handleCurrentViewingGroup(group));
    setSnakeBarMessage('Event data has been updated');
    setShowSnakeBar(true);
    seteditGroupName(false);
    setEditGroupDescription(false);

    let groups = await AsyncStorage.getItem('groups');
    if (groups) {
      let data = JSON.parse(groups).filter(grp => grp._id !== currentViewingGroup._id);
      let newGroups = [group, ...data];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
    } else {
      let newGroups = [group];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
    }
    dispatch(handleGroupsFlag(!groupsFlag));
    setUpdateLocalGroupNameLoading(false);

    let pgId = JSON.parse(await AsyncStorage.getItem('pinGroupId'));
    if (pgId === currentViewingGroup._id) {
      updateLocalPinGroup(group);
    }
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
          setSnakeBarMessage('Something went wrong');
          setShowSnakeBar(true);
          seteditGroupName(false);
          setEditGroupDescription(false);
        }
      })
      .catch(e => {
        setSnakeBarMessage('Something went wrong');
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
        handleDelete();
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
    let pgId = JSON.parse(await AsyncStorage.getItem('pinGroupId'));

    if (pgId === currentViewingGroup._id) {
      await AsyncStorage.setItem(
        'pinGroupId',
        JSON.stringify(newArr?.length ? newArr[0]?._id : null),
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

  const getCurrentUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  // functions - end

  const [token, setToken] = useState(null);
  const [dueDate, setDueDate] = useState(
    currentViewingGroup?.time ? new Date(currentViewingGroup?.time) : new Date(),
  );
  const [openDueDate, setOpenDueDate] = useState(false);

  useLayoutEffect(() => {
    getCurrentUserId();
  }, [dueDate]);

  useLayoutEffect(() => {
    const getToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getToken();
  }, []);

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <EventSettingsAppbar />
        <ScrollView>
          <ImageBackground
            style={{height: 235}}
            imageStyle={{resizeMode: 'cover'}}
            source={BackgroundImages[currentBackgroundImgSrcId]}>
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}>
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  paddingHorizontal: '5%',
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
                {moment(dueDate).diff(moment(new Date()), 'seconds') < 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                    }}>
                    <Countdown
                      until={Math.abs(moment(dueDate).diff(moment(new Date()), 'seconds'))}
                      size={22}
                      style={{margin: '2%'}}
                      digitTxtStyle={{color: '#fff'}}
                      digitStyle={{backgroundColor: theme.colors.error}}
                      timeLabelStyle={{color: '#fff'}}
                      running={false}
                      separatorStyle={{color: '#fff', alignSelf: 'center'}}
                      timeLabels={{d: t('Days'), h: t('Hours'), m: t('Minutes'), s: t('Seconds')}}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#fff',
                      }}>
                      {t('ago')}
                    </Text>
                  </View>
                ) : (
                  <Countdown
                    until={Math.abs(moment(dueDate).diff(moment(new Date()), 'seconds'))}
                    size={22}
                    style={{margin: '2%'}}
                    digitTxtStyle={{color: '#fff'}}
                    digitStyle={{backgroundColor: '#265AE8'}}
                    timeLabelStyle={{color: '#fff'}}
                    separatorStyle={{color: '#fff', alignSelf: 'center'}}
                    timeLabels={{d: t('Days'), h: t('Hours'), m: t('Minutes'), s: t('Seconds')}}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: '4%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditGroupDescription(false);
                      seteditGroupName(true);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.colors.cardBG,
                      paddingHorizontal: '2%',
                      paddingVertical: '1%',
                      borderRadius: 5,
                    }}>
                    <Text style={{color: '#fff', paddingRight: '2%', fontWeight: 'bold'}}>
                      {t('Title')}
                    </Text>
                    <Icon name="edit" size={16} color={theme.colors.cardBG} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setEditGroupDescription(false);
                      seteditGroupName(false);
                      setOpenDueDate(true);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.colors.cardBG,
                      paddingHorizontal: '2%',
                      paddingVertical: '1%',
                      borderRadius: 5,
                    }}>
                    <Text style={{color: '#fff', paddingRight: '2%', fontWeight: 'bold'}}>
                      {t('Date')}
                    </Text>
                    <Icon name="edit" size={16} color={theme.colors.cardBG} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChangeMainImage');
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.colors.cardBG,
                      paddingHorizontal: '2%',
                      paddingVertical: '1%',
                      borderRadius: 5,
                    }}>
                    <Text style={{color: '#fff', paddingRight: '2%', fontWeight: 'bold'}}>
                      {t('Background')}
                    </Text>
                    <Icon name="edit" size={16} color={theme.colors.cardBG} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>

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
                <Text variant="bodyMedium" style={{color: theme.colors.textGray}}>
                  {t('Description')}
                </Text>
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
              <Text variant="bodyLarge">{description}</Text>
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
                  {t('Event members')} ({users?.length ? users?.length : 1})
                </List.Subheader>
                <List.Item
                  onPress={() => {
                    navigation.navigate('updateGroupMembers');
                  }}
                  title={t('Add Member')}
                  left={() => <Avatar.Icon size={50} icon="account-plus-outline" />}
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
                              <Text style={{textAlign: 'center'}}>{t('Admin')}</Text>
                            </View>

                            {createdBy?._id === member?._id && (
                              <View
                                style={{
                                  backgroundColor: theme.colors.primaryContainer,
                                  paddingVertical: '2%',
                                  paddingHorizontal: '5%',
                                  borderRadius: 5,
                                }}>
                                <Text style={{textAlign: 'center'}}>{t('Creator')}</Text>
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
                            onPress={() => handleRemoveUserFromGroup(member._id)}
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
              localLoading={localLoading}
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
                  title={t('Leave event')}
                  left={() => <List.Icon color={theme.colors.error} icon="logout" />}
                  titleStyle={{color: theme.colors.error}}
                />
              ) : (
                <List.Item
                  onPress={handleDelete}
                  title="Delete event"
                  left={() => <List.Icon color={theme.colors.error} icon="delete" />}
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
        </ScrollView>

        <DatePicker
          date={dueDate}
          open={openDueDate}
          modal
          onConfirm={date => {
            handleUpdateGroupTime(date);
          }}
          onCancel={() => {
            setOpenDueDate(false);
          }}
        />
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
        {t(snakeBarMessage)}
      </Snackbar>

      <Snackbar
        visible={deleteLoading}
        icon={() => <ActivityIndicator animating={true} size="small" />}
        onIconPress={() => console.log('hello')}
        onDismiss={() => setShowSnakeBar(false)}>
        {t(snakeBarMessage)}
      </Snackbar>

      {editGroupName && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            autoFocus={true}
            label={t('Group name')}
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
              loading={updateGroupNameLoading || updateLocalGroupNameLoading}
              onPress={() => handleUpdateGroupName()}
              theme={{roundness: 1}}
              disabled={updateGroupNameLoading || updateLocalGroupNameLoading || name.length < 1}>
              {t('Ok')}
            </Button>
          </View>
        </View>
      )}
      {editGroupDescription && (
        <View style={{padding: '2%', backgroundColor: theme.colors.background}}>
          <TextInput
            autoFocus={true}
            label={t('Group Description')}
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
              loading={updateGroupDescriptionLoading || updateLocalGroupNameLoading}
              onPress={() => (token ? handleUpdateGroupDescription() : updateLocalGroupS())}
              theme={{roundness: 1}}
              disabled={
                updateLocalGroupNameLoading ||
                updateGroupDescriptionLoading ||
                description.length < 1
              }>
              {t('Ok')}
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;
