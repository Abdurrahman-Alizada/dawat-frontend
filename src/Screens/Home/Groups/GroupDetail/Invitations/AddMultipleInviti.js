import React, {useEffect, useState, useRef} from 'react';
import {TouchableWithoutFeedback, View, Image} from 'react-native';
import {
  Avatar,
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
import {useSelector} from 'react-redux';
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

export default function DisplayCsvDataTable({props, route}) {
  const navigation = useNavigation();
  const theme = useTheme();

  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );
  const [addMultipleInviti, {isLoading: addMultipleInvitiLoading}] =
    useAddMultipleInvitiMutation();

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
            invitiName: inviti[0],
            invitiDescription: inviti[1],
            invitiImageURL: inviti[6] ? inviti[6] : '',
            lastStatus: inviti[4],
            group: currentViewingGroup._id,
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

  // fab
  const [state, setState] = useState({open: false});
  const onStateChange = ({open}) => setState({open});
  const {open} = state;

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
    const [invitiToEditDescription, setInvitiToEditDescription] = useState(
      item.invitiDescription,
    );

    const [visibleSingle, setVisibleSingle] = useState(false);
    const [statusesSingle, setStatusesSingle] = useState([
      {label: 'Invited', value: 'invited'},
      {label: 'Rejected', value: 'rejected'},
      {label: 'Pending', value: 'pending'},
    ]);
    const [selectedstatusSingle, setSelectedStatusSingle] = useState(
      item.lastStatus,
    );

    return (
      <View>
        <TouchableWithoutFeedback onPress={toggleButton}>
          <View>
            <DataTable.Row style={{borderBottomWidth: 0}}>
              <DataTable.Cell>
                <Avatar.Image
                  source={{
                    uri: item?.invitiImageURL
                      ? item?.invitiImageURL
                      : 'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329063/avatars-for-user-profile/Bear_nvybp5.png',
                  }}
                  size={40}
                />
              </DataTable.Cell>
              <DataTable.Cell>{item.invitiName}</DataTable.Cell>
              <DataTable.Cell>{item.invitiDescription}</DataTable.Cell>
              <DataTable.Cell>{item.lastStatus}</DataTable.Cell>
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
                      icon={() => (
                        <Icon
                          name="edit"
                          size={16}
                          color={theme.colors.onBackground}
                        />
                      )}
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
                      icon={() => (
                        <Icon
                          name="trash"
                          size={16}
                          color={theme.colors.onBackground}
                        />
                      )}
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
          <Dialog
            visible={visibleSingle}
            onDismiss={() => setVisibleSingle(false)}>
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
                        selected={
                          selectedstatusSingle === statuse.value ? true : false
                        }
                        mode={
                          selectedstatusSingle === statuse.value
                            ? 'flat'
                            : 'outlined'
                        }
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
                    invitiName: invitiToEditName,
                    invitiDescription: invitiToEditDescription,
                    invitiImageURL: item.invitiImageURL,
                    lastStatus: selectedstatusSingle,
                    group: currentViewingGroup._id,
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
                      mode={
                        selectedstatus === statuse.value ? 'flat' : 'outlined'
                      }
                      style={{marginRight: '2%', marginVertical: '2%'}}
                      onPress={() => {
                        setSelectedStatus(statuse.value);
                        // setStatus(statuse.value);
                        // setIsEditStart(true);
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
                  invitiName: newInvitiName,
                  invitiDescription: newInvitiDescription,
                  invitiImageURL: '',
                  lastStatus: selectedstatus,
                  group: currentViewingGroup._id,
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
                    <DataTable.Title></DataTable.Title>
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
          renderItem={({item, index}) => (
            <AccordionItem item={item} index={index} />
          )}
        />
      </DataTable>

      <Portal>
        {
          !addMultipleInvitiLoading ? 

          <FAB.Group
            open={open}
            visible
            disabled
            icon={open ? 'close' : 'plus'}
            actions={[
              {
                icon: 'account-plus',
                label: 'New Inviti',
                onPress: () => setVisible(true),
              },
              {
                icon: 'account-multiple-check',
                label: 'Add listed inviti',
                onPress: () => AddMultipleHandler(),
              },
            ]}
            onStateChange={onStateChange}
          />
          :

        <FAB
          label='Loading'
          disabled
          icon={()=><ActivityIndicator animating />}
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
          }}
          onPress={() => console.log('Pressed')}
        />
        }

      </Portal>

      <Snackbar
        visible={SnackbarVisible}
        duration={2000}
        onDismiss={() => setSnackbarVisible(false)}>
        {SnackbarText}
      </Snackbar>
    </Provider>
  );
}
