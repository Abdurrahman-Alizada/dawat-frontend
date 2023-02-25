import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {useGetAllInvitationsQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {handleIsExportBanner} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import {List, Avatar, FAB, Text, useTheme, Banner} from 'react-native-paper';
import InvitaionsList from '../../../../Skeletons/InvitationsList';
import {useNavigation} from '@react-navigation/native';
import InvitiBrief from './InvitiBrief';
import {handleCurrentInviti} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import moment from 'moment';

export default function Example({route}) {
  const navigation = useNavigation();

  const {groupId} = route.params;
  const modalizeRef = useRef(null);
  const invitiBriefModalizeRef = useRef(null);
  const dispatch = useDispatch();
  const isExportBanner = useSelector(
    state => state.invitations?.isExportBanner,
  );

  const {
    data,
    isError,
    isLoading,
    error,
    isFetching,
    refetch,
    getAllInvitations,
  } = useGetAllInvitationsQuery({
    groupId,
  });

  const currentInvitiToDisplay = useSelector(
    state => state.invitations?.currentInviti,
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

  const onBriefOpen = item => {
    invitiBriefModalizeRef.current?.open();
  };

  const onBriefClose = () => {
    invitiBriefModalizeRef.current?.close();
  };

  const theme = useTheme();

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
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          ListEmptyComponent={() => (
            <View style={{marginTop: '50%', alignItems: 'center'}}>
              <Text>No invitation</Text>
            </View>
          )}
          renderItem={({item}) => (
            <List.Item
              onPress={() => BriefHandler(item)}
              title={item.invitiName}
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
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modalize
        modalStyle={{backgroundColor: theme.colors.background}}
        ref={invitiBriefModalizeRef}
        // velocity={800}
        threshold={200}
        modalHeight={500}
        HeaderComponent={() => (
          <InvitiBrief FABHandler={FABHandler} onClose={onBriefClose} />
        )}>
        <List.Accordion style={{padding: '2%'}} title="More">
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
                          {Status.addedBy.name}
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
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: '5%',
    // flex:1,
    // justifyContent: 'flex-start',
  },
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
});
