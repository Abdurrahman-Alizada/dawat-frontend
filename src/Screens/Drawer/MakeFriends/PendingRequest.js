import { View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  useGetAllFriendsQuery,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import {Button, List,Text, Avatar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import { useTranslation } from 'react-i18next';

const PendingRequest = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const {t} = useTranslation();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const [selectedItems, setSelectedItems] = useState([]);

  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllFriendsQuery(
    currentLoginUser?._id,
  );

  // single item to render
  const RenderItem = ({item}) => {
    const [clicked, setClicked] = useState(false);
    const [textAfterAction, setTextAfterAction] = useState('');

    const [declineFriendRequest, {isLoading: declineRequestLoading}] =
      useDeclineFriendRequestMutation();
    const [acceptFriendRequest, {isLoading: acceptRequestLoading}] =
      useAcceptFriendRequestMutation();

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
            {clicked || selectedItems.includes(item._id) ? (
              <Text>{t(textAfterAction)}</Text>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop:"5%"
                }}>
                <TouchableOpacity
                  onPress={() => handleAcceptFriendRequest(item._id)}
                  style={{
                    borderRadius: 5,
                    width:"45%",
                    paddingVertical:"3%",
                    backgroundColor: theme.colors.primary,
                  }}>
                  <Text style={{color: theme.colors.onPrimary, textAlign: 'center'}}>{t("Accept")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeclineFriendRequest(item._id)}
                  style={{
                    borderRadius: 5,
                    width:"45%",
                    paddingVertical:"3%",
                    backgroundColor: theme.colors.background,
                    borderColor:theme.colors.error,
                    borderWidth:1,
                    marginHorizontal:"4%"
                  }}>
                  <Text style={{color: theme.colors.error, textAlign: 'center'}}>{t("Delete")}</Text>
                </TouchableOpacity>
              </View>
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
      {/* list of people who sent request to current login user */}
      <Text
        style={{fontWeight: 'bold', fontSize: 16, marginHorizontal: '5%', marginVertical: '2%'}}>
        {t("Friend requests")} <Text style={{color: theme.colors.error}}>{data?.requested?.length}</Text>
      </Text>
      <FlatList
        data={data?.requested}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>{t("No one sent you friend request yet")}</Text>
            <Text>{t("Please refresh or search for new friends")}</Text>
            <Button
              icon="refresh"
              mode="contained"
              style={{marginTop: '5%', marginHorizontal: '2%'}}
              onPress={refetch}>
              {t("Refresh")}
            </Button>
            <Button
              icon="account-search"
              mode="text"
              style={{marginTop: '5%', marginHorizontal: '2%'}}
              onPress={() => navigation.navigate('FriendsSuggestions')}>
              {t("Search for friends")}
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
