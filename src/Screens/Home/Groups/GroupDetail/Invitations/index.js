import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  RefreshControl,
  Share,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {useGetAllInvitationsQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {handleIsExportBanner} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import {
  List,
  Avatar,
  FAB,
  Text,
  Modal,
  Chip,
  ActivityIndicator,
  useTheme,
  Banner,
} from 'react-native-paper';
import AddCategory from './AddCategory';
import AsyncStorage from '@react-native-community/async-storage';
import InvitaionsList from '../../../../Skeletons/InvitationsList';
import {useNavigation} from '@react-navigation/native';
import InvitiBrief from './InvitiBrief';
import {handleCurrentInviti} from '../../../../../redux/reducers/groups/invitations/invitationSlice';

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

  const BriefHandler = (item) => {
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
    <View style={{flex: 1, backgroundColor:theme.colors.surface}}>
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
              onPress={()=>BriefHandler(item)}
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
        modalStyle={{backgroundColor: theme.colors.surface}}
        ref={invitiBriefModalizeRef}
        snapPoint={400}>
        <InvitiBrief FABHandler={FABHandler} onClose={onBriefClose} />
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
