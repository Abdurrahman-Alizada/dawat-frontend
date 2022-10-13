import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet,Text, View, FlatList, RefreshControl} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {
  allInvitations,
  useGetAllInvitationsQuery,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {
  List,
  Avatar,
  FAB,
  Modal,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import AddCategory from './AddCategory';
import AsyncStorage from '@react-native-community/async-storage';
const modalHeight = height * 0.7;

export default function Example({route}) {
  const {groupId} = route.params;

  const invitationList = useSelector(state => state.invitations.invitations);
  const animating = useSelector(state => state.invitations.invitationLoader);
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();

  const {data, isError, isLoading, error} = useGetAllInvitationsQuery({
    groupId,
  });

  const getAllInvitations = async () => {
    let token = await AsyncStorage.getItem('token');
    dispatch(allInvitations({token, groupId}));
  };
  useEffect(() => {
    getAllInvitations();
  }, []);

  const [visible, setVisible] = useState(false);

  const FABHandler = () => {
    setVisible(true);
  };
  const close = () => {
    modalizeRef.current?.close();
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

  return (
    <View style={{flex: 1}}>
      <View
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
      </View>

      {isLoading ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <ActivityIndicator animating={animating} />
        </View>
      ) : (
        <View>
          {data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={item => item._id}
              renderItem={({item, section, index}) => (
                <List.Item
                  title={item.invitiName}
                  description={item.invitiDescription}
                  left={props => (
                    <Avatar.Icon
                      size={30}
                      icon="account-circle-outline"
                      style={{alignSelf: 'center'}}
                    />
                  )}
                  right={props => <List.Icon {...props} icon="check-circle" />}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={animating}
                  onRefresh={getAllInvitations}
                />
              }
            />
          ) : (
            <Text>No Invitation yet</Text>
          )}
        </View>
      )}

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modal animationType="slide" visible={visible}>
        <AddInviti setVisible={setVisible} groupId={groupId} />
      </Modal>
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
