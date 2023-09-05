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
import GroupBrief from '../GroupBrief/index';
import GuestsAppbar from '../../../../../Components/Appbars/GuestsAppbar';

export default function Example({route}) {
  const navigation = useNavigation();
  const {groupId, isHeader} = route.params;
  const invitiBriefModalizeRef = useRef(null);
  const dispatch = useDispatch();
  const isExportBanner = useSelector(
    state => state.invitations?.isExportBanner,
  );

  const {data, isError, isLoading, error, isFetching, refetch} =
    useGetAllInvitationsQuery({
      groupId,
    });

  const currentInvitiToDisplay = useSelector(
    state => state.invitations?.currentInviti,
  );
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const invitationSearchQuery = useSelector(
    state => state.invitations.invitationSearchQuery,
  );

  useEffect(() => {
    dispatch(handleInvitions(data));
  }, [data]);

  const isInvitaionSearch = useSelector(
    state => state.invitations.isInvitaionSearch,
  );
  const invitaionsForSearch = useSelector(
    state => state.invitations.invitations,
  );
  // useState updates lately, and navigation navigate before the update of state, thats why I used useRef
  const currentInviti = useRef({});
  const FABHandler = item => {
    currentInviti.current = item ? item : {};
    navigation.navigate('AddInviti', {
      groupId: groupId,
      currentInviti: currentInviti.current,
    });
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

  const theme = useTheme();

  const getHighlightedText = result =>
    result
      .split(new RegExp(`(${invitationSearchQuery})`, `gi`))
      .map((piece, index) => {
        return (
          <Text
            key={index}
            style={
              piece.toLocaleLowerCase() ==
              invitationSearchQuery.toLocaleLowerCase()
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
  const deleteHandler = async item => {
    await deleteInviti({
      groupId: currentViewingGroup._id,
      invitiId: item?._id,
    })
      .then(response => {
        hideDialog();
      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      });
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
              if (item.lastStatus.invitiStatus === 'invited')
                return <List.Icon {...props} icon="check" />;
              if (item.lastStatus.invitiStatus === 'pending')
                return <List.Icon {...props} icon="clock-outline" />;
              else if (item.lastStatus.invitiStatus === 'rejected')
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
                    onPress={() => FABHandler(item)}>
                    Edit
                  </Chip>
                  <Chip
                    icon={() => (
                      <Icon
                        name="eye"
                        size={16}
                        color={theme.colors.onBackground}
                      />
                    )}
                    style={{marginLeft: '4%'}}
                    textStyle={{color: theme.colors.onBackground}}
                    mode="flat"
                    onPress={() => BriefHandler(item)}>
                    Detail
                  </Chip>
                </View>
                <Chip
                  icon={() => (
                    <Icon name="trash-2" size={16} color={theme.colors.error} />
                  )}
                  style={{marginLeft: '4%'}}
                  textStyle={{color: theme.colors.error}}
                  mode="flat"
                  // onPress={() => deleteHandler(item)}
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
  const closeGuestsSummaryModalize = () => {
    guestsSummaryModalizeRef.current?.close();
  };

  return (
    <View style={{flexGrow: 1, backgroundColor: theme.colors.background}}>
      {isHeader && (
        <GuestsAppbar
          openGuestsImportExportModalize={openGuestsImportExportModalize}
          openGuestsSummaryModalize={openGuestsSummaryModalize}
        />
      )}
      <Banner
        visible={isExportBanner}
        actions={[
          {
            label: 'Understood',
            onPress: () => dispatch(handleIsExportBanner(false)),
          },
        ]}
        icon={({size}) => <Avatar.Icon size={size} icon="check" />}>
        Guests List of this group has been exported in Downlaod folder
        successfully
      </Banner>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Do you want to delete "{currentItem?.invitiName}"
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button loading={deleteLoading} disabled={deleteLoading} onPress={()=>deleteHandler(currentItem)} textColor={theme.colors.error}>
              Yes, delete it
            </Button>
            <Button onPress={hideDialog}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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

      {isLoading ? (
        <View
          style={{
            margin: '3%',
          }}>
          <InvitaionsList />
        </View>
      ) : (
        <FlashList
          data={isInvitaionSearch ? invitaionsForSearch : data}
          estimatedItemSize={100}
          // keyExtractor={item => item._id}
          ListEmptyComponent={() => (
            <View style={{marginTop: '50%', alignItems: 'center'}}>
              <Text>No invitation</Text>
            </View>
          )}
          renderItem={({item}) => <AccordionItem item={item} />}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      <FAB
        icon="plus"
        size="medium"
        style={styles.fab}
        onPress={() => FABHandler()}
      />
      <Modalize
        modalStyle={{backgroundColor: theme.colors.background}}
        ref={invitiBriefModalizeRef}
        // velocity={800}
        threshold={200}
        snapPoint={400}
        handlePosition="inside"
        modalHeight={600}
        HeaderComponent={() => (
          <InvitiBrief FABHandler={FABHandler} onClose={onBriefClose} />
        )}>
        <List.Accordion
          style={{padding: '4%'}}
          title="Statuses"
          expanded={expanded}
          onPress={handlePress}>
          <View style={{marginHorizontal: '5%'}}>
            <Text style={{marginVertical: '2%', fontWeight: 'bold'}}>
              Added by
            </Text>
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
              <Text style={{}}>
                {moment(currentInvitiToDisplay?.createdAt).fromNow()}
              </Text>
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
                        marked as{' '}
                        <Text style={{fontWeight: 'bold'}}>
                          {Status.invitiStatus}
                        </Text>{' '}
                        by
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar.Image
                          size={30}
                          source={
                            Status?.addedBy?.imageURL
                              ? {uri: Status?.addedBy?.imageURL}
                              : require('../../../../../assets/drawer/male-user.png')
                          }
                        />
                        {/* <Avatar.Icon size={30} icon="account-circle-outline" /> */}
                        <Text style={{marginHorizontal: '4%'}}>
                          {Status?.addedBy?.name}
                        </Text>
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      {Status.invitiStatus === 'rejected' && (
                        <List.Icon
                          style={{margin: 0, padding: 0}}
                          icon="cancel"
                        />
                      )}
                      {Status.invitiStatus === 'pending' && (
                        <List.Icon
                          style={{margin: 0, padding: 0}}
                          icon="clock-outline"
                        />
                      )}
                      {Status.invitiStatus === 'invited' && (
                        <List.Icon
                          style={{margin: 0, padding: 0}}
                          icon="check"
                        />
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
        <GroupBrief
          group={route.params.group}
          onClose={onCloseGuestsImportExport}
        />
      </Modalize>

      <Modalize
        modalStyle={{backgroundColor: theme.colors.surfaceVariant}}
        ref={guestsSummaryModalizeRef}
        handlePosition="inside"
        snapPoint={500}>
        {/* <InvitaionsSummary onClose={closeGuestsSummaryModalize} /> */}
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
