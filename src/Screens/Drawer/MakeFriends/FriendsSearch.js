import {StyleSheet, View, FlatList} from 'react-native';
import React, {useState} from 'react';
import {Searchbar, Text, Avatar, List, Button} from 'react-native-paper';
import {useSearchForFriendMutation, useSendFriendRequestMutation} from '../../../redux/reducers/Friendship/friendshipThunk';
import { useSelector } from 'react-redux';
const FriendsSearch = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(null);
  const [searchForFriend, {isLoading}] = useSearchForFriendMutation();
  
  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);

  const [sendFriendRequest, {isLoading: sendRequestLoading}] =
  useSendFriendRequestMutation();

const handleSendFriendRequest = userB => {
  sendFriendRequest({userA : currentLoginUser?._id, userB : userB})
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err.message);
    });
};

  const updateSearch = search => {
    setSearch(search);

    searchForFriend(search)
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const BlurHandler = () => {
    navigation.goBack();
  };

  const getHighlightedText = result =>
    result.split(new RegExp(`(${search})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == search.toLocaleLowerCase()
              ? {backgroundColor: 'yellow', color: '#000'}
              : {}
          }>
          {piece}
        </Text>
      );
    });
  return (
    <View style={{flex: 1}}>
      <Searchbar
        placeholder="Search..."
        onChangeText={updateSearch}
        value={search}
        icon="arrow-left"
        onIconPress={BlurHandler}
        cancelButtonTitle="cancel"
        autoFocus
        elevation={2}
        loading={isLoading}
      />

      <FlatList
        data={users}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>There is nothing to appear.</Text>
            <Text>Please broaden you search keyword</Text>
          </View>
        )}
        renderItem={({item}) => (
          <List.Item
            titleStyle={{fontWeight: '800'}}
            title={getHighlightedText(item.name)}
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
                  loading={sendRequestLoading}
                  disabled={sendRequestLoading}
                  onPress={() => handleSendFriendRequest(item._id)}>
                  Add
                </Button>
                <Button
                  style={{width: '48%'}} 
                  mode="outlined"
                  disabled
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
      />
    </View>
  );
};

export default FriendsSearch;