import React, {useEffect, useState, useRef} from 'react';
import {TouchableWithoutFeedback, View, Image} from 'react-native';
import {
  Avatar,
  Appbar,
  DataTable,
  Divider,
  Button,
  FAB,
  Text,
  Dialog,
  Portal,
  Chip,
  TextInput,
  Snackbar,
  useTheme,
  Provider,
  ActivityIndicator,
  Banner,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {FlashList} from '@shopify/flash-list';
import {useDispatch, useSelector} from 'react-redux';
import {useAddMultipleInvitiMutation} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {jsonToCSV} from 'react-native-csv';
import RNFS from 'react-native-fs';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleInvitiFlag} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import createRandomId from '../../../../../utils/createRandomId';

export default function DisplayCsvDataTable({props, route}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);
  const invitiFlag = useSelector(state => state.invitations.invitiFlag);

  const [addMultipleInviti, {isLoading: addMultipleInvitiLoading}] = useAddMultipleInvitiMutation();

  const invitiArray = route.params?.data ? route.params?.data : [];
  const [invitiToDisplay, setInvitiToDisplay] = useState(null);
  const listRef = useRef();

  const stringToJsonHandler = () => {
    if (invitiArray.length) {
      if (
        invitiArray[0][0] === 'Inviti name' &&
        invitiArray[0][1] === 'Inviti Description' &&
        invitiArray[0][4] === 'Last status' &&
        invitiArray[0][6] === 'Image URL of inviti'
      ) {
        const jsonStrings = invitiArray.map(inviti => {
          let object = {
            _id : createRandomId(12),
            invitiName: inviti[0],
            invitiDescription: inviti[1],
            invitiImageURL: inviti[6] ? inviti[6] : '',
            lastStatus: {invitiStatus:  inviti[4], addedBy :{name:"You"}},
            group: currentViewingGroup._id,
            groupId: currentViewingGroup._id,
            isSync : false,
            addedBy : {name:"You"}
          };
          return object;
        });
        jsonStrings.shift(1);
        setInvitiToDisplay(jsonStrings);
      } else {
        setBannerText(
          'Fields did not match. Please make sure your csv file contain fields in same order as sample file.',
        );
        setBannerVisible(true);
      }
    } else {
      console.log('nothing to appear in list');
    }
  };

  useEffect(() => {
    stringToJsonHandler();
  }, []);

  const [token, setToken] = useState('');
  useEffect(() => {
    const getToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getToken();
  }, []);

  const AddMultipleHandler = () => {
    if (invitiToDisplay?.length) {
      addMultipleInviti({
        groupId: currentViewingGroup._id,
        invities: invitiToDisplay,
      })
        .then(res => {
          console.log(res);
          navigation.goBack();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setSnackbarText('Please add atleast one inviti');
      setSnackbarVisible(true);
    }
  };

  const createMultipleLocalInvities = async () => {
    let guests = JSON.parse(await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`));
    if (guests) {
      guests = [...guests, ...invitiToDisplay];
    } else {
      guests = invitiToDisplay;
    }
    await AsyncStorage.setItem(`guests_${currentViewingGroup?._id}`, JSON.stringify(guests));
    dispatch(handleInvitiFlag(!invitiFlag));
    navigation.goBack();
  };
  // new inviti
  const [visible, setVisible] = useState(false);
  const [statuses, setStatuses] = useState([
    {label: 'Invited', value: 'invited'},
    {label: 'Rejected', value: 'rejected'},
    {label: 'Pending', value: 'pending'},
  ]);
  const [selectedstatus, setSelectedStatus] = useState('pending');

  const [newInvitiName, setNewInvitiName] = useState('');
  const [newInvitiDescription, setNewInvitiDescription] = useState('');

  // snackbar
  const [SnackbarVisible, setSnackbarVisible] = useState(false);
  const [SnackbarText, setSnackbarText] = useState('');

  // banner
  const [bannerText, setBannerText] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);

  // sample file download handler
  const sampleFileDownloadHandler = () => {
    const jsonData = `[
    {
        "Inviti name": "Gulab",
        "Inviti Description": "some description about Gulab",
        "Inviti contact": "contact detail of inviti",
        "Added by": "who is adding Gulab to group",
        "Last status": "status of Gulab invitaion",
        "Last status updated by": "who update the last status of Gulab invitaion",
        "Image URL of inviti": "Image URL of gulab"
    }
  ]`;
    const results = jsonToCSV(jsonData);
    const date = moment(new Date()).format(' d_MMM_YYYY_hh_mm_ss_A');
    const path = RNFS.DownloadDirectoryPath + `/sample csv file ${date}.csv`;

    RNFS.writeFile(path, results, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!', success);
        setSnackbarText('Sample file has been downloaded in download folder');
        setSnackbarVisible(true);
        setBannerVisible(false);
      })
      .catch(err => {
        setSnackbarText('something went wrong');
        setSnackbarVisible(true);
        console.log(err.message);
      });
  };

  // accordin item
  const AccordionItem = ({item, index}) => {
    // console.log('first', index, item.lastStatus);
    const shareValue = useSharedValue(0);
    const [bodySectionHeight, setBodySectionHeight] = useState(0);

    const bodyHeight = useAnimatedStyle(() => ({
      height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
    }));

    const toggleButton = () => {
      if (shareValue.value === 0) {
        shareValue.value = withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
      } else {
        shareValue.value = withTiming(0, {
          duration: 200,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });
      }
    };

    const [invitiToEditName, setInvitiToEditName] = useState(item.invitiName);
    const [invitiToEditDescription, setInvitiToEditDescription] = useState(item.invitiDescription);

    const [visibleSingle, setVisibleSingle] = useState(false);

    const [selectedstatusSingle, setSelectedStatusSingle] = useState(
      item.lastStatus?.invitiStatus ? item.lastStatus?.invitiStatus : item.lastStatus,
    );

    return (
      <View>
        <TouchableWithoutFeedback onPress={toggleButton}>
          <View>
            <DataTable.Row style={{borderBottomWidth: 0}}>
              <DataTable.Cell>
                {item?.invitiImageURL ? (
                  <Avatar.Image
                    source={{
                      uri: item?.invitiImageURL,
                    }}
                    size={40}
                  />
                ) : (
                  <Avatar.Text label={item.invitiName?.charAt(0)} size={40} />
                )}
              </DataTable.Cell>
              <DataTable.Cell>{item.invitiName}</DataTable.Cell>
              <DataTable.Cell>{item.invitiDescription}</DataTable.Cell>
              <DataTable.Cell>{
              // item.lastStatus?.invitiStatus
              item.lastStatus?.invitiStatus ? item.lastStatus?.invitiStatus : item.lastStatus
              }</DataTable.Cell>
            </DataTable.Row>
            <Animated.View style={[{overflow: 'hidden'}, bodyHeight]}>
              <View
                style={{position: 'absolute', padding: '3%', width: '100%'}}
                onLayout={event => {
                  setBodySectionHeight(event.nativeEvent.layout.height);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: '2%',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Chip
                      icon={() => <Icon name="edit" size={16} color={theme.colors.onBackground} />}
                      style={{marginLeft: '4%'}}
                      textStyle={{color: theme.colors.onBackground}}
                      mode="flat"
                      onPress={() => {
                        setInvitiToEditName(item.invitiName);
                        setInvitiToEditDescription(item.invitiDescription);
                        setSelectedStatusSingle(item.lastStatus);
                        setVisibleSingle(true);
                      }}>
                      Edit
                    </Chip>
                    <Chip
                      icon={() => <Icon name="trash" size={16} color={theme.colors.onBackground} />}
                      style={{marginLeft: '4%'}}
                      textStyle={{color: theme.colors.onBackground}}
                      mode="flat"
                      onPress={() => {
                        let temp = [...invitiToDisplay];
                        temp.splice(index, 1);
                        setInvitiToDisplay(temp);
                        temp = null;
                      }}>
                      Remove
                    </Chip>
                  </View>
                </View>
              </View>
            </Animated.View>
            <Divider />
          </View>
        </TouchableWithoutFeedback>
        <Portal>
          <Dialog visible={visibleSingle} onDismiss={() => setVisibleSingle(false)}>
            <Dialog.ScrollArea>
              <View>
                <TextInput
                  label="Name"
                  placeholder=""
                  mode="outlined"
                  value={invitiToEditName}
                  onChangeText={e => setInvitiToEditName(e)}
                />
                <TextInput
                  // error={errors.email && touched.email ? true : false}
                  label="Description"
                  placeholder=""
                  mode="outlined"
                  style={{marginTop: '2%'}}
                  value={invitiToEditDescription}
                  onChangeText={e => setInvitiToEditDescription(e)}
                />

                <View>
                  <Text style={{marginTop: '2%'}}>Inviti statuse</Text>
                  <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                    {statuses.map((statuse, index) => (
                      <Chip
                        key={index}
                        selected={selectedstatusSingle === statuse.value ? true : false}
                        mode={selectedstatusSingle === statuse.value ? 'flat' : 'outlined'}
                        style={{marginRight: '2%', marginVertical: '2%'}}
                        onPress={() => {
                          setSelectedStatusSingle(statuse.value);
                        }}>
                        {statuse.label}
                      </Chip>
                    ))}
                  </View>
                </View>
              </View>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setVisibleSingle(false);
                  setInvitiToEditName('');
                  setInvitiToEditDescription('');
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  let newInvitiToAdd = {
                    _id : createRandomId(12),
                    invitiName: invitiToEditName,
                    invitiDescription: invitiToEditDescription,
                    invitiImageURL: item.invitiImageURL,
                    lastStatus: selectedstatusSingle,
                    group: currentViewingGroup._id,
                    addedBy : {name: "You"}
                  };
                  let tempArr = [...invitiToDisplay];
                  tempArr[index] = newInvitiToAdd;
                  setInvitiToDisplay(tempArr);
                  setVisibleSingle(false);
                }}
                disabled={!invitiToEditName.length}>
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };

  return (
    <Provider>
      <Appbar
        style={{
          backgroundColor: theme.colors.background,
          marginBottom: 2,
        }}
        elevated
        // mode="medium"
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Add multiple invities`} />

        <Appbar.Action
          icon="account-plus"
          iconColor={theme.colors.error}
          style={{marginHorizontal: '3%'}}
          onPress={() => setVisible(true)}
        />
      </Appbar>

      <Banner
        visible={bannerVisible}
        actions={[
          {
            label: 'Download sample file',
            onPress: () => sampleFileDownloadHandler(),
          },
          {
            label: 'Understood',
            onPress: () => setBannerVisible(false),
          },
        ]}
        icon={({size}) => <Avatar.Icon size={size} icon="format-list-text" />}>
        {bannerText}
      </Banner>

      <DataTable style={{flex: 1}}>
        <FlashList
          data={invitiToDisplay}
          estimatedItemSize={150}
          initialNumToRender={10}
          ref={listRef}
          ListHeaderComponent={() => (
            <View>
              {invitiToDisplay && (
                <DataTable.Header>
                  <DataTable.Cell>
                    <DataTable.Title>Profile</DataTable.Title>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <DataTable.Title>Name</DataTable.Title>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <DataTable.Title>Description</DataTable.Title>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <DataTable.Title>Status</DataTable.Title>
                  </DataTable.Cell>
                </DataTable.Header>
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={{flex: 1, alignItems: 'center', marginTop: '20%'}}>
              <Text>List is empty</Text>
              <Text>Press FAB button to add new inviti</Text>
            </View>
          )}
          renderItem={({item, index}) => <AccordionItem item={item} index={index} />}
        />
      </DataTable>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.ScrollArea>
            <View>
              <TextInput
                label="Name"
                placeholder=""
                mode="outlined"
                value={newInvitiName}
                onChangeText={e => setNewInvitiName(e)}
                autoFocus
              />
              <TextInput
                // error={errors.email && touched.email ? true : false}
                label="Description"
                placeholder=""
                mode="outlined"
                style={{marginTop: '2%'}}
                value={newInvitiDescription}
                onChangeText={e => setNewInvitiDescription(e)}
              />

              <View>
                <Text style={{marginTop: '2%'}}>Inviti statuse</Text>
                <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                  {statuses.map((statuse, index) => (
                    <Chip
                      key={index}
                      selected={selectedstatus === statuse.value ? true : false}
                      mode={selectedstatus === statuse.value ? 'flat' : 'outlined'}
                      style={{marginRight: '2%', marginVertical: '2%'}}
                      onPress={() => {
                        setSelectedStatus(statuse.value);
                      }}>
                      {statuse.label}
                    </Chip>
                  ))}
                </View>
              </View>
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setVisible(false);
                setNewInvitiName('');
                setNewInvitiDescription('');
              }}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                let newInvitiToAdd = {
                  _id : createRandomId(12),
                  invitiName: newInvitiName,
                  invitiDescription: newInvitiDescription,
                  invitiImageURL: '',
                  lastStatus: {
                    invitiStatus: selectedstatus,
                    addedBy: {name: 'You'},
                  },
                  group: currentViewingGroup._id,
                  isSync: false,
                  addedBy : {name: "You"}
                };
                setInvitiToDisplay(prevState =>
                  prevState ? [newInvitiToAdd, ...prevState] : [newInvitiToAdd],
                );
                setVisible(false);
                setNewInvitiName('');
                setNewInvitiDescription('');
              }}
              disabled={!newInvitiName.length}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        label="Add listed invitie(s)"
        disabled={addMultipleInvitiLoading}
        icon={
          addMultipleInvitiLoading
            ? () => <ActivityIndicator animating />
            : 'account-multiple-check'
        }
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => (token ? AddMultipleHandler() : createMultipleLocalInvities())}
      />

      <Snackbar
        visible={SnackbarVisible}
        duration={2000}
        onDismiss={() => setSnackbarVisible(false)}>
        {SnackbarText}
      </Snackbar>
    </Provider>
  );
}
