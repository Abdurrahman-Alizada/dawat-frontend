import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native'
import React from 'react'
import {
  useGetAllFriendsQuery,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import { useSelector } from 'react-redux';
import { Button, List, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
const PendingRequest = ({route}) => {
  
  const navigation = useNavigation();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);

   const {data, isLoading, refetch, isFetching, isError, error} =
    useGetAllFriendsQuery(currentLoginUser?._id);

   const [acceptFriendRequest, {isLoading: acceptRequestLoading}] =
  useAcceptFriendRequestMutation();
const [declineFriendRequest, {isLoading: declineRequestLoading}] =
  useDeclineFriendRequestMutation();

const handleAcceptFriendRequest = userB => {
  acceptFriendRequest({userA: currentLoginUser._id, userB: userB})
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err.message);
    });
};

const handleDeclineFriendRequest = userB => {
  declineFriendRequest({userA: currentLoginUser._id, userB: userB})
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err.message);
    });
};


  return (
    <View>
      {/* list of people who sent request to current login user */}
      <FlatList
        data={data?.requested}
        // data={null}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
          <Text>No one sent you friend request yet</Text>
          <Text>Please refresh or search for new friends</Text>
          <Button
            icon="refresh"
            mode="contained"
            style={{marginTop: '5%', marginHorizontal:"2%"}}
            onPress={refetch}>
            Refresh
          </Button>
          <Button
            icon="account-search"
            mode="text"
            style={{marginTop: '5%',marginHorizontal:"2%"}}
            onPress={()=>navigation.navigate('FriendsSuggestions')}
            >
            Search for friends
          </Button>
          </View>
        )}
        renderItem={({item}) => (
          <List.Item
            titleStyle={{fontWeight: '800'}}
            title={item.name}
            description={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: '5%',
                }}>
                <Button
                  style={{width: '48%'}}
                  mode="contained"
                  onPress={() => handleAcceptFriendRequest(item._id)}>
                  Add
                </Button>
                <Button
                  style={{width: '48%'}}
                  mode="outlined"
                  onPress={() => handleDeclineFriendRequest(item._id)}>
                  Delete
                </Button>
              </View>
            )}
            left={props => (
              <Avatar.Image
                size={80}
                {...props}
                source={
                  item.imageURL
                    ? {uri: item.imageURL}
                    : require('../../../assets/drawer/male-user.png')
                }
              />
            )}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
    </View>
  )
}

export default PendingRequest

const styles = StyleSheet.create({})