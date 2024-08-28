import {View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  useGetAllFriendsQuery,
  useDeclineFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import {Button, Text, List, Avatar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const PendingRequest = () => {
  const {t} = useTranslation();
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
    const [textAfterAction, setTextAfterAction] = useState(
      `Request sent to ${item.name} has been deleted.`,
    );

    const [declineFriendRequest, {isLoading: declineRequestLoading}] =
      useDeclineFriendRequestMutation();

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
                onPress={() => handleDeclineFriendRequest(item._id)}
                style={{
                  borderRadius: 5,
                  padding: '2%',
                  marginTop: '5%',
                  backgroundColor: theme.colors.backdrop,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>{t('Cancel')}</Text>
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
        {t("Total request sent")} <Text style={{color: theme.colors.error}}>{data?.pending?.length}</Text>
      </Text>
      <FlatList
        data={data?.pending}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>{t("You didn't sent request to anyone yet")}</Text>
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
