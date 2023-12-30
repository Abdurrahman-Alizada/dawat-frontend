import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {
  useGetAllInvitationsQuery,
  useDeleteInvitiMutation,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {
  handleInvitions,
  handleCurrentInviti,
  handleIsExportBanner,
  handleInvitiFlag,
} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import {
  List,
  Avatar,
  FAB,
  Text,
  Chip,
  useTheme,
  Banner,
  Divider,
  Dialog,
  Button,
  Portal,
} from 'react-native-paper';
import InvitaionsList from '../../../../Skeletons/InvitationsList';
import {useNavigation} from '@react-navigation/native';
import InvitiBrief from './InvitiBrief';
import moment from 'moment';
import {FlashList} from '@shopify/flash-list';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ImportExport from './importExport';
import GuestsAppbar from '../../../../../Components/Appbars/GuestsAppbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';

export default function Example({route}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const netInfo = useNetInfo();

  const {groupId, isHeader} = route.params;

  const currentInvitiToDisplay = useSelector(state => state.invitations?.currentInviti);
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);
  const invitationSearchQuery = useSelector(state => state.invitations.invitationSearchQuery);
  const invitiFlag = useSelector(state => state.invitations.invitiFlag);
  const isInvitaionSearch = useSelector(state => state.invitations.isInvitaionSearch);
  const invitaionsForSearch = useSelector(state => state.invitations.invitations);
  const isExportBanner = useSelector(state => state.invitations?.isExportBanner);

  const invitiBriefModalizeRef = useRef(null);

  const {data, isError, isLoading, error, isFetching, refetch} = useGetAllInvitationsQuery({
    groupId,
  });

  const [localLoading, setLoacalLoading] = useState(true);
  const [filterdInvities, setFilterdInvities] = useState([]);
  
  const invitiesHandler = async () => {
    setLoacalLoading(true);
    let localInvities = await getLocalInvities();
  
    if (data && !isLoading && !isFetching && netInfo.isConnected) {
      let ids = new Set(localInvities?.map(d => d._id));
      localInvities = [...localInvities, ...data?.filter(d => !ids.has(d._id))];
      setFilterdInvities(localInvities);
      await AsyncStorage.setItem(
        `guests_${currentViewingGroup?._id}`,
        JSON.stringify(localInvities),
      );
    } else {
      setFilterdInvities(localInvities);
    }
    dispatch(handleInvitions(localInvities));
    setLoacalLoading(false);
  };

  const getLocalInvities = async () => {
    let retString = await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`);
    let aa = JSON.parse(retString);
    return aa ? aa : [];
  };

  // sync with database if inviti is not uploaded
  const [notSyncInvities, setNotSyncInvities] = useState([]);
  const notSyncInvitiHandler = async () => {
    const notSyncInvitiesArray = filterdInvities.filter(item => item.isSync == false);
    setNotSyncInvities(notSyncInvitiesArray);
  };

  useEffect(() => {
    invitiesHandler();
    notSyncInvitiHandler();
  }, [data, invitiFlag, isFetching]);

  const FABHandler = () => {
    navigation.navigate('AddInviti', {
      groupId: groupId,
    });
  };

  const BriefHandler = item => {
    dispatch(handleCurrentInviti(item));
    onBriefOpen();
  };

  const onBriefOpen = () => {
    invitiBriefModalizeRef.current?.open();
  };

  const onBriefClose = () => {
    invitiBriefModalizeRef.current?.close();
  };

  const getHighlightedText = result =>
    result?.split(new RegExp(`(${invitationSearchQuery})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == invitationSearchQuery.toLocaleLowerCase()
              ? {fontWeight: 'bold', color: theme.colors.primary}
              : {}
          }>
          {piece}
        </Text>
      );
    });

  // delete inviti
  const [currentItem, setCurrentItem] = useState({});

  const [visible, setVisible] = useState(false);
  const showDialog = item => {
    setCurrentItem(item);
    setVisible(true);
  };
  const hideDialog = () => setVisible(false);

  const [deleteInviti, {isLoading: deleteLoading}] = useDeleteInvitiMutation();
  const deleteHandler = item => {
    deleteInviti({
      groupId: currentViewingGroup._id,
      invitiId: item?._id,
    })
      .then(res => {
        hideDialog();
        // deleteInvitiFromLocalStorage(res.data?._id);

      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      }).finally(()=>{
        deleteInvitiFromLocalStorage(item?._id);
      })
  };

  const deleteInvitiFromLocalStorage = async invitiId => {
    let guests = JSON.parse(await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`));
    guests = guests.filter(object => {
      return object._id !== invitiId;
    });
    console.log("third", guests.length)
    await AsyncStorage.setItem(`guests_${currentViewingGroup?._id}`, JSON.stringify(guests));
    dispatch(handleInvitiFlag(!invitiFlag));
    hideDialog();
  };

  // item to render in flatlist
  const AccordionItem = ({item}) => {
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

    return (
      <TouchableWithoutFeedback onPress={toggleButton}>
        <View>
          <List.Item
            // title={item.invitiName}
            title={getHighlightedText(item.invitiName)}
            description={item.invitiDescription}
            left={props => (
              <Avatar.Image
                style={props.style}
                size={45}
                avatarStyle={{borderRadius: 20}}
                source={
                  item.invitiImageURL
                    ? {uri: item.invitiImageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            )}
            style={{paddingVertical: '1%'}}
            right={props => {
              if (item.lastStatus?.invitiStatus === 'invited')
                return <List.Icon {...props} icon="check" />;
              if (item.lastStatus?.invitiStatus === 'pending')
                return <List.Icon {...props} icon="clock-outline" />;
              else if (item.lastStatus?.invitiStatus === 'rejected')
                return <List.Icon {...props} icon="cancel" />;
            }}
          />
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
                      navigation.navigate('UpdateInviti', {
                        currentInviti: item,
                      });
                    }}>
                    Edit
                  </Chip>
                  <Chip
                    icon={() => <Icon name="eye" size={16} color={theme.colors.onBackground} />}
                    style={{marginLeft: '4%'}}
                    textStyle={{color: theme.colors.onBackground}}
                    mode="flat"
                    onPress={() => BriefHandler(item)}>
                    Detail
                  </Chip>
                </View>
                <Chip
                  icon={() => <Icon name="trash-2" size={16} color={theme.colors.error} />}
                  style={{marginLeft: '4%'}}
                  textStyle={{color: theme.colors.error}}
                  mode="flat"
                  onPress={() => showDialog(item)}>
                  Delete
                </Chip>
              </View>
            </View>
          </Animated.View>
          <Divider />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);

  // import export modalize
  const importExportModalizeRef = useRef(null);
  const openGuestsImportExportModalize = () => {
    importExportModalizeRef.current?.open();
  };
  const onCloseGuestsImportExport = () => {
    importExportModalizeRef.current?.close();
  };

  // guests Summary modalize
  const guestsSummaryModalizeRef = useRef(null);
  const openGuestsSummaryModalize = () => {
    guestsSummaryModalizeRef.current?.open();
  };

  const [chips, setChips] = useState([
    {id: 0, name: 'Invited', selected: true},
    {id: 1, name: 'Rejected', selected: false},
    {id: 2, name: 'Pending', selected: true},
    {id: 3, name: 'Pending', selected: false},
    {id: 4, name: 'Other', selected: true},
  ]);
  const [selectedChips, setSelectedChips] = useState([]);
  const selectedChipsHandler = id => {
    setSelectedChips([...selectedChips, id]);
  };

  const [token, setToken] = useState('');
  useEffect(() => {
    const getToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getToken();
  }, []);

  return (
    <View style={{flexGrow: 1, backgroundColor: theme.colors.background}}>
      {isHeader && (
        <GuestsAppbar
          openGuestsImportExportModalize={openGuestsImportExportModalize}
          openGuestsSummaryModalize={openGuestsSummaryModalize}
        />
      )}

      {/* <View>
            <ScrollView scrollEnabled horizontal contentContainerStyle={{flex:1, padding:"2%", height:50}} >
              {chips.map((chip, index) => (
                <View key={index} style={{marginHorizontal: '2%'}}>
                  <Chip
                    // selected={chip.selected}
                    mode={chip.selected ? 'flat' : 'outlined'}
                    onPress={() => console.log('Pressed')}>
                    {chip.name}
                  </Chip>
                </View>
              ))}
            </ScrollView>
        </View> */}

      <FlashList
        data={isInvitaionSearch ? invitaionsForSearch : filterdInvities}
        estimatedItemSize={100}
        ListEmptyComponent={() => (
          <View style={{marginTop: '50%', alignItems: 'center'}}>
            {isLoading || localLoading ? (
              <Text>Loading...</Text>
            ) : (
              <Text>
                {isInvitaionSearch ? 'Type something fimiliar to search' : 'No invitation'}
              </Text>
            )}
          </View>
        )}
        renderItem={({item}) => <AccordionItem item={item} />}
        refreshControl={<RefreshControl refreshing={isFetching || isLoading} onRefresh={refetch} />}
      />

      <FAB icon="plus" size="medium" style={styles.fab} onPress={() => FABHandler()} />

      <Banner
        visible={isExportBanner}
        actions={[
          {
            label: 'Understood',
            onPress: () => dispatch(handleIsExportBanner(false)),
          },
        ]}
        icon={({size}) => <Avatar.Icon size={size} icon="check" />}>
        Guests List of this group has been exported in Downlaod folder successfully
      </Banner>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Do you want to delete "{currentItem?.invitiName}"</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              loading={deleteLoading}
              disabled={deleteLoading}
              onPress={() =>
                token ? deleteHandler(currentItem) : deleteInvitiFromLocalStorage(currentItem._id)
              }
              textColor={theme.colors.error}>
              Yes, delete it
            </Button>
            <Button onPress={hideDialog}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Modalize
        modalStyle={{backgroundColor: theme.colors.background}}
        ref={invitiBriefModalizeRef}
        // velocity={800}
        threshold={200}
        snapPoint={400}
        handlePosition="inside"
        modalHeight={600}
        HeaderComponent={() => <InvitiBrief FABHandler={FABHandler} onClose={onBriefClose} />}>
        <List.Accordion
          style={{padding: '4%'}}
          title="Statuses"
          expanded={expanded}
          onPress={handlePress}>
          <View style={{marginHorizontal: '5%'}}>
            <Text style={{marginVertical: '2%', fontWeight: 'bold'}}>Added by</Text>
            <View
              style={{
                borderRadius: 10,
                borderColor: '#C1C2B8',
                borderWidth: 0.5,
                padding: '2%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <Avatar.Icon size={30} icon="account-circle-outline" />
                </View>
                <Text style={{marginHorizontal: '4%'}}>
                  {currentInvitiToDisplay?.addedBy?.name}
                </Text>
              </View>
              <Text style={{}}>{moment(currentInvitiToDisplay?.createdAt).fromNow()}</Text>
            </View>

            <Text style={{marginTop: '5%', fontWeight: 'bold'}}>History</Text>
            <ScrollView>
              {currentInvitiToDisplay?.statuses?.map((Status, index) => (
                <View
                  key={index}
                  style={{
                    borderRadius: 10,
                    borderColor: '#C1C2B8',
                    borderWidth: 0.5,
                    padding: '2%',
                    marginVertical: '2%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}}>
                      <Text style={{padding: '2%'}}>
                        marked as <Text style={{fontWeight: 'bold'}}>{Status.invitiStatus}</Text> by
                      </Text>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar.Image
                          size={30}
                          source={
                            Status?.addedBy?.imageURL
                              ? {uri: Status?.addedBy?.imageURL}
                              : require('../../../../../assets/drawer/male-user.png')
                          }
                        />
                        {/* <Avatar.Icon size={30} icon="account-circle-outline" /> */}
                        <Text style={{marginHorizontal: '4%'}}>{Status?.addedBy?.name}</Text>
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      {Status.invitiStatus === 'rejected' && (
                        <List.Icon style={{margin: 0, padding: 0}} icon="cancel" />
                      )}
                      {Status.invitiStatus === 'pending' && (
                        <List.Icon style={{margin: 0, padding: 0}} icon="clock-outline" />
                      )}
                      {Status.invitiStatus === 'invited' && (
                        <List.Icon style={{margin: 0, padding: 0}} icon="check" />
                      )}

                      <Text style={{alignSelf: 'flex-end'}}>
                        {moment(Status?.createdAt).fromNow()}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </List.Accordion>
      </Modalize>

      <Modalize
        modalStyle={{backgroundColor: theme.colors.surfaceVariant}}
        ref={importExportModalizeRef}
        handlePosition="inside"
        snapPoint={400}>
        <ImportExport group={route.params.group} onClose={onCloseGuestsImportExport} />
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center',
  },
  containerStyle: {
    flex: 1,
    // paddingTop: 20,
    // paddingHorizontal: 24,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    marginBottom: 6,
    flex: 1,
    borderRadius: 10,
  },
  svgStyle: {
    width: 20,
    height: 20,
  },

  title: {
    fontWeight: '600',
  },
});
