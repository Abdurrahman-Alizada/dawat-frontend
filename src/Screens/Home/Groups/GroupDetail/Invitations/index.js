import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {
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
import { useNavigation } from '@react-navigation/native';

export default function Example({route}) {
  const navigation = useNavigation();

  const {groupId} = route.params;
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();

  const {data, isError, isLoading, error, isFetching, refetch, getAllInvitations} = useGetAllInvitationsQuery({
    groupId,
  });

  // useState updates lately, and navigation navigate before the update of state, thats why I used useRef
  const currentInviti = useRef({})
  const FABHandler = (item) => {
    currentInviti.current = item ? item : {}
    navigation.navigate("AddInviti", { groupId:groupId, currentInviti:currentInviti.current})
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
    <View style={{flex: 1,}}>
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

      {isLoading ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : (
            <FlatList
              data={data}
              keyExtractor={item => item._id}
              ListEmptyComponent={()=> 
                <View style={{marginTop:"50%", alignItems: 'center'}}>
                <Text>No invitation</Text>
              </View>
              }
              renderItem={({item}) => (
                <List.Item
                  onPress={()=>FABHandler(item)}
                  title={item.invitiName}
                  description={item.invitiDescription}
                  left={props => (
                    <Avatar.Image 
                      style={props.style}
                      size={45}
                      avatarStyle={{borderRadius: 20}}
                      source={item.invitiImageURL ? {uri:item.invitiImageURL} : require('../../../../../assets/drawer/male-user.png')}
                    />
                  )}
                  style={{paddingVertical: '1%'}}
                  right={
                  (props) =>{
                    
                    if(item.lastStatus.invitiStatus === "invited") return <List.Icon {...props} icon="check" />
                    if(item.lastStatus.invitiStatus === "pending") return <List.Icon {...props} icon="clock-outline" />
                    else if(item.lastStatus.invitiStatus === "rejected") return <List.Icon {...props} icon="cancel" />
                    
                  } 
                }
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isFetching}
                  onRefresh={refetch}
                />
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
      
      {/* <Modal animationType="slide" visible={visible}>
        <AddInviti setVisible={setVisible} groupId={groupId} currentInviti={currentInviti} />
      </Modal> */}
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
