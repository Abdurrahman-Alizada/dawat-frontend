import {StyleSheet, FlatList, RefreshControl, View} from 'react-native';
import React, {useState} from 'react';
import FriendScetionAppBar from '../../../Components/FriendsSectionAppbar';
import {
  List,
  Button,
  Avatar,
  ActivityIndicator,
  Text,
  SegmentedButtons,
} from 'react-native-paper';
import {
  useGetAllFriendsQuery,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import Skeleton from '../../Skeletons/InvitationsList';

const Social = ({navigation}) => {
  const [isSearch, setIsSearch] = useState(false);

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

  const [value, setValue] = useState('pending');

  return (
    <View>
      <FriendScetionAppBar
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        // searchFilterFunction={searchFilterFunction}
      />

      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'requested',
            icon: 'account-tie',
            label: 'Friend requests',
          },
          {
            value: 'pending',
            icon: 'account-clock',
            label: 'Request sent',
          },
        ]}
      />

      {isLoading ? (
        <Skeleton />
      ) : (
        <View>
          {value === 'pending' ? (
            // list of those users to whome the login user sent request
            <FlatList
              data={data?.pending}
              ListEmptyComponent={() => (
                <View style={{marginTop: '60%', alignItems: 'center'}}>
                  <Text>You didn't sent request to anyone yet</Text>
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
                        disabled
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
          ) : (
            // list of those users from which request has been received
            <FlatList
              data={data?.requested}
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
                        Accept
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
          )}
        </View>
      )}
    </View>
  );
};

export default Social;

const styles = StyleSheet.create({});
