import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';
import React from 'react';
import {
  useGetAllFriendsQuery,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import {Button, List, Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
const PendingRequest = ({route}) => {
  const navigation = useNavigation();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);

  const {data, isLoading, refetch, isFetching, isError, error} =
    useGetAllFriendsQuery(currentLoginUser?._id);

  // single item to render
  const RenderItem = ({item}) => {
    const [clicked, setClicked] = useState(false);
    const [textAfterAction, setTextAfterAction] = useState('');

    const [declineFriendRequest, {isLoading: declineRequestLoading}] =
      useDeclineFriendRequestMutation();
    const [acceptFriendRequest, {isLoading: acceptRequestLoading}] =
      useAcceptFriendRequestMutation();

    const handleAcceptFriendRequest = userB => {
      setTextAfterAction(`You are now friend with ${item.name}.`);
      setClicked(true);

      acceptFriendRequest({userA: currentLoginUser._id, userB: userB})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    };
    const handleDeclineFriendRequest = userB => {
      setTextAfterAction(`Friend request of ${item.name} has been deleted.`);
      setClicked(true);

      declineFriendRequest({userA: currentLoginUser._id, userB: userB})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    return (
      <List.Item
        titleStyle={{fontWeight: '800'}}
        title={item.name}
        description={() => (
          <View>
            {clicked ? (
              <Text>{textAfterAction}</Text>
            ) : (
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
          </View>
        )}
        left={props => (
          <Avatar.Image
            size={70}
            {...props}
            source={
              item.imageURL
                ? {uri: item.imageURL}
                : require('../../../assets/drawer/male-user.png')
            }
          />
        )}
      />
    );
  };

  return (
    <View>
      {/* list of people who sent request to current login user */}
      <FlatList
        data={data?.requested}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>No one sent you friend request yet</Text>
            <Text>Please refresh or search for new friends</Text>
            <Button
              icon="refresh"
              mode="contained"
              style={{marginTop: '5%', marginHorizontal: '2%'}}
              onPress={refetch}>
              Refresh
            </Button>
            <Button
              icon="account-search"
              mode="text"
              style={{marginTop: '5%', marginHorizontal: '2%'}}
              onPress={() => navigation.navigate('FriendsSuggestions')}>
              Search for friends
            </Button>
          </View>
        )}
        renderItem={({item}) => <RenderItem item={item} />}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
    </View>
  );
};

export default PendingRequest;
