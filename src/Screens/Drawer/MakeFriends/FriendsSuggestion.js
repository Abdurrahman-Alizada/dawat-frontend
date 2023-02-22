import {StyleSheet, Text,FlatList, RefreshControl, View} from 'react-native';
import React, {useState} from 'react';
import {List, Button, Avatar} from 'react-native-paper';
import {
  useGetAllFriendsQuery,
  useSendFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import Skeleton from '../../Skeletons/InvitationsList'
const FriendsSuggestions = ({navigation}) => {
  const [isSearch, setIsSearch] = useState(false);

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const {data, isLoading, refetch, isFetching, isError, error} =
    useGetAllFriendsQuery(currentLoginUser?._id);

  const [sendFriendRequest, {isLoading: sendRequestLoading}] =
    useSendFriendRequestMutation();

  const handleSendFriendRequest = userB => {
    console.log(currentLoginUser?._id, userB);
    sendFriendRequest({userA : currentLoginUser?._id, userB : userB})
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    
    <View>
      {isLoading ? (
        <Skeleton />
      ) : (
        <FlatList
          data={data?.addFriend}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>There isn't anything in Suggestions</Text>
              <Button icon="refresh" mode="contained" style={{marginTop:"5%"}} onPress={refetch}>
                Refresh
              </Button>
              <Button icon="home" mode="contained-tonal" style={{marginTop:"5%"}} onPress={()=>{
                navigation.navigate("HomeIndex")
              }}>
                Go to home
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
                    onPress={() => handleSendFriendRequest(item._id)}>
                    Add
                  </Button>
                  <Button
                    style={{width: '48%'}}
                    mode="outlined"
                    onPress={() => console.log('Pressed')}>
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
  );
};

export default FriendsSuggestions;

const styles = StyleSheet.create({});
