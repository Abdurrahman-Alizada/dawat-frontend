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
import {useGetAllInvitationsQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
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

export default function Example({route}) {
  const navigation = useNavigation();

  const {groupId} = route.params;
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
  const invitationSearchQuery = useSelector(state=> state.invitations.invitationSearchQuery)

  useEffect(() => {
    dispatch(handleInvitions(data))
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
  result.split(new RegExp(`(${invitationSearchQuery})`, `gi`)).map((piece, index) => {
    return (
      <Text
        key={index}
        style={
          piece.toLocaleLowerCase() == invitationSearchQuery.toLocaleLowerCase()
            ? {fontWeight:"bold", color: theme.colors.primary}
            : {}
        }>
        {piece}
      </Text>
    );
  });

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
              </View>
            </View>
          </Animated.View>
          <Divider />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      {/* <View
        style={{
          flexDirection: 'row',
          padding: '2%',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        {chips.map(chip => (
          <View key={chip.id} style={{marginHorizontal: '2%'}}>
            <Chip
              selected={chip.selected}
              mode="flat"
              onPress={() => console.log('Pressed')}>
              {chip.name}
            </Chip>
          </View>
        ))}
      </View> */}

      <Banner
        visible={isExportBanner}
        actions={[
          {
            label: 'Understood',
            onPress: () => dispatch(handleIsExportBanner(false)),
          },
        ]}
        icon={({size}) => <Avatar.Icon size={size} icon="check" />}>
        Invitaions List of this group has been exported in Downlaod folder
        successfully
      </Banner>

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
        snapPoint={200}
        handlePosition="inside"
        modalHeight={500}
        HeaderComponent={() => (
          <InvitiBrief FABHandler={FABHandler} onClose={onBriefClose} />
        )}>
        <List.Accordion style={{padding: '4%'}} title="Statuses">
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
                        {Status.invitiStatus} by
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar.Icon size={30} icon="account-circle-outline" />
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
