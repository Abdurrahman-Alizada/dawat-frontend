import { View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  useGetAllFriendsQuery,
  useUndoDeleteFriendSuggestionMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import {Button, List,Text, Avatar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const PendingRequest = ({route}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);

  const [selectedItems, setSelectedItems] = useState([]);

  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllFriendsQuery(
    currentLoginUser?._id,
  );

  // single item to render
  const RenderItem = ({item}) => {
    const [clicked, setClicked] = useState(false);
    const [textAfterAction] = useState(`Undo successfully.`);

    const [undoDeleteFriendSuggestion, {isLoading: undoDeleteFriendSuggestionLoading}] =
      useUndoDeleteFriendSuggestionMutation();

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

    return (
      <List.Item
        titleStyle={{fontWeight: '800'}}
        title={item.name}
        description={() => (
          <View>
            {clicked || selectedItems.includes(item._id) ? (
              <Text>{textAfterAction}</Text>
            ) : (
              <TouchableOpacity
                onPress={() => handleUndoDeletedFriendSuggestion(item._id)}
                style={{
                  borderRadius: 5,
                  padding: '2%',
                  marginTop: '5%',
                  backgroundColor: theme.colors.primary,
                }}>
                <Text style={{color: theme.colors.onPrimary, textAlign: 'center'}}>Undo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        left={props => (
          <Avatar.Image
            size={70}
            {...props}
            source={
              item.imageURL ? {uri: item.imageURL} : require('../../../assets/drawer/male-user.png')
            }
          />
        )}
      />
    );
  };

  return (
    <View>
      {/* list of people to whom current login user sent request */}
      <Text
        style={{fontWeight: 'bold', fontSize: 16, marginHorizontal: '5%', marginVertical: '2%'}}>
        Friend suggestions deleted{' '}
        <Text style={{color: theme.colors.error}}>{data?.deleted?.length}</Text>
      </Text>
      <FlatList
        data={data?.deleted}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>Deleted suggestions will appear here.</Text>
            <Button
              icon="refresh"
              mode="contained"
              style={{marginTop: '5%', marginHorizontal: '2%'}}
              onPress={refetch}>
              Refresh
            </Button>
          </View>
        )}
        renderItem={({item}) => <RenderItem item={item} />}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      />
    </View>
  );
};

export default PendingRequest;
