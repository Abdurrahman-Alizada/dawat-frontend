import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Searchbar, Text, Avatar, List, Button, useTheme} from 'react-native-paper';
import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useDeleteFriendsSeggestionMutation,
  useSearchForFriendMutation,
  useSearchFriendsForUserMutation,
  useSendFriendRequestMutation,
  useUndoDeleteFriendSuggestionMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';

const FriendsSearch = ({navigation}) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(null);
  const [SearchFriendsForUser, {isLoading}] = useSearchFriendsForUserMutation();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);

  const [selectedItems, setSelectedItems] = useState([]);

  const updateSearch = search => {
    setSearch(search);

    SearchFriendsForUser({search: search, userId: currentLoginUser?._id})
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

  const [sendFriendRequest, {}] = useSendFriendRequestMutation();
  const [deleteFriendsSeggestion, {}] = useDeleteFriendsSeggestionMutation();
  const [declineFriendRequest, {}] = useDeclineFriendRequestMutation();
  const [undoDeleteFriendSuggestion, {}] = useUndoDeleteFriendSuggestionMutation();
  const [acceptFriendRequest, {}] = useAcceptFriendRequestMutation();

  const RenderItem = ({item}) => {

    const [clicked, setClicked] = useState(false);
    const [textAfterAction, setTextAfterAction] = useState('');

    const handledeleteFriendsSeggestion = userB => {
      setSelectedItems([...selectedItems, item._id]);
      setTextAfterAction(`Suggestion of ${item.name} has been deleted`);
      setClicked(true);

      deleteFriendsSeggestion({userA: currentLoginUser?._id, userB: userB})
        .then(res => {
          // console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    };
    const handleSendFriendRequest = userB => {
      setSelectedItems([...selectedItems, item._id]);
      setTextAfterAction(`Your request has been sent to ${item.name}`);
      setClicked(true);

      sendFriendRequest({userA: currentLoginUser?._id, userB: userB})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    const handleDeclineFriendRequest = userB => {
      setClicked(true);
      setSelectedItems([...selectedItems, item._id]);
      declineFriendRequest({userA: currentLoginUser._id, userB: userB})
        .then(res => {
          console.log('freind request has been declined');
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    const handleUndoDeletedFriendSuggestion = userB => {
      setClicked(true);
      setSelectedItems([...selectedItems, item._id]);
      undoDeleteFriendSuggestion({userA: currentLoginUser._id, userB: userB})
        .then(res => {
          console.log('freind request has been declined');
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    const handleAcceptFriendRequest = userB => {
      setSelectedItems([...selectedItems, item._id]);
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

    return (
      <List.Item
        titleStyle={{fontWeight: '800'}}
        title={getHighlightedText(item.name)}
        description={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '1%',
            }}>
            {item?.friendsStatus === 0 && (
              <View>
                {clicked || selectedItems.includes(item._id) ? (
                  <Text>{textAfterAction}</Text>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: '4%',
                    }}>
                    <TouchableOpacity
                      onPress={() => handleSendFriendRequest(item._id)}
                      style={{
                        borderRadius: 5,
                        width: '45%',
                        paddingVertical: '2%',
                        backgroundColor: theme.colors.primary,
                      }}>
                      <Text style={{color: theme.colors.onPrimary, textAlign: 'center'}}>Add</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handledeleteFriendsSeggestion(item._id)}
                      style={{
                        borderRadius: 5,
                        width: '45%',
                        paddingVertical: '2%',
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.tertiary,
                        borderWidth: 1,
                        marginHorizontal: '4%',
                      }}>
                      <Text style={{color: theme.colors.tertiary, textAlign: 'center'}}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {item?.friendsStatus === 1 && (
              <View>
                {clicked || selectedItems.includes(item._id) ? (
                  <Text>{textAfterAction}</Text>
                ) : (
                  <View>
                   <Text variant="bodySmall" style={{color:theme.colors.secondary}}>Friend request</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: '2%',
                    }}>

                    <TouchableOpacity
                      onPress={() => handleAcceptFriendRequest(item._id)}
                      style={{
                        borderRadius: 5,
                        width: '45%',
                        paddingVertical: '2%',
                        backgroundColor: theme.colors.primary,
                      }}>
                      <Text style={{color: theme.colors.onPrimary, textAlign: 'center'}}>
                        Accept
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeclineFriendRequest(item._id)}
                      style={{
                        borderRadius: 5,
                        width: '45%',
                        paddingVertical: '2%',
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.error,
                        borderWidth: 1,
                        marginHorizontal: '4%',
                      }}>
                      <Text style={{color: theme.colors.error, textAlign: 'center'}}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  </View>
                )}
              </View>
            )}
            {item?.friendsStatus === 2 && (
              <View style={{width: '100%'}}>
                {clicked || selectedItems.includes(item._id) ? (
                  <Text>{textAfterAction}</Text>
                ) : (
                  <View>
                   <Text variant="bodySmall" style={{color:theme.colors.secondary}}>Request sent</Text>
                    
                  <TouchableOpacity
                    onPress={() => handleDeclineFriendRequest(item._id)}
                    style={{
                      borderRadius: 5,
                      padding: '2%',
                      marginTop: '2%',
                      backgroundColor: theme.colors.backdrop,
                    }}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>Cancel</Text>
                  </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {item?.friendsStatus === 3 && (
              <View style={{width: '100%'}}>
                {clicked || selectedItems.includes(item._id) ? (
                  <Text>{textAfterAction}</Text>
                ) : (
                  <View>
                   <Text variant="bodySmall" style={{color:theme.colors.primary}}>Friend</Text>

                  <TouchableOpacity
                    onPress={() => handleDeclineFriendRequest(item._id)}
                    style={{
                      borderRadius: 5,
                      padding: '3%',
                      marginTop: '2%',
                      backgroundColor: theme.colors.error,
                    }}>
                    <Text style={{color: theme.colors.onError, textAlign: 'center'}}>UnFriend</Text>
                  </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {item?.friendsStatus === 4 && (
              <View style={{width: '100%'}}>
                {clicked || selectedItems.includes(item._id) ? (
                  <Text>{textAfterAction}</Text>
                ) : (
                  <View style={{}}>
                   <Text variant="bodySmall" style={{color:theme.colors.tertiary}}>Friend suggestion deleted</Text>
                  <TouchableOpacity
                    onPress={() => handleUndoDeletedFriendSuggestion(item._id)}
                    style={{
                      borderRadius: 5,
                      padding: '3%',
                      marginTop: '2%',
                      backgroundColor: theme.colors.primary,
                    }}>
                    <Text style={{color: theme.colors.onPrimary, textAlign: 'center'}}>Undo</Text>
                  </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {item?.friendsStatus === 5 && <Text>blocked</Text>}
          </View>
        )}
        left={props => (
          <Avatar.Image
            size={80}
            {...props}
            source={
              item.imageURL ? {uri: item.imageURL} : require('../../../assets/drawer/male-user.png')
            }
          />
        )}
      />
    );
  };

  const getHighlightedText = result =>
    result?.split(new RegExp(`(${search})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == search.toLocaleLowerCase()
              ? {fontWeight: 'bold', color: theme.colors.primary}
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
        loading={isLoading}
        theme={{roundness: 0}}
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
        renderItem={({item}) => <RenderItem item={item} />}
      />
    </View>
  );
};

export default FriendsSearch;
