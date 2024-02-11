import {FlatList, RefreshControl, View, SafeAreaView} from 'react-native';
import React, {useState, useRef} from 'react';
import {List, Button, Avatar, Text, useTheme} from 'react-native-paper';
import {
  useGetAllFriendsQuery,
  useDeclineFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import Skeleton from '../../Skeletons/InvitationsList';
import {Modalize} from 'react-native-modalize';
import {useTranslation} from 'react-i18next';

const SeeAllFriends = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const [selectedUser, setSelectedUser] = useState({});
  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllFriendsQuery(
    currentLoginUser?._id,
  );

  const [declineFriendRequest, {isLoading: declineRequestLoading}] =
    useDeclineFriendRequestMutation();

  const handleDeclineFriendRequest = userB => {
    declineFriendRequest({userA: currentLoginUser._id, userB: userB})
      .then(res => {
        onClose();
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <FlatList
          data={data?.accepted}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>{t("There isn't anything in Suggestions")}</Text>
              <Button icon="refresh" mode="contained" style={{marginTop: '5%'}} onPress={refetch}>
                {t('Refresh')}
              </Button>
              <Button
                icon="home"
                mode="contained-tonal"
                style={{marginTop: '5%'}}
                onPress={() => {
                  navigation.navigate('HomeIndex');
                }}>
                {t('Go to home')}
              </Button>
            </View>
          )}
          renderItem={({item}) => (
            <List.Item
              title={item.name}
              onPress={() => {
                setSelectedUser(item);
                onOpen();
              }}
              titleStyle={{fontWeight: '800'}}
              // description={item.email}
              left={props => (
                <Avatar.Image
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
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        />
      )}

      <Modalize
        modalStyle={{backgroundColor: theme.colors.background}}
        ref={modalizeRef}
        snapPoint={400}>
        <View style={{padding: '4%'}}>
          <Button
            loading={declineRequestLoading}
            icon="account-minus"
            mode="contained"
            onPress={() => handleDeclineFriendRequest(selectedUser._id)}>
            {t('UnFriend')} {selectedUser.name}
          </Button>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default SeeAllFriends;
